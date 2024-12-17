import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto) {
    const existingSchool = await this.schoolRepository.findOne({
      where: { name: createSchoolDto.name },
    });

    if (existingSchool) {
      throw new ConflictException('School with this name already exists');
    }

    const school = this.schoolRepository.create(createSchoolDto);
    return await this.schoolRepository.save(school);
  }

  async findAll() {
    return await this.schoolRepository.find();
  }

  async findOne(id: string) {
    const school = await this.schoolRepository.findOneBy({ id });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    const school = await this.schoolRepository.findOneBy({ id });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    Object.assign(school, updateSchoolDto);
    return await this.schoolRepository.save(school);
  }

  async remove(id: string) {
    const school = await this.schoolRepository.findOneBy({ id });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    await this.schoolRepository.delete(id);
    return { message: `School with ID ${id} has been deleted` };
  }
}
