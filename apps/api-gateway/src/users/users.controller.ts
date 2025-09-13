import { Controller, Get, Query } from '@nestjs/common';
import { UsersClientProxy } from './user-client.proxy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersClientProxy: UsersClientProxy) {}

  @Get('get-user')
  async getUserByEmail(@Query('email') email: string) {
    return this.usersClientProxy.getUserByEmail(email);
  }
}
