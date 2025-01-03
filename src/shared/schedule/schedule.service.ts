import { Injectable } from '@nestjs/common';
import { AttendancesService } from 'src/attendances/attendances.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LevelRepo } from 'src/levels/repository/level.repository';
import { CourseRepo } from 'src/courses/repository/courses.repository';

@Injectable()
export class SchedulingService {
  constructor(
    private readonly attendanceService: AttendancesService,
    private readonly levelRepository: LevelRepo,
    private readonly courseRepository: CourseRepo,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async autoMarkAbsentForLevelAndCourse() {
    const today = new Date();

    try {
      // Retrieve all levels and courses
      const courses = await this.courseRepository.findAll();

      // Mark absent for all courses concurrently
      await Promise.all(
        courses.map((course) =>
          this.attendanceService
            .autoMarkAbsentForLevelAndCourse(course.id, today)
            .catch((error) => {
              console.error(
                `Error marking absents for course ${course.id}:`,
                error.message,
              );
            }),
        ),
      );

      console.log('Attendance marking completed for all levels and courses.');
    } catch (error) {
      console.error('Scheduler encountered an error:', error.message);
    }
  }
}
