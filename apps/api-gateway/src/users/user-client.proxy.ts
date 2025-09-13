import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersClientProxy {
  constructor(@Inject('USERS_SERVICE') private readonly client: ClientProxy) {}

  async getUserByEmail(email: string) {
    return this.client.send('get-user-by-email', { email });
  }
}
