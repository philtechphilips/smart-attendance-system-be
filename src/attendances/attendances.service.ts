import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { Semester } from 'src/semesters/entities/semester.entity';
import * as path from 'path';
import { extname } from 'path';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { tmpdir } from 'os';

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
  ) { }

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

  // async mark(id: string, base64Image : any) {

  //   let filePath: string;
  //   let filename: string;

  //   // Create temporary directory if it doesn't exist
  //   const tempDir = path.join(tmpdir(), 'luxand-uploads');
  //   if (!fs.existsSync(tempDir)) {
  //     fs.mkdirSync(tempDir, { recursive: true });
  //   }

  //   if (base64Image) {
  //     // Handle base64 image
  //     const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  //     const buffer = Buffer.from(base64Data, 'base64');
  //     filename = `profile-${id}-${Date.now()}.jpg`;
  //     filePath = path.join(tempDir, filename);
  //     fs.writeFileSync(filePath, buffer);
  //   }

  //   // Create form data for Luxand Cloud
  //   const form = new FormData();
  //   form.append('photos', fs.createReadStream(filePath), filename);
  //   form.append('name', `User ${id}`);
  //   form.append('store', '1');

  //   const headers = {
  //     'token': '3de8b7510348486e838e2bd09541deef',
  //     ...form.getHeaders(),
  //   };

  //   // Upload to Luxand Cloud
  //   const response = await axios.post('https://api.luxand.cloud/photo/search/v2', form, { headers });

  //   // Clean up: delete the temporary file
  //   try {
  //     fs.unlinkSync(filePath);
  //   } catch (cleanupError) {
  //     console.warn('Failed to delete temporary file:', cleanupError);
  //   }

  //   console.log(response.data, "respose")



  //   // const student = await this.studentRepository.findOne({ 
  //   //   where: { 
  //   //     user: { id } // Query using the relationship property "user" and its "id"
  //   //   } 
  //   // });

  //   // student.imageId = response?.data?.faces[0]?.uuid;
  //   // student.imageUrl = response?.data?.faces[0]?.url;
  //   // await this.studentRepository.save(student);

  //   return {
  //     success: true,
  //     message: 'Profile uploaded to Luxand Cloud successfully',
  //     luxandResponse: response.data,
  //   };
  //   // const { studentId, courseId, status } = createAttendanceDto;

  //   // // Validate Student
  //   // const student = await this.studentRepository.findOne({
  //   //   where: { id: studentId },
  //   //   relations: ['level'],
  //   // });

  //   // if (!student) {
  //   //   throw new NotFoundException(`Student with ID ${studentId} not found`);
  //   // }

  //   // const semester = await this.semesterRepository.findOne({
  //   //   where: { active: true },
  //   // });

  //   // if (!semester) {
  //   //   throw new NotFoundException(`No active Semester`);
  //   // }

  //   // // Validate Course
  //   // const course = await this.courseRepository.findOne({
  //   //   where: { id: courseId },
  //   //   relations: ['class'],
  //   // });

  //   // if (!course) {
  //   //   throw new NotFoundException(`Course with ID ${courseId} not found`);
  //   // }

  //   // if (course.class.id !== student.level.id) {
  //   //   throw new BadRequestException(
  //   //     `Student level and course level does not match!`,
  //   //   );
  //   // }

  //   // // Create and save attendance
  //   // const attendance = this.attendanceRepository.create({
  //   //   student,
  //   //   course,
  //   //   semester,
  //   //   status: status || 'absent',
  //   // });

  //   // return this.attendanceRepository.save(attendance);
  // }

  async mark(id: string, base64Image: any) {
    let filePath: string;
    let filename: string;

    try {
      // Create temporary directory if it doesn't exist
      const tempDir = path.join(tmpdir(), 'luxand-uploads');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      if (base64Image) {
        // Handle base64 image
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        filename = `profile-${id}-${Date.now()}.jpg`;
        filePath = path.join(tempDir, filename);

        // Write file synchronously to ensure it exists before reading
        fs.writeFileSync(filePath, buffer);

        // Verify file exists before proceeding
        if (!fs.existsSync(filePath)) {
          throw new Error('Failed to create temporary file');
        }
      } else {
        throw new Error('No image provided');
      }

      // Create form data for Luxand Cloud
      const form = new FormData();
      form.append('collections', '');
      form.append('photo', fs.createReadStream(filePath), filename);

      const headers = {
        'token': '',
        ...form.getHeaders(),
      };

      // Upload to Luxand Cloud
      const response = await axios.post('https://api.luxand.cloud/photo/search/v2', form, {
        headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      console.log(response.data)


      // Clean up: delete the temporary file
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        console.warn('Failed to delete temporary file:', cleanupError);
      }
      const student = await this.studentRepository.findOne({
        where: { imageId: response.data[0].uuid },
        relations: ['level'],
      });

      if (!student) {
        throw new NotFoundException(`Student with ImageID ${response.data[0].uuid} not found`);
      }

      const semester = await this.semesterRepository.findOne({
        where: { active: true },
      });

      if (!semester) {
        throw new NotFoundException(`No active Semester`);
      }

      // Validate Course
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['class'],
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
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
        status: 'present',
      });

      console.log(attendance)

      await this.attendanceRepository.save(attendance);


      return {
        success: true,
        message: 'Profile uploaded to Luxand Cloud successfully',
        luxandResponse: response.data,
      };
    } catch (error) {
      // Clean up temp file if it exists (even in error case)
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.warn('Failed to delete temporary file during error cleanup:', cleanupError);
        }
      }

      console.error('Error in mark function:', error);
      throw new Error('Failed to process image upload');
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

    if (attendanceRecords.length === 0) {
      throw new Error('No attendance records found for the student');
    }

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
        user: { id: id } // Query using the relationship property "user" and its "id"
      }
    });

    const studentId = student.id;

    // Fetch attendance records for the student with proper relations
    const attendanceRecords = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.course', 'course')
      .leftJoinAndSelect('course.lecturer', 'lecturer')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.level', 'class')
      .where('student.id = :studentId', { studentId })
      .getMany();

    if (attendanceRecords.length === 0) {
      throw new Error('No attendance records found for the student');
    }

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

    console.log(absentRecords)

    await this.attendanceRepository.save(absentRecords);

    console.log(
      `${absentRecords.length} students marked as absent for course ${courseId} on ${date}`,
    );
  }
}
