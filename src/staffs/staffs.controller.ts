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
} from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from 'src/shared/utils/instances';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffsService.findOne(id);
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
