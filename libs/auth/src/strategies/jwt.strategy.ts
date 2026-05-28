import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PayloadDto } from '../dto/payload.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET_KEY'),
    });
  }

  async validate(payload: PayloadDto) {
    return { userId: payload.userId, email: payload.email };
    // gắn vào req.user
  }
}
