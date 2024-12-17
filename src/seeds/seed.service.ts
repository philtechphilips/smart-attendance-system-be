import { Injectable } from '@nestjs/common';
import { Level } from 'src/levels/entities/level.entity';
import { Semester } from 'src/semesters/entities/semester.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const sessionRepository = this.dataSource.getRepository(Session);
    const semesterRepository = this.dataSource.getRepository(Semester);
    const levelRepository = this.dataSource.getRepository(Level);

    // Check if sessions already exist
    const existingSessions = await sessionRepository.find();
    const existingLevels = await levelRepository.find();

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

    if (existingSessions.length > 0) {
      console.log('Seed data already exists!');
      return;
    }

    // Create sessions and associate semesters
    const session1 = new Session();
    session1.name = '2023/2024';
    session1.semesters = [
      await semesterRepository.save(semesterRepository.create({ name: 'First Semester' })),
      await semesterRepository.save(semesterRepository.create({ name: 'Second Semester' })),
    ];

    const session2 = new Session();
    session2.name = '2024/2025';
    session2.semesters = [
      await semesterRepository.save(semesterRepository.create({ name: 'First Semester' })),
      await semesterRepository.save(semesterRepository.create({ name: 'Second Semester' })),
    ];

    await sessionRepository.save([session1, session2]);

    console.log('Seed data successfully added to Session tables.');
  }
}
