import { AuthService } from '@app/auth';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@app/auth/guards/local-auth.guard';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard) // Passport gọi validateUser → gắn req.user
  @Post('login')
  login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: any) {
    return this.authService.logout(req.user.userId);
  }

  @Post('refresh')
  refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }
}
