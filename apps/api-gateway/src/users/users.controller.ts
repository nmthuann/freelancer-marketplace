import {
  Controller,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  UsePipes,
  Post,
  Body,
} from '@nestjs/common';
import { UsersClientProxy } from './user-client.proxy';
import { UserRequest } from './requests/user.request';
import { JwtAuthGuard } from 'apps/api-gateway/guards/jwt-auth.guard';
import { CreateUserPipeValidator } from 'apps/api-gateway/pipes/create-user.validator.pipe';
import { CreateProfileInterceptor } from 'apps/api-gateway/interceptors/create-profile.interceptor';
import { CreateUserRequest } from './requests/create-user.request';
import { CreateProfileRequest } from './requests/create-profile.request';
import { AdminRoleGuard } from 'apps/api-gateway/guards/admin.role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersClientProxy: UsersClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Request() req: UserRequest) {
    console.log('return req.user;', req.email);
    return await this.usersClientProxy.getUser(req.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @UsePipes(new CreateUserPipeValidator())
  @UseInterceptors(CreateProfileInterceptor)
  async createInformation(
    @Request() req: UserRequest,
    @Body() data: CreateUserRequest,
  ) {
    return await this.usersClientProxy.createUser(req.email, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-profile')
  async createProfile(
    @Request() req: UserRequest,
    @Body() profileDto: CreateProfileRequest,
  ) {
    console.log(`${req['email']} called method`);
    const token = req['token'];
    console.log('profileDto: ', profileDto);
    return await this.usersClientProxy.createProfile(token, profileDto);
  }

  @UseGuards(AdminRoleGuard)
  @Get('get-profiles') // -> for Admin
  async getProfileUsers(@Request() req: UserRequest) {
    return await this.usersClientProxy.getProfiles(req.email);
  }
}
