import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { Student } from 'src/students/entities/student.entity';
import { Attendance } from './entities/attendance.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Staff } from 'src/staffs/entities/staff.entity';
import { AttendanceGateway } from 'src/shared/socket/attendance.socket';
import { Level } from 'src/levels/entities/level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, Student, Course, Staff, Level]),
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService, AttendanceGateway],
})
export class AttendancesModule {}
