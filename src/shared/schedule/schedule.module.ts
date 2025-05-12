import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AttendancesModule } from 'src/attendances/attendances.module';
import { SchedulingService } from './schedule.service';
import { AttendancesService } from 'src/attendances/attendances.service';
import { LevelRepo } from 'src/levels/repository/level.repository';
import { CourseRepo } from 'src/courses/repository/courses.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from 'src/levels/entities/level.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Student } from 'src/students/entities/student.entity';
import { Staff } from 'src/staffs/entities/staff.entity';
import { AttendanceGateway } from '../socket/attendance.socket';
import { Repository } from 'typeorm';
import { Semester } from 'src/semesters/entities/semester.entity';
import { Stream } from 'src/attendances/entities/stream.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Level,
      Course,
      Attendance,
      Student,
      Staff,
      Semester,
      Stream,
    ]),
  ],

  providers: [
    SchedulingService,
    AttendancesService,
    LevelRepo,
    CourseRepo,
    AttendanceGateway,
    Repository,
  ],
})
export class SchedulingModule {}
