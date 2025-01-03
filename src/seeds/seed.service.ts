import { Injectable } from '@nestjs/common';
import { Level } from 'src/levels/entities/level.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Semester } from 'src/semesters/entities/semester.entity';
import { Sessions } from 'src/sessions/entities/session.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const sessionRepository = this.dataSource.getRepository(Sessions);
    const semesterRepository = this.dataSource.getRepository(Semester);
    const levelRepository = this.dataSource.getRepository(Level);
    const programRepository = this.dataSource.getRepository(Program);

    // Check if sessions already exist
    const existingSessions = await sessionRepository.find();
    const existingLevels = await levelRepository.find();
    const existingPrograms = await programRepository.find();

    if (existingLevels.length === 0) {
      // Correctly create multiple levels
      const levels = [
        { name: 'ND 1' },
        { name: 'ND 2' },
        { name: 'ND 3' },
        { name: 'HND 1' },
        { name: 'HND 2' },
        { name: 'HND 3' },
      ];

      await levelRepository.save(levels);
      console.log('Levels were successfully added.');
    }

    if (existingPrograms.length === 0) {
      // Correctly create multiple levels
      const programs = [
        { name: 'FULL TIME' },
        { name: 'PART TIME' },
        { name: 'DISTANCE LEARNING' },
        { name: 'TOP UP' },
      ];

      await programRepository.save(programs);
      console.log('Programs were successfully added.');
    }

    if (existingSessions.length > 0) {
      console.log('Seed data already exists!');
      return;
    }

    // Create sessions and associate semesters
    const session1 = new Sessions();
    session1.name = '2023/2024';
    session1.semesters = [
      await semesterRepository.save(
        semesterRepository.create({ name: 'First Semester' }),
      ),
      await semesterRepository.save(
        semesterRepository.create({ name: 'Second Semester' }),
      ),
    ];

    const session2 = new Sessions();
    session2.name = '2024/2025';
    session2.semesters = [
      await semesterRepository.save(
        semesterRepository.create({ name: 'First Semester' }),
      ),
      await semesterRepository.save(
        semesterRepository.create({ name: 'Second Semester' }),
      ),
    ];

    await sessionRepository.save([session1, session2]);

    console.log('Seed data successfully added to Session tables.');
  }
}
