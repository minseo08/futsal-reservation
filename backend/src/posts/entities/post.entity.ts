import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';

export enum PostCategory {
  NOTICE = 'NOTICE',
  FREE = 'FREE',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: PostCategory,
    default: PostCategory.FREE,
  })
  category: PostCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { eager: true }) 
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}