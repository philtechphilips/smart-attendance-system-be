import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorators';

@ApiTags('School')
@ApiBearerAuth('access-token')
@Controller('/v1/schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(id);
  }
}
