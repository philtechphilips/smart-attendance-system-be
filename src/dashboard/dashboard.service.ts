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

  async staffDashboard(userId: string) {
    // Fetch the staff member using the userId
    const staff = await this.lecturerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['courses'], // Assuming 'courses' is a relation in the Staff entity
    });

    if (!staff) {
      throw new Error('Staff not found');
    }

    const courses = await this.courseRepository.find({
      where: { lecturer: { id: staff?.id } }
    });

    // // Fetch courses assigned to the lecturer
    // const courses = staff.courses;

    // Count the number of courses
    const courseCount = courses.length;

    // Initialize variables for student count and attendance count
    let totalStudents = 0;
    let totalAttendanceRecords = 0;
    const studentList = [];

    // Loop through each course to get student counts and attendance
    for (const course of courses) {
      // Count students in the course
      const studentsInCourse = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoin('student.level', 'level') // Assuming students are linked to levels
        .where('level.id = :levelId', { levelId: course.class.id }) // Assuming class is a relation in Course
        .getMany();

      totalStudents += studentsInCourse.length;

      // Count attendance records for the course
      const attendanceCount = await this.attendanceRepository.count({
        where: { course: { id: course.id } },
      });
      totalAttendanceRecords += attendanceCount;

      // Add first 15 students to the list
      studentList.push(...studentsInCourse.slice(0, 15));
    }

    return {
      courseCount,
      totalStudents,
      totalAttendanceRecords,
      studentList: studentList.slice(0, 15), // Limit to first 15 students
    };
  }
}
