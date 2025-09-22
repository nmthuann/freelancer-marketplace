import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_name', nullable: false })
  categoryName: string;

  @Column()
  description: string;

  @OneToMany(() => PostEntity, (post) => post.category)
  posts: PostEntity[];
}
