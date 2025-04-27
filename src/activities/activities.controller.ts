import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll(@Req() req) {
    const user = req.user; 
    return this.activitiesService.findAll(user.id);
  }
}
