import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/repository/base.repository';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Department } from '../entities/department.entity';

@Injectable()
export class AuthRepo extends BaseRepository<Department> {
  constructor(
    @InjectRepository(Department)
    private departmentModel: Repository<Department>,
    private departmentRepo: Repository<Department>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super(departmentModel);
    this.departmentRepo = this.entityManager.getRepository(Department);
  }

  async save(data: Department) {
    return await this.departmentRepo.save(data);
  }

  async findAll(): Promise<Department[]> {
    const departments = await this.departmentRepo.find();
    return departments;
  }
}
