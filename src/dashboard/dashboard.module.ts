import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Staff } from 'src/staffs/entities/staff.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Semester } from 'src/semesters/entities/semester.entity';
import { User } from 'src/auth/entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attendance,
      Student,
      Course,
      Staff,
      Level,
      Semester,
      User,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
