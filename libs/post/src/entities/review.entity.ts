import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { PostEntity } from './post.entity';

/**
 * customer
 * rating
 * feedback
 *
 */
@Entity({ name: 'reviews' })
export class ReviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  buyer: string;

  @Column({ nullable: false, type: 'int' })
  rating: number;

  @Column({ nullable: false })
  feedback: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @ManyToOne(() => PostEntity, (post) => post.reviews, {
    eager: true,
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}
