import { User } from 'src/auth/entities/auth.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Department } from 'src/departments/entities/department.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'staffs' })
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  middlename: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  position: string;

  @Column()
  level: string;

  @Column()
  dob: Date;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Department, (department) => department.id)
  department: Department;

  @ManyToMany(() => Course, (course) => course.lecturer) // Assuming a many-to-many relationship
  @JoinTable() // This will create a join table for the many-to-many relationship
  courses: Course[];


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
