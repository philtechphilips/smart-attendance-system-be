import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
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

  async getAttendanceByDepartment(departmentId: string): Promise<Attendance[]> {
    const attendanceRecords = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('attendance.course', 'course')
      .where('student.departmentId = :departmentId', { departmentId })
      .getMany();

    if (!attendanceRecords.length) {
      throw new NotFoundException(
        `No attendance records found for department ID ${departmentId}`,
      );
    }

    return attendanceRecords;
  }
}
