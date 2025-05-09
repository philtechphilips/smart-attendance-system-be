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
import { Staff } from 'src/staffs/entities/staff.entity';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly authService: AuthService,
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
      guardianEmail,
      guardianPhone,
      levelId,
      departmentId,
      programId,
      schoolId,
    } = createStudentDto;

    try {
      // Check if the student already exists by email
      const existingStudent = await this.studentRepository.findOne({
        where: { email },
      });
      if (existingStudent) {
        throw new ConflictException(
          `A student with email ${email} already exists`,
        );
      }

      // Create the user
      const user = await this.authService.create({
        lastname,
        firstname,
        email,
        password: lastname.toLowerCase(), // Default password
      });

      if (!user) {
        throw new InternalServerErrorException('Failed to create user');
      }

      // Validate related entities
      const level = await this.levelRepository.findOne({
        where: { id: levelId },
      });
      if (!level) {
        throw new NotFoundException(`Level with ID ${levelId} not found`);
      }

      const department = await this.departmentRepository.findOne({
        where: { id: departmentId },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }

      const program = await this.programRepository.findOne({
        where: { id: programId },
      });
      if (!program) {
        throw new NotFoundException(`Program with ID ${programId} not found`);
      }

      const school = await this.schoolRepository.findOne({
        where: { id: schoolId },
      });
      if (!school) {
        throw new NotFoundException(`School with ID ${schoolId} not found`);
      }

      // Generate Matriculation Number
      const deptCode = department.code.padStart(3, '0'); // 3-digit department code
      const programCode = program.name.charAt(0); // First letter of program
      const levelCode = level.name.startsWith('HN') ? 'HD' : 'ND'; // Code for level
      const yearOfRegistration = new Date().getFullYear().toString().slice(-2); // Last 2 digits of the year

      const studentCount = await this.studentRepository.count();
      const sequentialNumber = (studentCount + 1).toString().padStart(2, '0'); // 2-digit sequence

      const matricNo = `${programCode}/${levelCode}/${yearOfRegistration}/${deptCode}/00${sequentialNumber}`;

      // Create the student entity
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
        guardianEmail,
        level,
        department,
        program,
        school,
        user,
        matricNo,
      });

      return await this.studentRepository.save(student);
    } catch (error) {
      console.error('Error creating student:', error.message);

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
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

  async getDepartmentStudent(pagination: IPaginationQuery, user: User) {
    try {
      const getUserDept = await this.staffRepository.findOne({
        where: { user: { id: user.id } },
        relations: ['user', 'department'],
      });

      if (!getUserDept) {
        throw new NotFoundException('Error finding your department!');
      }

      const queryBuilder =
        await this.studentRepository.createQueryBuilder('students');
      queryBuilder
        .leftJoin('students.user', 'user')
        .leftJoinAndSelect('students.level', 'level')
        .leftJoinAndSelect('students.department', 'department')
        .where('department.id = :departmentId', {
          departmentId: getUserDept.department.id,
        })
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
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch students');
    }
  }

  async getAllLecturerStudents(pagination: IPaginationQuery, user: User) {
    const { search } = pagination;
    try {
      const staff = await this.staffRepository.findOne({
        where: { user: { id: user.id } },
        relations: ['user', 'department'],
      });

      if (!staff) {
        throw new NotFoundException('Error finding your department!');
      }

      const courses = await this.courseRepository
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.class', 'classes')
        .leftJoin('course.lecturer', 'lecturer')
        .where('lecturer.id = :lecturerId', { lecturerId: staff.id })
        .getMany();

      let totalStudents = 0;
      let totalAttendanceRecords = 0;
      const studentList = [];

      for (const course of courses) {
        const query = this.studentRepository
          .createQueryBuilder('student')
          .leftJoinAndSelect('student.level', 'level')
          .leftJoinAndSelect('student.department', 'department')
          .leftJoinAndSelect('student.school', 'school')
          .leftJoinAndSelect('student.program', 'program')
          .where('level.id = :levelId', { levelId: course.class.id });

        if (search) {
          query.andWhere(
            `(student.firstname LIKE :search OR student.lastname LIKE :search OR student.middlename LIKE :search  OR student.matricNo LIKE :search)`,
            { search: `%${search}%` },
          );
        }

        const studentsInCourse = await query.getMany();

        totalStudents += studentsInCourse.length;

        studentList.push(...studentsInCourse);
      }

      // Pagination
      const { currentPage = 1, pageSize = 10 } = pagination;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedStudents = studentList.slice(startIndex, endIndex);

      return {
        total: studentList.length, // Return filtered total, not all students
        totalAttendanceRecords,
        students: paginatedStudents,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
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

  async uploadImage(id: string, base64Image: any) {
    try {
      if (base64Image) {
        // Handle base64 image
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Update the student's image buffer in the database
        const student = await this.studentRepository.findOne({
          where: {
            user: { id }, // Query using the relationship property "user" and its "id"
          },
        });

        // Assuming you have an imageBuffer field in your Student entity
        student.image = buffer; // Store the buffer directly
        await this.studentRepository.save(student);

        return {
          success: true,
          message: 'Profile image uploaded successfully',
          userId: id,
        };
      } else {
        throw new Error('No image data provided');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload profile image: ${error.message}`);
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
