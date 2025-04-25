import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Staff } from 'src/staffs/entities/staff.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Attendance } from 'src/attendances/entities/attendance.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Staff)
    private readonly lecturerRepository: Repository<Staff>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async dashboardData() {
    const totalStudents = await this.studentRepository.count();
    const totalLecturers = await this.lecturerRepository.count();
    const totalCourses = await this.courseRepository.count();

    const dailyAttendance = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('DATE(attendance.timestamp) = CURDATE()')
      .getCount();

    const totalAttendanceRecords = await this.attendanceRepository.count();
    const averageAttendanceRate =
      (totalAttendanceRecords / (totalStudents * totalCourses)) * 100;

    return {
      totalStudents,
      totalLecturers,
      totalCourses,
      dailyAttendance,
      averageAttendanceRate: averageAttendanceRate.toFixed(2),
    };
  }

  async attendanceInsights() {
    const overallAttendanceTrends = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .select('DATE(attendance.timestamp)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('DATE(attendance.timestamp)')
      .orderBy('DATE(attendance.timestamp)', 'ASC')
      .getRawMany();

    const departmentWiseAttendance = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoin('attendance.course', 'course')
      .leftJoin('course.department', 'department')
      .select('department.id', 'departmentId')
      .addSelect('department.name', 'departmentName')
      .addSelect('COUNT(*)', 'count')
      .groupBy('department.id')
      .addGroupBy('department.name')
      .getRawMany();

    const topLowAttendanceStudents = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoin('student.attendances', 'attendance')
      .leftJoin('student.department', 'department')
      .select('student.id', 'studentId')
      .addSelect('student.lastname', 'studentName')
      .addSelect('department.name', 'departmentName')
      .addSelect('COUNT(attendance.id)', 'attendanceCount')
      .groupBy('student.id')
      .addGroupBy('student.lastname')
      .addGroupBy('department.name')
      .orderBy('attendanceCount', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      overallAttendanceTrends,
      departmentWiseAttendance,
      topLowAttendanceStudents,
    };
  }

  async studentDepartmentPerformance() {
    // ✅ Top-performing departments by attendance count
    const topPerformingDepartments = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoin('attendance.course', 'course')
      .leftJoin('course.department', 'department')
      .select('department.id', 'departmentId')
      .addSelect('department.name', 'departmentName')
      .addSelect('COUNT(*)', 'attendanceCount')
      .groupBy('department.id')
      .addGroupBy('department.name')
      .orderBy('attendanceCount', 'DESC')
      .limit(5)
      .getRawMany();

    // ✅ Students with attendance rate below 75%
    const studentsWithCriticalIssues = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoin('student.attendances', 'attendance')
      .select('student.id', 'studentId')
      .addSelect('student.firstname', 'firstname')
      .addSelect('student.lastname', 'lastname')
      .addSelect(
        "AVG(CASE WHEN attendance.status = 'present' THEN 1 ELSE 0 END)",
        'averageAttendance',
      )
      .groupBy('student.id')
      .addGroupBy('student.firstname')
      .addGroupBy('student.lastname')
      .having(
        "AVG(CASE WHEN attendance.status = 'present' THEN 1 ELSE 0 END) < :threshold",
        {
          threshold: 0.75,
        },
      )
      .getRawMany();

    return {
      topPerformingDepartments,
      studentsWithCriticalIssues,
    };
  }
}
