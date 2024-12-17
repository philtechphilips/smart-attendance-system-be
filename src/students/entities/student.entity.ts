import { Department } from 'src/departments/entities/department.entity';
import { Level } from 'src/levels/entities/level.entity';
import { School } from 'src/schools/entities/school.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'students' })
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lastname: string;

  @Column()
  firstname: string;

  @Column()
  middlename: string;

  @Column()
  matricNo: string;

  @Column()
  dob: Date;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  lga: string;

  @Column()
  class: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  guardian: string;

  @Column()
  guardianAddress: string;

  @Column()
  guardianPhone: string;

  // Many Students belong to one Level
  @ManyToOne(() => Level, (level) => level.students)
  @JoinColumn({ name: 'level_id' })
  level: Level;

  // Many Students belong to one Department
  @ManyToOne(() => Department, (department) => department.students)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  // Many Students belong to one School
  @ManyToOne(() => School, (school) => school.students)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
