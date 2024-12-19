import { Injectable } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  async findAll() {
    return await this.levelRepository.find();
  }
}
