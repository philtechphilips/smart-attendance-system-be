import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';
import { Department } from 'src/departments/entities/department.entity';
import { AuthService } from 'src/auth/auth.service';
import { IPaginationQuery } from 'src/shared/interfaces/date-query';
import { applyPagination } from 'src/repository/base.repository';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private readonly authService: AuthService,
  ) {}

  // Create a new staff record
  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    try {
      const { departmentId, ...staffData } = createStaffDto;

      const existingStudent = await this.staffRepository.findOne({
        where: { email: staffData.email },
      });
      if (existingStudent) {
        throw new ConflictException(
          `A student with email ${staffData.email} already exists`,
        );
      }

      const user = await this.authService.create({
        lastname: staffData.lastname,
        firstname: staffData.firstname,
        email: staffData.email,
        role: 'LECTURER',
        password: staffData.lastname.toLowerCase(),
      });

      if (user) {
        // Check if the department exists
        const department = await this.departmentRepository.findOne({
          where: { id: departmentId },
        });
        if (!department) {
          throw new NotFoundException(
            `Department with ID ${departmentId} not found`,
          );
        }

        // Create the staff record and associate it with the department
        const staff = this.staffRepository.create({
          ...staffData,
          department,
          user,
        });

        // Save and return the created staff
        return await this.staffRepository.save(staff);
      }
    } catch (error) {
      console.error('Failed to create student', error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create staff');
    }
  }

  // Get all staff records
  async findAll(pagination: IPaginationQuery) {
    try {
      const queryBuilder =
        await this.staffRepository.createQueryBuilder('staffs');
      queryBuilder
        .leftJoin('staffs.user', 'user')
        .leftJoinAndSelect('staffs.department', 'department');

      const totalStaffs = await queryBuilder.getCount();
      const paginatedQuery = await applyPagination(queryBuilder, pagination);

      const staffs = await paginatedQuery.getMany();

      return {
        items: staffs,
        pagination: {
          total: totalStaffs,
          currentPage: pagination.currentPage,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch staffs');
    }
  }

  async getDepartmentStaff(pagination: IPaginationQuery, user: User) {
    try {
      const getUserDept = await this.staffRepository.findOne({
        where: { user: { id: user.id } },
        relations: ['user', 'department'],
      });

      if (!getUserDept) {
        throw new NotFoundException('Error finding your department!');
      }

      const queryBuilder =
        await this.staffRepository.createQueryBuilder('staff');
      queryBuilder
        .select(['staff.id', 'user.id'])
        .leftJoin('staff.user', 'user')
        .leftJoinAndSelect('staff.department', 'department')
        .where('department.id = :departmentId', {
          departmentId: getUserDept.department.id,
        });

      const totalstaff = await queryBuilder.getCount();
      const paginatedQuery = await applyPagination(queryBuilder, pagination);

      const staff = await paginatedQuery.getMany();

      return {
        items: staff,
        pagination: {
          total: totalstaff,
          currentPage: pagination.currentPage,
        },
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch staff');
    }
  }

  // Get a specific staff record by ID
  async findOne(id: string): Promise<Staff> {
    try {
      const queryBuilder =
        await this.staffRepository.createQueryBuilder('staffs');
      queryBuilder
        .where('staffs.id = :id', { id })
        .leftJoin('staffs.user', 'user')
        .leftJoinAndSelect('staffs.department', 'department');
      const staff = await queryBuilder.getOne();
      if (!staff) {
        throw new NotFoundException(`Staff with ID ${id} not found`);
      }
      return staff;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch staff');
    }
  }

  // Update a staff record
  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findOne(id); // Ensure staff exists
    Object.assign(staff, updateStaffDto);
    return await this.staffRepository.save(staff);
  }

  // Delete a staff record
  async remove(id: string): Promise<void> {
    const staff = await this.findOne(id); // Ensure staff exists
    await this.staffRepository.remove(staff);
  }
}
