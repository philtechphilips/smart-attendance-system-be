import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { School } from 'src/schools/entities/school.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Level } from 'src/levels/entities/level.entity';
import { User } from 'src/auth/entities/auth.entity';
import { AuthService } from 'src/auth/auth.service';
import { applyPagination } from 'src/repository/base.repository';
import { IPaginationQuery } from 'src/shared/interfaces/date-query';
import { Department } from 'src/departments/entities/department.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const {
      lastname,
      firstname,
      middlename,
      dob,
      country,
      state,
      lga,
      phone,
      email,
      address,
      guardian,
      guardianAddress,
      guardianPhone,
      levelId,
      departmentId,
      programId,
      schoolId,
    } = createStudentDto;

    try {
      return await this.dataSource.transaction(async (manager) => {
        // Check if a student with the same email already exists
        const existingStudent = await manager.findOne(Student, {
          where: { email },
        });
        if (existingStudent) {
          throw new ConflictException(
            `A student with email ${email} already exists`,
          );
        }

        const user = await this.authService.create({
          lastname,
          firstname,
          email,
          password: lastname.toLowerCase(),
        });

        if (user) {
          const level = await manager.findOne(Level, {
            where: { id: levelId },
          });
          if (!level)
            throw new NotFoundException(`Level with ID ${levelId} not found`);

          const department = await manager.findOne(Department, {
            where: { id: departmentId },
          });
          if (!department)
            throw new NotFoundException(
              `Department with ID ${departmentId} not found`,
            );

          const program = await manager.findOne(Program, {
            where: { id: programId },
          });
          if (!program)
            throw new NotFoundException(
              `Program with ID ${programId} not found`,
            );

          const school = await manager.findOne(School, {
            where: { id: schoolId },
          });
          if (!school)
            throw new NotFoundException(`School with ID ${schoolId} not found`);

          // **Generate the Department Code**
          const deptCode = department.code.padStart(3, '0'); // Ensure 3-digit department codes

          const programCode = program.name.charAt(0);

          let levelCode = level.name.slice(0, 2);
          levelCode = levelCode === 'HN' ? 'HD' : 'ND';

          // **Generate the Year of Registration**
          const yearOfRegistration = new Date()
            .getFullYear()
            .toString()
            .slice(-2);

          // **Generate a Sequential Number**
          const studentCount = await manager.count(Student);
          const sequentialNumber = (studentCount + 1)
            .toString()
            .padStart(2, '0');

          // **Generate the Matriculation Number**
          const matricNo = `${programCode}/${levelCode}/${yearOfRegistration}/${deptCode}/00${sequentialNumber}`;

          // **Create the Student Entity**
          const student = this.studentRepository.create({
            lastname,
            firstname,
            middlename,
            dob,
            country,
            state,
            lga,
            phone,
            email,
            address,
            guardian,
            guardianAddress,
            guardianPhone,
            level,
            department,
            program,
            school,
            user,
            matricNo,
          });

          return await manager.save(student);
        }
      });
    } catch (error) {
      console.error('Failed to create student', error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create student');
    }
  }

  async findAll(pagination: IPaginationQuery) {
    try {
      const queryBuilder =
        await this.studentRepository.createQueryBuilder('students');
      queryBuilder
        .select(['students.id', 'user.id'])
        .leftJoin('students.user', 'user')
        .leftJoinAndSelect('students.level', 'level')
        .leftJoinAndSelect('students.department', 'department')
        .leftJoinAndSelect('students.school', 'school')
        .leftJoinAndSelect('students.program', 'program');

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
      throw new InternalServerErrorException('Failed to fetch students');
    }
  }

  async findOne(id: string) {
    try {
      const queryBuilder =
        await this.studentRepository.createQueryBuilder('students');
      const student = queryBuilder
        .where('students.id = :id', { id })
        .select(['students.id', 'user.id'])
        .leftJoin('students.user', 'user')
        .leftJoinAndSelect('students.level', 'level')
        .leftJoinAndSelect('students.department', 'department')
        .leftJoinAndSelect('students.school', 'school')
        .leftJoinAndSelect('students.program', 'program')
        .getOne();
      if (!student) {
        throw new NotFoundException('Student not found!');
      }
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch student');
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);

    Object.assign(student, updateStudentDto);
    return await this.studentRepository.save(student);
  }

  async remove(id: string) {
    const result = await this.studentRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Student with ID ${id} not found`);
    return { message: `Student with ID ${id} has been deleted` };
  }
}
