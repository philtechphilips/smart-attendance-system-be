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

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: ['present', 'absent', 'late'],
    default: 'absent',
  })
  status: 'present' | 'absent' | 'late';

  @ManyToOne(() => Student, (student) => student.id, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Course, (course) => course.id, { nullable: false })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
