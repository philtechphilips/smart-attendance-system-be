import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorators';

@ApiTags('Levels')
@ApiBearerAuth('access-token')
@Controller('/v1/levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  @Public()
  findAll() {
    return this.levelsService.findAll();
  }
}
