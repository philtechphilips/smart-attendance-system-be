import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorators';
import { CustomValidationPipe } from 'src/shared/utils/instances';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Role } from 'src/shared/enums/role.enum';

@ApiTags('Courses')
@ApiBearerAuth('access-token')
@Controller('/v1/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll(@Query(CustomValidationPipe) pagination: PaginationDto) {
    return this.coursesService.findAll(pagination);
  }

  @Get('/departmental-courses')
  @Roles(Role.HOD)
  getAllDepartmentCourses(
    @Query(CustomValidationPipe) pagination: PaginationDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.coursesService.getDepartmentCourses(pagination, user);
  }

  @Get('/course-attendance/:id')
  @Roles(Role.HOD, Role.LECTURER)
  getCoursesAttendance(
    @Param('id') id: string,
    @Query('search') search: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req,
  ) {
    return this.coursesService.getAttendanceByCourse(id, search, startDate, endDate);
  }

  @Get('/course-attendance/:id/download')
  @Roles(Role.HOD, Role.LECTURER)
  downloadCoursesAttendance(
    @Param('id') id: string,
    @Req() req,
    @Res() res,
  ) {
    const user = req.user;
    return this.coursesService.downloadAttendanceByCourse(id, res);
  }

  @Get('/lecturer')
  @Roles(Role.LECTURER)
  getCoursesForLecturer(@Req() req, @Query('search') search: string) {
    const user = req.user;
    return this.coursesService.getLecturerCourses(user.id, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
