import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import ITool from '@modules/tools/entities/ITool';

@Entity('tools')
class Tool implements ITool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @Column('uuid')
  user_id: string;

  @Column()
  title: string;

  @Column()
  link: string;

  @Column()
  description: string;

  @Column('text', { array: true })
  tags: string[];

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}

export default Tool;
