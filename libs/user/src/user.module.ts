import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, UserEntity, ProfileEntity]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
