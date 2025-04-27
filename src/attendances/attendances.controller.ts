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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorators';
import { Role } from 'src/shared/enums/role.enum';
import { CustomValidationPipe } from 'src/shared/utils/instances';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { AttendanceQueryDto } from 'src/shared/dto/attendance.dto';
import { DateFilter } from 'src/utils/date-filter';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Attendance')
@ApiBearerAuth('access-token')
@Controller('/v1/attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.createAttendance(createAttendanceDto);
  }

  @Get('/departmental-attendance')
  @Roles(Role.HOD, Role.LECTURER)
  getAllDepartmentStudent(
    @Req() req,
    @Query(CustomValidationPipe) pagination: PaginationDto,
    @Query(CustomValidationPipe) query?: AttendanceQueryDto,
  ) {
    const user = req.user;
    const ranges = DateFilter(query);

    return this.attendancesService.getAttendanceByDepartment(
      pagination,
      user,
      query,
      ranges,
    );
  }


  @Get('/student-attendance/:id')
  getStudentAttendanceDetails(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.attendancesService.getStudentAttendanceDetails(id);
  }

  @Get('/student-attendance-record/:id')
  getAStudentAttendanceDetails(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.attendancesService.getAStudentAttendanceDetails(id);
  }

  @Get('/:id')
  @Roles(Role.HOD, Role.LECTURER)
  getAttendanceById(@Param('id') id: string) {
    return this.attendancesService.getAttendanceById(id);
  }

  @Post('/capture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadProfile(@Req() req) {
    const base64Image = req.body.image;

    const data = req.body;
    return this.attendancesService.mark(data);
  }
}
