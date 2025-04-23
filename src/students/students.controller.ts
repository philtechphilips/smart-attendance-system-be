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
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Public } from 'src/auth/decorators/public.decorators';
import { CustomValidationPipe } from 'src/shared/utils/instances';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorators';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @Roles(Role.HOD, Role.LECTURER)
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

  @Post(':id/upload-profile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadProfile(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Req() req,
  ) {
    const base64Image = req.body.profileImage;
    console.log(id)
    return this.studentsService.uploadImage(id, base64Image);
  }
  

}
