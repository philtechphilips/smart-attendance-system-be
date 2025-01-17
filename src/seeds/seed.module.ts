import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Sessions } from 'src/sessions/entities/session.entity';
import { Semester } from 'src/semesters/entities/semester.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sessions, Semester])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
