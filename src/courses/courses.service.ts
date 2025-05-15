import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as stringify from 'csv-stringify/sync';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Department } from 'src/departments/entities/department.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Staff } from 'src/staffs/entities/staff.entity';
import { IPaginationQuery } from 'src/shared/interfaces/date-query';
import { applyPagination } from 'src/repository/base.repository';
import { User } from 'src/auth/entities/auth.entity';
import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Student } from 'src/students/entities/student.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,

    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,

    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,

    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,

    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,

    @InjectRepository(Staff)
    private readonly lecturerRepository: Repository<Staff>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const { departmentId, classId, lecturerId, programId, ...courseData } =
      createCourseDto;

    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
    });
    if (!department) {
      throw new NotFoundException(
        `Department with ID ${departmentId} not found`,
      );
    }

    const level = await this.levelRepository.findOne({
      where: { id: classId },
    });
    if (!level) {
      throw new NotFoundException(`Level with ID ${classId} not found`);
    }

    const program = await this.programRepository.findOne({
      where: { id: programId },
    });
    if (!program) {
      throw new NotFoundException(`Program with ID ${programId} not found`);
    }

    const lecturer = await this.staffRepository.findOne({
      where: { id: lecturerId },
    });
    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID ${lecturerId} not found`);
    }

    const course = this.courseRepository.create({
      ...courseData,
      department,
      class: level,
      program,
      lecturer,
    });
    return await this.courseRepository.save(course);
  }

  async findAll(pagination: IPaginationQuery) {
    const queryBuilder =
      await this.courseRepository.createQueryBuilder('courses');
    queryBuilder
      .leftJoinAndSelect('courses.class', 'level')
      .leftJoinAndSelect('courses.department', 'department')
      .leftJoinAndSelect('courses.program', 'program')
      .leftJoinAndSelect('courses.lecturer', 'lecturer');

    const totalCourses = await queryBuilder.getCount();
    const paginatedQuery = await applyPagination(queryBuilder, pagination);

    const courses = await paginatedQuery.getMany();

    return {
      items: courses,
      pagination: {
        total: totalCourses,
        currentPage: pagination.currentPage,
      },
    };
  }

  async getDepartmentCourses(pagination: IPaginationQuery, user: User) {
    try {
      const getUserDept = await this.staffRepository.findOne({
        where: { user: { id: user.id } },
        relations: ['user', 'department'],
      });

      if (!getUserDept) {
        throw new NotFoundException('Error finding your department!');
      }

      const queryBuilder =
        await this.courseRepository.createQueryBuilder('courses');
      queryBuilder
        .leftJoinAndSelect('courses.class', 'level')
        .leftJoinAndSelect('courses.department', 'department')
        .leftJoinAndSelect('courses.program', 'program')
        .leftJoinAndSelect('courses.lecturer', 'lecturer')
        .where('department.id = :departmentId', {
          departmentId: getUserDept.department.id,
        });

      const totalstudents = await queryBuilder.getCount();
      const paginatedQuery = await applyPagination(queryBuilder, pagination);

      const students = await paginatedQuery.getMany();

      return {
        items: students,
        pagination: {
          total: totalstudents,
          currentPage: pagination.currentPage,
        },
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch students');
    }
  }

  async getStudentCourses(pagination: IPaginationQuery, user: User) {
    try {
      const student = await this.studentRepository.findOne({
        where: { user: { id: user.id } },
        relations: ['user', 'department'],
      });

      if (!student) {
        throw new NotFoundException('Error finding your department!');
      }

      const queryBuilder =
        await this.courseRepository.createQueryBuilder('courses');
      queryBuilder
        .leftJoinAndSelect('courses.class', 'level')
        .leftJoinAndSelect('courses.department', 'department')
        .leftJoinAndSelect('courses.program', 'program')
        .leftJoinAndSelect('courses.lecturer', 'lecturer')
        .where('department.id = :departmentId', {
          departmentId: student.department.id,
        });

      const totalstudents = await queryBuilder.getCount();
      const paginatedQuery = await applyPagination(queryBuilder, pagination);

      const students = await paginatedQuery.getMany();

      return {
        items: students,
        pagination: {
          total: totalstudents,
          currentPage: pagination.currentPage,
        },
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch students');
    }
  }
  /**
   * Get attendance records by course
   * @param courseId - UUID of the course
   */

  async getAttendanceByCourse(
    courseId: string,
    search?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['class'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.course', 'course')
      .leftJoinAndSelect('attendance.semester', 'semester')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.level', 'level')
      .leftJoinAndSelect('student.department', 'department')
      .where('course.id = :courseId', { courseId });

    if (search) {
      query.andWhere(
        '(student.firstName LIKE :search OR student.lastName LIKE :search OR student.matricNo LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (startDate) {
      query.andWhere('attendance.timestamp >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('attendance.timestamp <= :endDate', { endDate });
    }

    const attendance = await query.getMany();

    return {
      courseName: course.name,
      attendance,
    };
  }

  async getStudentCoursesAttendance(
    courseId: string,
    search?: string,
    startDate?: string,
    endDate?: string,
    userId?: string,
  ) {
    const student = await this.studentRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'department'],
    });

    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['class'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.course', 'course')
      .leftJoinAndSelect('attendance.semester', 'semester')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('student.level', 'level')
      .leftJoinAndSelect('student.department', 'department')
      .where('course.id = :courseId', { courseId })
      .andWhere('student.id = :studentId', { studentId: student.id });

    if (search) {
      query.andWhere(
        '(student.firstName LIKE :search OR student.lastName LIKE :search OR student.matricNo LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (startDate) {
      query.andWhere('attendance.timestamp >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('attendance.timestamp <= :endDate', { endDate });
    }

    const attendance = await query.getMany();

    return {
      courseName: course.name,
      attendance,
    };
  }

async downloadAttendanceByCourse(courseId: string, res?: Response) {
    try {
        const course = await this.courseRepository.findOne({
            where: { id: courseId },
            relations: ['class'],
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        const attendance = await this.attendanceRepository
            .createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.course', 'course')
            .leftJoinAndSelect('attendance.semester', 'semester')
            .leftJoinAndSelect('attendance.student', 'student')
            .leftJoinAndSelect('student.level', 'level')
            .leftJoinAndSelect('student.department', 'department')
            .where('course.id = :courseId', { courseId })
            .getMany();

        if (!res) {
            return attendance;
        }

        // Prepare CSV headers
        const headers = [
            'First Name',
            'Last Name',
            'Matric No',
            'Level',
            'Department',
            'Date',
        ];

        // Prepare CSV rows
        const rows = attendance.map(att => [
            att.student?.firstname || '',
            att.student?.lastname || '',
            att.student?.matricNo || '',
            att.student?.level?.name || '',
            att.student?.department?.name || '',
            att.timestamp ? new Date(att.timestamp).toLocaleString() : '',
        ]);

        // Combine headers and rows
        const csvData = stringify.stringify([headers, ...rows]);

        // Set headers for CSV download
        res.header('Content-Type', 'text/csv');
        res.header(
            'Content-Disposition',
            `attachment; filename=Attendance-${course.name.replace(/[^a-z0-9]/gi, '_')}.csv`,
        );

        // Send CSV content
        res.send(csvData);

    } catch (error) {
        if (res && !res.headersSent) {
            res.status(500).json({
                message: 'Failed to generate CSV file',
                error: error.message,
            });
        }
        throw new InternalServerErrorException('Failed to generate CSV file');
    }
}

  async getLecturerCourses(id: string, search?: string) {
    console.log(id);
    // Step 1: Ensure the lecturer exists
    const lecturer = await this.lecturerRepository.findOne({
      where: {
        user: {
          id,
        },
      },
    });

    console.log(lecturer, 'lecturer');

    if (!lecturer) {
      throw new Error('Lecturer not found');
    }

    // Step 2: Build the query
    const query = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.class', 'class')
      .leftJoinAndSelect('course.department', 'department')
      .leftJoinAndSelect('course.program', 'program')
      .where('course.lecturerId = :lecturerId', { lecturerId: lecturer.id });

    const course = await query.getMany();

    return { course };
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['lecturer', 'class', 'department', 'program'],
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const { departmentId, classId, lecturerId, programId, ...updateData } =
      updateCourseDto;

    const course = await this.findOne(id);

    if (departmentId) {
      const department = await this.departmentRepository.findOne({
        where: { id: departmentId },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }
      course.department = department;
    }

    if (classId) {
      const level = await this.levelRepository.findOne({
        where: { id: classId },
      });
      if (!level) {
        throw new NotFoundException(`Level with ID ${classId} not found`);
      }
      course.class = level;
    }

    if (programId) {
      const program = await this.programRepository.findOne({
        where: { id: programId },
      });
      if (!program) {
        throw new NotFoundException(`Program with ID ${programId} not found`);
      }
      course.program = program;
    }

    if (lecturerId) {
      const lecturer = await this.staffRepository.findOne({
        where: { id: lecturerId },
      });
      if (!lecturer) {
        throw new NotFoundException(`Lecturer with ID ${lecturerId} not found`);
      }
      course.lecturer = lecturer;
    }

    Object.assign(course, updateData);
    return await this.courseRepository.save(course);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }
}
