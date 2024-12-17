import { Department } from 'src/departments/entities/department.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  
  @Entity({ name: 'staffs' })
  export class Staff {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    surname: string;
    
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

    @ManyToOne(() => Department, (department) => department.id)
    department: Department
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  