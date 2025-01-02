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

  @Cron(CronExpression.EVERY_MINUTE)
  async autoMarkAbsentForLevelAndCourse() {
    const today = new Date();

    try {
      // Retrieve all levels and courses at once
      const [levels, courses] = await Promise.all([
        this.levelRepository.findAll(),
        this.courseRepository.findAll(),
      ]);

      const tasks = levels.flatMap((level) =>
        courses.map((course) =>
          this.attendanceService
            .autoMarkAbsentForLevelAndCourse(level.id, course.id, today)
            .catch((error) => {
              console.error(
                `Error marking absents for level ${level.id} and course ${course.id}:`,
                error.message,
              );
            }),
        ),
      );

      // Process all tasks concurrently
      await Promise.all(tasks);

      console.log('Attendance marking completed for all levels and courses.');
    } catch (error) {
      console.error('Scheduler encountered an error:', error.message);
    }
  }
}
