import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Semester } from 'src/semesters/entities/semester.entity';

@Entity('streams')
export class Stream {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @Column({ nullable: true })
  roomId: string;

  @ManyToOne(() => Course, (course) => course.id, { nullable: false })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
