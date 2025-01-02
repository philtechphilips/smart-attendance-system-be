import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/auth/entities/auth.entity';
import { IDateQuery, IPaginationQuery } from 'src/shared/interfaces/date-query';
import { Staff } from 'src/staffs/entities/staff.entity';
import { applyPagination } from 'src/repository/base.repository';
import { AttendanceQueryDto } from 'src/shared/dto/attendance.dto';
import { AttendanceGateway } from 'src/shared/socket/attendance.socket';
import { Level } from 'src/levels/entities/level.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly attendanceGateway: AttendanceGateway,
  ) {}

  /**
   * Create a new attendance record
   * @param createAttendanceDto - Data Transfer Object for creating attendance
   */
  async createAttendance(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    const { studentId, courseId, status } = createAttendanceDto;

    // Validate Student
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Validate Course
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Create and save attendance
    const attendance = this.attendanceRepository.create({
      student,
      course,
      status: status || 'absent', // Default status
    });

    // this.attendanceGateway.sendAttendanceUpdate(attendanceData);

    return this.attendanceRepository.save(attendance);
  }

  /**
   * Get attendance records by course
   * @param courseId - UUID of the course
   */
  async getAttendanceByCourse(courseId: string): Promise<Attendance[]> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return this.attendanceRepository.find({
      where: { course },
      relations: ['student'], // Eager load the related student data
    });
  }

  /**
   * Get attendance records for a specific student
   * @param studentId - UUID of the student
   */
  async getAttendanceByStudent(studentId: string): Promise<Attendance[]> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return this.attendanceRepository.find({
      where: { student },
      relations: ['course'], // Eager load the related course data
    });
  }

  /**
   * Mark attendance for a student
   * @param attendanceId - UUID of the attendance record
   * @param status - New status to update
   */
  async updateAttendanceStatus(
    attendanceId: string,
    status: 'present' | 'absent' | 'late',
  ): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance record with ID ${attendanceId} not found`,
      );
    }

    attendance.status = status;

    return this.attendanceRepository.save(attendance);
  }

  async getAttendanceByDepartment(
    pagination: IPaginationQuery,
    user: User,
    query?: AttendanceQueryDto,
    period?: IDateQuery,
  ) {
    const getUserDept = await this.staffRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user', 'department'],
    });

    if (!getUserDept) {
      throw new NotFoundException('Error finding your department!');
    }

    const attendanceRecords = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.department', 'department')
      .leftJoinAndSelect('student.level', 'level')
      .leftJoinAndSelect('attendance.course', 'course')
      .leftJoinAndSelect('course.lecturer', 'lecturer')
      .where('department.id = :departmentId', {
        departmentId: getUserDept.department.id,
      });

    if (query && query.status && query.status !== 'all') {
      attendanceRecords.andWhere('attendance.status = :status', {
        status: query?.status?.toLowerCase(),
      });
    }

    if (period.selectedDate) {
      attendanceRecords.andWhere(
        'CONVERT(date,attendance.timestamp) = CONVERT(date,:selectedDate)',
        {
          selectedDate: period.selectedDate,
        },
      );
    } else if (period.startDate && period.endDate) {
      attendanceRecords
        .andWhere('attendance.timestamp >= :startDate', {
          startDate: period.startDate,
        })
        .andWhere('attendance.timestamp <= :endDate', {
          endDate: period.endDate,
        });
    }

    if (query && query.level && query.level !== 'all') {
      attendanceRecords.andWhere('level.name = :level', {
        level: query?.level?.toLowerCase(),
      });
    }

    const totalAttendance = await attendanceRecords.getCount();

    const paginatedQuery = await applyPagination(attendanceRecords, pagination);

    const attendance = await paginatedQuery.getMany();

    return {
      items: attendance,
      pagination: {
        total: totalAttendance,
        currentPage: pagination.currentPage,
      },
    };
  }

  async getAttendanceById(id: string) {
    try {
      const attendance = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'student')
        .leftJoinAndSelect('student.department', 'department')
        .leftJoinAndSelect('student.level', 'level')
        .leftJoinAndSelect('attendance.course', 'course')
        .leftJoinAndSelect('course.lecturer', 'lecturer')
        .where('attendance.id = :id', { id });

      const attendanceRecord = await attendance.getOne();
      if (!attendanceRecord) {
        throw new NotFoundException('Attendance Not Found!');
      }
      return attendanceRecord;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error, 500);
    }
  }

  async autoMarkAbsentForLevelAndCourse(
    levelId: string,
    courseId: string,
    date: Date,
  ): Promise<void> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch the course with its related class
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['class'],
    });

    if (!course) {
      console.log(`Course with ID ${courseId} not found.`);
      return;
    }

    // Check if the course's class matches the specified level
    if (course.class.id !== levelId) {
      console.log(
        `Course class ID ${course.class.id} does not match level ID ${levelId}.`,
      );
      return;
    }

    // Fetch all students in the specified level and attendance for the course on that day
    const [students, attendances] = await Promise.all([
      this.studentRepository.find({
        where: { level: { id: levelId } },
        relations: ['level'],
      }),
      this.attendanceRepository.find({
        where: {
          course: { id: courseId },
          timestamp: Between(startOfDay, endOfDay),
        },
        relations: ['student'], // Load related student entities
      }),
    ]);

    if (!students.length) {
      console.log(`No students found for level ID ${levelId}`);
      return;
    }

    // Map attendance records to a set for faster lookup
    const markedStudentIds = new Set(attendances.map((att) => att.student.id));

    // Identify students without attendance for the course
    const absentStudents = students.filter(
      (student) => !markedStudentIds.has(student.id),
    );

    if (!absentStudents.length) {
      console.log(
        `No absent students for course ${courseId} and level ${levelId} on ${date}`,
      );
      return;
    }

    // Create and save absent records in bulk
    const absentRecords = absentStudents.map((student) => ({
      student,
      course,
      status: 'absent' as const, // Correctly typed status
    }));

    await this.attendanceRepository.save(absentRecords);

    console.log(
      `${absentRecords.length} students marked as absent for course ${courseId} and level ${levelId} on ${date}`,
    );
  }
}
