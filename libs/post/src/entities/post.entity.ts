import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CategoryEntity } from './category.entity';
import { ReviewEntity } from './review.entity';
import { PackageEntity } from './package.entity';

@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string; //  => post name

  @Column({ nullable: false })
  seller: string;

  @Column({ nullable: false })
  description: string;

  @Column({ default: 'active' }) // length: 50,
  // 0: active  1: unchecked 2. stopped 3 tạm ngưng
  status: string;

  @Column({ nullable: true, default: '' })
  FAQ: string;

  @Column({ name: 'image_url', nullable: true, default: '' })
  imageUrl: string;

  @ManyToOne(() => CategoryEntity, (category) => category.posts, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  // PACKAGE (FK)
  @OneToMany(() => PackageEntity, (pkg) => pkg.post)
  packages?: PackageEntity[];

  // REVIEW (FK)
  @OneToMany(() => ReviewEntity, (review) => review.post)
  reviews?: ReviewEntity[];
}
