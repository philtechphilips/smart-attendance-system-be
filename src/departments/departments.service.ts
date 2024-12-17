import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { School } from 'src/schools/entities/school.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const { name, schoolId } = createDepartmentDto;

    const existingDepartment = await this.departmentRepository.findOne({
      where: {
        name,
        school: { id: schoolId },
      },
      relations: ['school'],
    });

    if (existingDepartment) {
      throw new ConflictException('Department already exists in this school');
    }

    const school = await this.schoolRepository.findOne({
      where: { id: schoolId },
    });

    if (!school) {
      throw new NotFoundException('School not found with provided ID');
    }

    const department = this.departmentRepository.create({
      name,
      school,
    });

    return await this.departmentRepository.save(department);
  }

  async findAll() {
    return await this.departmentRepository.find({ relations: ['school'] });
  }

  async findOne(id: string) {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['school'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['school'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    Object.assign(department, updateDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  async remove(id: string) {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    await this.departmentRepository.delete(id);
    return { message: `Department with ID ${id} has been deleted` };
  }
}
