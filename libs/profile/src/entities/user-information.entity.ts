import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { AccountEntity } from './account.entity';
import { UserProfileEntity } from './user-profile.entity';

@Entity({ name: 'user_informations' })
export class UserInformationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  infor_id: number;

  @Column({ nullable: false })
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  gender: string;

  @Column({ nullable: false })
  birthday: Date;

  @Column()
  address: string;

  @Column({ nullable: false })
  phone: string;

  @Column()
  education: string;

  @OneToOne(() => AccountEntity, (account) => account.infor)
  @JoinColumn() //TODO: fix here
  account: AccountEntity;

  @OneToOne(() => UserProfileEntity, (profile) => profile.infor, {
    cascade: true,
  })
  @JoinColumn()
  profile: UserProfileEntity;
}
