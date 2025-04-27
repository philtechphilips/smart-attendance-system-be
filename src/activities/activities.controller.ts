import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto, @Req() req) {

    const user = req.user; 
    return this.activitiesService.create(createActivityDto, user.id);
  }

  @Get()
  findAll(@Req() req) {
    const user = req.user; 
    return this.activitiesService.findAll(user.id);
  }
}
