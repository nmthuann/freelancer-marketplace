import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PayloadDto } from '../dto/payload.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AccountEntity } from 'libs/user/entities/account.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadDto) {
    return this.findByEmail(payload.email);
  }

  async findByEmail(email: string) {
    const repo = this.dataSource.getRepository(AccountEntity);
    return repo.findOne({ where: { email } });
  }
}
