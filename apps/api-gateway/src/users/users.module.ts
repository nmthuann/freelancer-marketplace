import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersClientProxy } from './user-client.proxy';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3301 },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersClientProxy],
  exports: [UsersClientProxy, ClientsModule], // 👈 quan trọng
})
export class UsersModule {}
