import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { Staff } from './entities/staff.entity';
import { User } from 'src/auth/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/departments/entities/department.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/shared/email/email.service';
import { LocalStrategy } from 'src/auth/strategies/local.strategies';
import { AuthRepo } from 'src/auth/repository/auth.repository';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Course } from 'src/courses/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, User, Department, Course]),
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
  controllers: [StaffsController],
  providers: [
    StaffsService,
    Repository,
    AuthService,
    EmailService,
    AuthRepo,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class StaffsModule {}
