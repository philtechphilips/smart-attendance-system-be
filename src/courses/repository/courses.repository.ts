import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/repository/base.repository';
import { Course } from '../entities/course.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CourseRepo extends BaseRepository<Course> {
  constructor(
    @InjectRepository(Course) private courseModel: Repository<Course>,
    private courseRepo: Repository<Course>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super(courseModel);
    this.courseRepo = this.entityManager.getRepository(Course);
  }
}
