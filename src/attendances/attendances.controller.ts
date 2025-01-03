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
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorators';
import { Role } from 'src/shared/enums/role.enum';
import { CustomValidationPipe } from 'src/shared/utils/instances';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { AttendanceQueryDto } from 'src/shared/dto/attendance.dto';
import { DateFilter } from 'src/utils/date-filter';

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
  @Roles(Role.HOD)
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

  @Get('/:id')
  @Roles(Role.HOD)
  getAttendanceById(@Param('id') id: string) {
    return this.attendancesService.getAttendanceById(id);
  }
}
