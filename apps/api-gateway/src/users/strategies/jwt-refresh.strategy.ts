import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    const refreshToken = req.body?.refreshToken;

    const user = await firstValueFrom(
      this.userClient.send('auth.get_refresh_token', { userId: payload.sub }),
    );

    if (!user?.refreshToken || user.refreshToken !== refreshToken)
      throw new UnauthorizedException('Refresh token invalid');

    return { userId: payload.sub, email: payload.email }; // → req.user
  }
}
