import { Department } from 'src/departments/entities/department.entity';
import { Level } from 'src/levels/entities/level.entity';
import { School } from 'src/schools/entities/school.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  address: string;

  @Column()
  guardian: string;

  @Column()
  guardianAddress: string;

  @Column()
  guardianPhone: string;

  @OneToOne(() => Level)
  @JoinColumn()
  level: Level;

  @OneToOne(() => School)
  @JoinColumn()
  school: School;

  @OneToOne(() => Department)
  @JoinColumn()
  department: Department;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
