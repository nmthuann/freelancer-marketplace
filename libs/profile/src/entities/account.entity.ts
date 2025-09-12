import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import { BaseEntity } from './base.entity';
import { UserInformationEntity } from './user-information.entity';

@Entity({ name: 'accounts' })
export class AccountEntity extends BaseEntity {
  @PrimaryColumn()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: null })
  refresh_token: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @OneToOne(() => UserInformationEntity, (infor) => infor.account, {
    cascade: true,
  })
  @JoinColumn()
  infor: UserInformationEntity; // TODO: One to One

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
