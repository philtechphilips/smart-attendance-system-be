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
import { Semester } from 'src/semesters/entities/semester.entity';
import { Stream } from './entities/stream.entity';
import { StreamService } from './services/stream.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attendance,
      Student,
      Course,
      Staff,
      Level,
      Semester,
      Stream,
    ]),
  ],
  controllers: [AttendancesController],
  providers: [AttendancesService, AttendanceGateway, StreamService],
  exports: [StreamService],
})
export class AttendancesModule {}
