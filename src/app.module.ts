import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceOptions } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { AttendancesModule } from './attendances/attendances.module';
import { StaffsModule } from './staffs/staffs.module';
import { CoursesModule } from './courses/courses.module';
import { SchedulesModule } from './schedules/schedules.module';
import { DepartmentsModule } from './departments/departments.module';
import { LevelsModule } from './levels/levels.module';
import { SchoolsModule } from './schools/schools.module';
import { SessionsModule } from './sessions/sessions.module';
import { SemestersModule } from './semesters/semesters.module';
import { SeedModule } from './seeds/seed.module';
import { SeedService } from './seeds/seed.service';
import { ProgramsModule } from './programs/programs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(datasourceOptions),
    AuthModule,
    StudentsModule,
    AttendancesModule,
    StaffsModule,
    CoursesModule,
    SchedulesModule,
    DepartmentsModule,
    LevelsModule,
    SchoolsModule,
    SessionsModule,
    SemestersModule,
    SeedModule,
    ProgramsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedService: SeedService) {}

  async onApplicationBootstrap() {
    await this.seedService.run();
  }
}
