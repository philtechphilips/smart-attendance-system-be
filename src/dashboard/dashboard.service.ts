import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Staff } from 'src/staffs/entities/staff.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Attendance } from 'src/attendances/entities/attendance.entity';
import { User } from 'src/auth/entities/auth.entity';

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async staffDashboard(userId: string, period: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // Fetch the staff member using the userId
    const staff = await this.lecturerRepository.findOne({
      where: { user: { id: user.id } },
    });

    const courses = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.class', 'classes')
      .leftJoin('course.lecturer', 'lecturer')
      .where('lecturer.id = :lecturerId', { lecturerId: staff.id })
      .getMany();

    // Count the number of courses
    const courseCount = courses.length;

    let totalStudents = 0;
    let totalAttendanceRecords = 0;
    const studentList = [];

    for (const course of courses) {
      const studentsInCourse = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.level', 'level')
        .leftJoinAndSelect('student.department', 'department')
        .where('level.id = :levelId', { levelId: course.class.id })
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

    // Fetch attendance data based on the specified period
    let attendanceData;

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthLabels = Array.from({ length: 12 }, (_, i) => `${i + 1}`); // '1' to '12'

    if (period === 'week') {
      const rawData = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoin('attendance.course', 'course')
        .leftJoin('course.lecturer', 'lecturer')
        .select(
          `
          DAYOFWEEK(attendance.timestamp) as dayOfWeek,
          attendance.status as status,
          COUNT(*) as count
        `,
        )
        .where('attendance.timestamp >= CURDATE() - INTERVAL 7 DAY')
        .andWhere('lecturer.id = :lecturerId', { lecturerId: staff.id })
        .groupBy('dayOfWeek, status')
        .getRawMany();

      attendanceData = weekDays.map((label, index) => {
        const dayIndex = index + 1; // MySQL DAYOFWEEK starts from 1 (Sunday)
        const present =
          rawData.find((r) => r.dayOfWeek == dayIndex && r.status === 'present')
            ?.count || 0;
        const absent =
          rawData.find((r) => r.dayOfWeek == dayIndex && r.status === 'absent')
            ?.count || 0;
        return { label, present, absent };
      });
    } else if (period === 'month') {
      const rawData = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoin('attendance.course', 'course')
        .leftJoin('course.lecturer', 'lecturer')
        .select(
          `
          DAY(attendance.timestamp) as day,
          attendance.status as status,
          COUNT(*) as count
        `,
        )
        .where('attendance.timestamp >= CURDATE() - INTERVAL 1 MONTH')
        .andWhere('lecturer.id = :lecturerId', { lecturerId: staff.id })
        .groupBy('day, status')
        .getRawMany();

      const today = new Date();
      const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
      ).getDate();

      attendanceData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const present =
          rawData.find((r) => r.day == day && r.status === 'present')?.count ||
          0;
        const absent =
          rawData.find((r) => r.day == day && r.status === 'absent')?.count ||
          0;
        return { label: `${day}`, present, absent };
      });
    } else if (period === 'year') {
      const currentYear = new Date().getFullYear();

      const rawData = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoin('attendance.course', 'course')
        .leftJoin('course.lecturer', 'lecturer')
        .select(
          `
          MONTH(attendance.timestamp) as month,
          attendance.status as status,
          COUNT(*) as count
        `,
        )
        .where('YEAR(attendance.timestamp) = :currentYear', { currentYear })
        .andWhere('lecturer.id = :lecturerId', { lecturerId: staff.id })
        .groupBy('month, status')
        .getRawMany();

      attendanceData = monthLabels.map((label, index) => {
        const month = index + 1;
        const present =
          rawData.find((r) => r.month == month && r.status === 'present')
            ?.count || 0;
        const absent =
          rawData.find((r) => r.month == month && r.status === 'absent')
            ?.count || 0;
        return { label, present, absent };
      });
    } else {
      throw new Error('Invalid period specified');
    }

    return {
      courseCount,
      totalStudents,
      totalAttendanceRecords,
      studentList,
      attendanceData,
    };
  }
}
