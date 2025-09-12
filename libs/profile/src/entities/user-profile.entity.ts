import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserInformationEntity } from './user-information.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'user_profiles' })
export class UserProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  profile_id: number;

  @Column({ nullable: false })
  avatar: string;

  @Column()
  occupation: string;

  @Column()
  my_skill: string;

  @Column({ default: 'new seller' })
  level: string;

  @OneToOne(() => UserInformationEntity, (infor) => infor.profile)
  @JoinColumn() // fix here
  infor: UserInformationEntity;
}
