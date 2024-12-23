import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Department } from 'src/departments/entities/department.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Staff } from 'src/staffs/entities/staff.entity';

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

  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({
      relations: ['lecturer', 'class', 'department', 'program'],
    });
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
