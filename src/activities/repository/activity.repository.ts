import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/repository/base.repository';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';

@Injectable()
export class ActivityRepo extends BaseRepository<Activity> {
  constructor(
    @InjectRepository(Activity) private activityModel: Repository<Activity>,
    private activityRepo: Repository<Activity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super(activityModel);
    this.activityRepo = this.entityManager.getRepository(Activity);
  }
}
