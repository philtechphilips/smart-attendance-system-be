import { Injectable } from '@nestjs/common';
import { Semester } from 'src/semesters/entities/semester.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const sessionRepository = this.dataSource.getRepository(Session);
    const semesterRepository = this.dataSource.getRepository(Semester);

    // Check if data already exists
    const existingSessions = await sessionRepository.find();
    if (existingSessions.length > 0) {
      console.log('Seed data already exists!');
      return;
    }

    // Create sessions and semesters
    const session1 = new Session();
    session1.name = '2023/2024';
    session1.semesters = [
      semesterRepository.create({ name: 'First Semester' }),
      semesterRepository.create({ name: 'Second Semester' }),
    ];

    const session2 = new Session();
    session2.name = '2024/2025';
    session2.semesters = [
      semesterRepository.create({ name: 'First Semester' }),
      semesterRepository.create({ name: 'Second Semester' }),
    ];

    await sessionRepository.save([session1, session2]);
    console.log('Seed data inserted successfully!');
  }
}
