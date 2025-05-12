import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './entities/activity.entity';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(action: string, userId: string): Promise<Activity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const activity = this.activityRepository.create({
      action,
      user,
    });

    return this.activityRepository.save(activity);
  }

  findAll(userId: string): Promise<Activity[]> {
    return this.activityRepository.find({ where: { user: { id: userId } } });
  }
}
