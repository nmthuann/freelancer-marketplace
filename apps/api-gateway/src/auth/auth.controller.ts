import { AuthService } from '@app/auth';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UsePipes,
} from '@nestjs/common';
import { Public } from 'apps/api-gateway/decorators/public.decorator';
import { AccountPipeValidator } from 'apps/api-gateway/pipes/account.validator.pipe';
import { AccountRequest } from './requests/account.request';
import { LoginResponse } from './responses/login.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  @UsePipes(new AccountPipeValidator())
  async login(@Body() loginDto: AccountRequest): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @UsePipes(new AccountPipeValidator())
  async register(@Body() accountReq: AccountRequest) {
    return await this.authService.register(accountReq);
  }

  //   @UseGuards(RolesGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req: any) {
    const email = req['email'];
    const token = req['token'];
    console.log('token', token);
    await this.authService.logout(email);
    return { message: 'Ban da dang xuat' };
  }
}
