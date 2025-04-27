import { User } from 'src/auth/entities/auth.entity';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'activities' })
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.activities, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
