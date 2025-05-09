import { Department } from 'src/departments/entities/department.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Staff } from 'src/staffs/entities/staff.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  unit: number;

  @ManyToOne(() => Staff, (staff) => staff.id)
  lecturer: Staff;

  @ManyToOne(() => Level, (level) => level.id)
  class: Level;

  @ManyToOne(() => Department, (department) => department.id)
  department: Department;

  @ManyToOne(() => Program, (program) => program.id)
  program: Program;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
