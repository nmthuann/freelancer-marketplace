import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ProfileModule } from '@app/profile';

@Module({
  imports: [ProfileModule],
  controllers: [UsersController],
})
export class UsersModule {}
