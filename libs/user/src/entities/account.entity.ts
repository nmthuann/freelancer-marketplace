import { Entity, Column, PrimaryColumn, BeforeInsert, OneToOne } from 'typeorm';
import { Role } from '../enums/role.enum';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'accounts' })
export class AccountEntity extends BaseEntity {
  @PrimaryColumn({ length: 50 })
  email: string;

  @Column({ nullable: false }) //select: false
  password: string;

  @Column({ default: true }) // 0: false  1: true
  status: boolean;

  @Column({ name: 'refresh_token', default: null })
  refreshToken: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @OneToOne(() => UserEntity, (user) => user.account)
  user: UserEntity;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
