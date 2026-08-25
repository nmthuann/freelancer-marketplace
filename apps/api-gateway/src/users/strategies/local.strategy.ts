import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await firstValueFrom(
      this.userClient.send('auth.validate_user', { email, password }),
    );
    if (!user)
      throw new UnauthorizedException('Email or password is incorrect');
    return user; // → req.user
  }
}
