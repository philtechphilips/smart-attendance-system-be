import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  /**
   * Get attendance records by course
   * @param courseId - UUID of the course
   */
  async getAttendanceByCourse(courseId: string) {
    // Step 1: Ensure the course exists
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['class'], // Assuming course has a classLevel relation
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Step 2: Count unique days the course was held
    const uniqueDays = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.course', 'course')
      .where('course.id = :courseId', { courseId })
      .select('DISTINCT DATE(attendance.timestamp)', 'uniqueDay') // Use DISTINCT
      .getRawMany();

    // Step 3: Count total students at the same level as the course class
    const totalStudents = await this.attendanceRepository
      .createQueryBuilder('att')
      .leftJoinAndSelect('att.course', 'course')
      .where('course.id = :courseId', { courseId })
      .leftJoinAndSelect('att.student', 'students')
      .leftJoinAndSelect('students.level', 'level')
      .andWhere('level.id = :classId', { classId: course?.class?.id })
      .getCount();

    // Step 4: Count total marked present and absent
    const totalPresent = await this.attendanceRepository
      .createQueryBuilder('att')
      .leftJoinAndSelect('att.course', 'course')
      .where('course.id = :courseId', { courseId })
      .andWhere('att.status = :status', { status: 'present' })
      .getCount();

    const totalAbsent = await this.attendanceRepository
      .createQueryBuilder('att')
      .leftJoinAndSelect('att.course', 'course')
      .where('course.id = :courseId', { courseId })
      .andWhere('att.status = :status', { status: 'absent' })
      .getCount();

    // Step 5: Prepare graph data for present and absent counts per day
    const graphData = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .select('DATE(attendance.timestamp)', 'date')
      .addSelect(
        `SUM(CASE WHEN attendance.status = 'present' THEN 1 ELSE 0 END)`,
        'presentCount',
      )
      .addSelect(
        `SUM(CASE WHEN attendance.status = 'absent' THEN 1 ELSE 0 END)`,
        'absentCount',
      )
      .leftJoinAndSelect('attendance.course', 'course')
      .where('course.id = :courseId', { courseId })
      .groupBy('DATE(attendance.timestamp)')
      .getRawMany();

    // Step 6: Return aggregated data
    return {
      courseId,
      courseName: course.name, // Assuming course has a "name" field
      daysClassHeld: uniqueDays.length,
      totalStudents,
      totalPresent,
      totalAbsent,
      graphData, // Array of { date, presentCount, absentCount }
    };
  }

  async getLecturerCourses(id: string) {
    const lecturer = await this.lecturerRepository.findOne({
      where: {
        user: {
          id,
        },
      },
    });

    // Step 1: Ensure the course exists
    const course = await this.courseRepository.find({
      where: {
        lecturer: {
          id: lecturer.id,
        },
      },
      relations: ['class'], // Assuming course has a classLevel relation
    });

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
