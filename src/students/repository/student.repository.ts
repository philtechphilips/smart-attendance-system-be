import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/repository/base.repository';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentRepo extends BaseRepository<Student> {
  constructor(
    @InjectRepository(Student)
    private studentModel: Repository<Student>,
    private studentRepo: Repository<Student>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super(studentModel);
    this.studentRepo = this.entityManager.getRepository(Student);
  }

  async save(data: Student) {
    return await this.studentRepo.save(data);
  }

  async findAll(): Promise<Student[]> {
    const students = await this.studentRepo.find();
    return students;
  }
}
