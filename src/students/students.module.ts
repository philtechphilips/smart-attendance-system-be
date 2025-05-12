import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/shared/email/email.service';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthRepo } from '../auth/repository/auth.repository';
import { LocalStrategy } from '../auth/strategies/local.strategies';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { User } from 'src/auth/entities/auth.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Department } from 'src/departments/entities/department.entity';
import { School } from 'src/schools/entities/school.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Staff } from 'src/staffs/entities/staff.entity';
import { Course } from 'src/courses/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      User,
      Level,
      Department,
      School,
      Program,
      Staff,
      Course,
    ]),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_DURATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StudentsController],
  providers: [
    StudentsService,
    AuthService,
    EmailService,
    AuthRepo,
    LocalStrategy,
    Repository,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthRepo, AuthService, Repository],
})
export class StudentsModule {}
