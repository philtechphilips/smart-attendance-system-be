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
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from 'src/shared/utils/instances';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Roles } from 'src/auth/decorators/role.decorators';
import { Role } from 'src/shared/enums/role.enum';

@ApiTags('Staffs')
@ApiBearerAuth('access-token')
@Controller('/v1/staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffsService.create(createStaffDto);
  }

  @Get()
  findAll(@Query(CustomValidationPipe) pagination: PaginationDto) {
    return this.staffsService.findAll(pagination);
  }

  @Get('/departmental-staffs')
  @Roles(Role.HOD)
  getAllDepartmentStudent(
    @Query(CustomValidationPipe) pagination: PaginationDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.staffsService.getDepartmentStaff(pagination, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffsService.findOne(id);
  }

  @Get('/courses/:id')
  getAssignedCourses(@Param('id') id: string) {
    return this.staffsService.getLecturerCourses(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffsService.update(id, updateStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffsService.remove(id);
  }
}
