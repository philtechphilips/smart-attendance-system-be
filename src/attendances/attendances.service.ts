import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import {
  CreateAttendanceDto,
  MarkAttendanceDto,
} from './dto/create-attendance.dto';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/auth/entities/auth.entity';
import { IDateQuery, IPaginationQuery } from 'src/shared/interfaces/date-query';
import { Staff } from 'src/staffs/entities/staff.entity';
import { applyPagination } from 'src/repository/base.repository';
import { AttendanceQueryDto } from 'src/shared/dto/attendance.dto';
import { AttendanceGateway } from 'src/shared/socket/attendance.socket';
import { Level } from 'src/levels/entities/level.entity';
import { Semester } from 'src/semesters/entities/semester.entity';

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
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
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
      relations: ['level'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const semester = await this.semesterRepository.findOne({
      where: { active: true },
    });

    if (!semester) {
      throw new NotFoundException(`No active Semester`);
    }

    // Validate Course
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['class'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    if (course.class.id !== student.level.id) {
      throw new BadRequestException(
        `Student level and course level does not match!`,
      );
    }

    // Create and save attendance
    const attendance = this.attendanceRepository.create({
      student,
      course,
      semester,
      status: status || 'absent',
    });

    return this.attendanceRepository.save(attendance);
  }

  async mark(data: MarkAttendanceDto) {
    try {
      const { studentId, courseId, image } = data;

      // Validate Student
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
        relations: ['level'],
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      // Validate Course
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
        relations: ['class'],
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      if (course.class.id !== student.level.id) {
        throw new BadRequestException(
          `Student level and course level do not match!`,
        );
      }

      const semester = await this.semesterRepository.findOne({
        where: { active: true },
      });

      if (!semester) {
        throw new NotFoundException(`No active Semester`);
      }

      // Check if attendance already exists for the student, course, and semester
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const existingAttendance = await this.attendanceRepository.findOne({
        where: {
          student: { id: studentId },
          course: { id: courseId },
          semester: { id: semester.id },
          timestamp: Between(startOfDay, endOfDay),
        },
      });

      if (existingAttendance) {
        return {
          statusCode: 400,
          message: `Attendance has already been recorded for ${student.firstname} ${student.lastname} on this day.`,
          attendance: existingAttendance,
          success: false,
        };
      }

      // Create and save new attendance record
      const attendance = this.attendanceRepository.create({
        student,
        course,
        semester,
        status: 'present',
        image: Buffer.from(image, 'base64'),
      });

      const savedAttendance = await this.attendanceRepository.save(attendance);

      return {
        statusCode: 201,
        message: `Attendance marked successfully for ${student.firstname} ${student.lastname}`,
        attendance: savedAttendance,
        success: true,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message || 'Error marking attendance', 500);
    }
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
    search?: string,
  ) {
   const searchQuery = search?.search ?? null
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
      .leftJoinAndSelect('course.lecturer', 'lecturer');

      if(searchQuery) {
        attendanceRecords.andWhere(
          '(student.firstname LIKE :search OR student.lastname LIKE :search OR student.matricNo LIKE :search)',
          { search: `%${searchQuery}%` },
        );
      }

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

  async getStudentAttendanceDetails(studentId: string) {
    // Fetch attendance records for the student with proper relations
    const attendanceRecords = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.course', 'course')
      .leftJoinAndSelect('course.lecturer', 'lecturer')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.level', 'class')
      .where('student.id = :studentId', { studentId })
      .getMany();


    // Calculate total classes, present, and absent counts
    const totalClasses = attendanceRecords.length;
    const totalPresent = attendanceRecords.filter(
      (record) => record.status === 'present',
    ).length;
    const totalAbsent = totalClasses - totalPresent;

    // Aggregate data per course
    const courseAttendance = attendanceRecords.reduce((acc, record) => {
      const courseId = record.course.id;
      if (!acc[courseId]) {
        acc[courseId] = {
          course: record.course,
          lecturer: record.course.lecturer,
          present: 0,
          absent: 0,
        };
      }
      if (record.status === 'present') {
        acc[courseId].present += 1;
      } else {
        acc[courseId].absent += 1;
      }
      return acc;
    }, {});

    // Format course attendance data for the table
    const courseAttendanceTable = Object.values(courseAttendance).map(
      (courseData: any) => ({
        course: courseData?.course,
        present: courseData.present,
        absent: courseData.absent,
        percentage: (
          (courseData.present / (courseData.present + courseData.absent)) *
          100
        ).toFixed(2),
      }),
    );

    // Determine the student's class
    const studentClass = attendanceRecords[0]?.student?.level?.id;

    if (!studentClass) {
      throw new Error('Student class not found');
    }

    // Calculate the student's rank in terms of attendance within the same class
    const allStudentsAttendanceInClass = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoin('attendance.student', 'student')
      .select('student.id', 'studentId')
      .addSelect('COUNT(attendance.id)', 'totalClasses')
      .addSelect(
        `SUM(CASE WHEN attendance.status = 'present' THEN 1 ELSE 0 END)`,
        'totalPresent',
      )
      .where('student.level = :classId', { classId: studentClass })
      .groupBy('student.id')
      .orderBy('totalPresent', 'DESC')
      .addOrderBy('student.id', 'ASC') // Optional: resolve ties by student ID
      .getRawMany();

    const studentRank =
      allStudentsAttendanceInClass.findIndex(
        (att) => att.studentId === studentId,
      ) + 1;

    // Return all details
    return {
      totalClasses,
      totalPresent,
      totalAbsent,
      courseAttendanceTable,
      studentRank,
      totalStudents: allStudentsAttendanceInClass.length,
    };
  }

  async getAStudentAttendanceDetails(id: string) {
    const student = await this.studentRepository.findOne({
      where: {
        user: { id: id }, // Query using the relationship property "user" and its "id"
      },
    });

    const studentId = student.id;

    // Fetch attendance records for the student with proper relations
    const attendances = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.course', 'course')
      .leftJoinAndSelect('course.lecturer', 'lecturer')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.level', 'class')
      .where('student.id = :studentId', { studentId })
      .getMany();

    return {
      attendances
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

    // Fetch all students in the specified level and attendance for the course on that day
    const [students, attendances] = await Promise.all([
      this.studentRepository.find({
        where: { level: { id: course.class.id } },
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
      console.log(`No students found for level ${course.class.id}`);
      return;
    }

    // Check if any classmates attended the session
    const presentStudentIds = new Set(attendances.map((att) => att.student.id));
    if (presentStudentIds.size === 0) {
      console.log(
        `No classmates attended the course ${courseId} on ${date}. Absent marking skipped.`,
      );
      return;
    }

    // Identify students without attendance for the course
    const absentStudents = students.filter(
      (student) => !presentStudentIds.has(student.id),
    );

    if (!absentStudents.length) {
      console.log(`No absent students for course ${courseId} on ${date}`);
      return;
    }

    const semester = await this.semesterRepository.findOne({
      where: { active: true },
    });

    if (!semester) {
      throw new NotFoundException(`No active Semester`);
    }

    // Create and save absent records in bulk
    const absentRecords = absentStudents.map((student) => ({
      student,
      course,
      semester,
      status: 'absent' as const, // Correctly typed status
    }));

    console.log(absentRecords);

    await this.attendanceRepository.save(absentRecords);

    console.log(
      `${absentRecords.length} students marked as absent for course ${courseId} on ${date}`,
    );
  }
}
