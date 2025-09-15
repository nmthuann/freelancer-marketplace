import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { AccountEntity } from './account.entity';
import { ProfileEntity } from './profile.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', length: 50, nullable: false })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'avatar_url' }) // 225
  avatarUrl: string;

  @Column({ length: 50 })
  gender: string;

  @Column({ nullable: false })
  birthday: Date;

  @Column() // 225
  location: string;

  @Column({ length: 10, nullable: false })
  phone: string;

  @OneToOne(() => AccountEntity, (account) => account.user, { nullable: false })
  //   (account) =>  account.email{ cascade: true }
  @JoinColumn({ name: 'email' }) // fix here
  account: AccountEntity;

  @OneToOne(() => ProfileEntity, (profile) => profile.user) // , { cascade: true }
  @JoinColumn({ name: 'profile_id' })
  profile: ProfileEntity;
}
