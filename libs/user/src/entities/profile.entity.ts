import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'profiles' })
export class ProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'NEW_SELLER' })
  level: string;

  @Column()
  occupation: string;

  @Column({ type: 'jsonb', nullable: true })
  profileAttributeValues: { attribute: string; value: string }[];

  @OneToOne(() => UserEntity, (user) => user.profile)
  user: UserEntity;
}
