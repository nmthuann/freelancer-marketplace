import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from '../dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async login(input: LoginDto): Promise<TokensDto> {
    return {
      accessToken: 'string',
      refreshToken: 'string',
    };
  }
  public async register(input: LoginDto): Promise<TokensDto> {
    return {
      accessToken: 'string',
      refreshToken: 'string',
    };
  }
  public async logout(input, email): Promise<TokensDto> {
    return {
      accessToken: 'string',
      refreshToken: 'string',
    };
  }
}
