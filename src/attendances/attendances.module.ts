import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { Student } from 'src/students/entities/student.entity';
import { Attendance } from './entities/attendance.entity';
import { Course } from 'src/courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Student, Course])],
  controllers: [AttendancesController],
  providers: [AttendancesService],
})
export class AttendancesModule {}
