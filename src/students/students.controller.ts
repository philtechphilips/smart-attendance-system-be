import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Public } from 'src/auth/decorators/public.decorators';
import { CustomValidationPipe } from 'src/shared/utils/instances';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorators';

@ApiTags('Students')
@ApiBearerAuth('access-token')
@Controller('/v1/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Public()
  @UsePipes(ValidationPipe)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll(@Query(CustomValidationPipe) pagination: PaginationDto) {
    return this.studentsService.findAll(pagination);
  }

  @Get('/departmental-students')
  @Roles(Role.HOD)
  getAllDepartmentStudent(
    @Query(CustomValidationPipe) pagination: PaginationDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.studentsService.getDepartmentStudent(pagination, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
