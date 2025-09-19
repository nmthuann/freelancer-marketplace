import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserRequest } from './requests/create-user.request';
import { CreateProfileRequest } from './requests/create-profile.request';

@Injectable()
export class UsersClientProxy {
  constructor(@Inject('USERS_SERVICE') private readonly client: ClientProxy) {}

  async getUser(email: string) {
    return this.client.send('get-user', { email });
  }

  async createUser(email: string, data: CreateUserRequest) {
    return this.client.send('create-user', { email, data });
  }

  async createProfile(email: string, data: CreateProfileRequest) {
    return this.client.send('create-profile', { email, data });
  }

  async getProfiles(email: string) {
    return this.client.send('get-profiles', { email });
  }
}
