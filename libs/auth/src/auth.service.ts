// auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { TokensDto } from './dto/tokens.dto';
import { PayloadDto } from './dto/payload.dto';
import { UserService } from '@app/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ── Passport Local Strategy gọi ──────────────────────
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user.toObject();
    return safeUser; // → gắn vào req.user bởi LocalStrategy
  }

  // ── Gọi sau khi LocalStrategy validate thành công ────
  async login(user: any): Promise<TokensDto> {
    const payload: PayloadDto = {
      userId: user._id.toString(),
      email: user.email,
    };
    const tokens = await this.generateTokens(payload);

    // lưu raw refresh token vào DB
    await this.userService.saveRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );
    return tokens;
  }

  async register(dto: RegisterDto): Promise<TokensDto> {
    // userService.create đã check duplicate email/username
    const user = await this.userService.create(dto);

    const payload: PayloadDto = {
      userId: user._id.toString(),
      email: user.email,
    };
    const tokens = await this.generateTokens(payload);

    await this.userService.saveRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userService.clearRefreshToken(userId);
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<TokensDto> {
    const user = await this.userService.findByIdWithRefreshToken(userId);
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Access denied');

    // so sánh raw token
    if (user.refreshToken !== refreshToken)
      throw new UnauthorizedException('Refresh token invalid');

    const payload: PayloadDto = {
      userId: user._id.toString(),
      email: user.email,
    };
    const tokens = await this.generateTokens(payload);

    await this.userService.saveRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );
    return tokens;
  }

  // ── Private ───────────────────────────────────────────
  private async generateTokens(payload: PayloadDto): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
