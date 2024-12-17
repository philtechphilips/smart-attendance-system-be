import { Department } from 'src/departments/entities/department.entity';
import { Level } from 'src/levels/entities/level.entity';
import { Staff } from 'src/staffs/entities/staff.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  
  @Entity({ name: 'courses' })
  export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
    
    @Column()
    code: string;
    
    @ManyToOne(() => Staff, (staff) => staff.id)
    lecturer: Staff

    @ManyToOne(() => Level, (level) => level.id)
    class: Level

    @ManyToMany(() => Department)
    @JoinTable()
    categories: Department[]
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  