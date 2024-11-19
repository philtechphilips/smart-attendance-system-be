import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'levels' })
export class Level {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
