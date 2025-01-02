import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/repository/base.repository';
import { Level } from '../entities/level.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class LevelRepo extends BaseRepository<Level> {
  constructor(
    @InjectRepository(Level) private levelModel: Repository<Level>,
    private levelRepo: Repository<Level>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super(levelModel);
    this.levelRepo = this.entityManager.getRepository(Level);
  }
}
