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

  @ManyToOne(() => Semester, (semester) => semester.id, { nullable: true })
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;

  @ManyToOne(() => Course, (course) => course.id, { nullable: false })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
