import { User } from 'src/auth/entities/auth.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Program } from 'src/programs/entities/program.entity';
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

  @Column({ default: null })
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
  guardianEmail: string;

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

  // Many Students belong to one Department
  @ManyToOne(() => Program, (program) => program.students)
  @JoinColumn({ name: 'program_id' })
  program: Program;

  // Many Students belong to one School
  @ManyToOne(() => School, (school) => school.students)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
