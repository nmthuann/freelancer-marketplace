import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PostEntity } from './post.entity'; // Giả sử bạn đã định nghĩa PostEntity

@Entity('packages')
export class PackageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'package_name', length: 50, nullable: false })
  packageName: string;

  @Column()
  caption: string;

  @Column({ length: 255 })
  revision: string;

  @Column({ name: 'delivery_day', nullable: false })
  deliveryDay: number;

  @Column({ nullable: false })
  fee: number;

  // Bảng packages có khóa ngoại tham chiếu đến bảng posts
  @ManyToOne(() => PostEntity, { onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}
