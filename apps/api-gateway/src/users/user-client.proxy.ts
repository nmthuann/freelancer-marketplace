// api-gateway/src/users/user-client.proxy.ts
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersClientProxy {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: { _id: string; email: string }) {
    const tokens = await this.generateTokens(user._id, user.email);
    await firstValueFrom(
      this.userClient.send('auth.save_refresh_token', {
        userId: user._id,
        token: tokens.refreshToken,
      }),
    );
    return tokens;
  }

  async register(dto: any) {
    const user = await firstValueFrom(
      this.userClient.send('auth.register', dto),
    );
    const tokens = await this.generateTokens(user._id, user.email);
    await firstValueFrom(
      this.userClient.send('auth.save_refresh_token', {
        userId: user._id,
        token: tokens.refreshToken,
      }),
    );
    return tokens;
  }

  async logout(userId: string) {
    await firstValueFrom(
      this.userClient.send('auth.clear_refresh_token', { userId }),
    );
  }

  async refreshTokens(userId: string, email: string) {
    // JwtRefreshGuard đã verify → generate token mới
    const tokens = await this.generateTokens(userId, email);
    await firstValueFrom(
      this.userClient.send('auth.save_refresh_token', {
        userId,
        token: tokens.refreshToken,
      }),
    );
    return tokens;
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  // ── User ──────────────────────────────────────────────

  getMe(userId: string) {
    return firstValueFrom(this.userClient.send('user.get_me', { userId }));
  }

  updateMe(userId: string, dto: any) {
    return firstValueFrom(
      this.userClient.send('user.update_me', { userId, dto }),
    );
  }

  changePassword(userId: string, dto: any) {
    return firstValueFrom(
      this.userClient.send('user.change_password', { userId, dto }),
    );
  }

  getPublicProfile(username: string) {
    return firstValueFrom(
      this.userClient.send('user.get_public_profile', { username }),
    );
  }

  searchUsers(dto: any) {
    return firstValueFrom(this.userClient.send('user.search', dto));
  }

  createSellerProfile(userId: string, dto: any) {
    return firstValueFrom(
      this.userClient.send('user.create_seller_profile', { userId, dto }),
    );
  }

  updateSellerProfile(userId: string, dto: any) {
    return firstValueFrom(
      this.userClient.send('user.update_seller_profile', { userId, dto }),
    );
  }

  // ── Admin ─────────────────────────────────────────────

  adminGetAllUsers(page: number, limit: number) {
    return firstValueFrom(
      this.userClient.send('admin.get_all_users', { page, limit }),
    );
  }

  adminGetUser(userId: string) {
    return firstValueFrom(this.userClient.send('admin.get_user', { userId }));
  }

  adminUpdateUser(userId: string, dto: any) {
    return firstValueFrom(
      this.userClient.send('admin.update_user', { userId, dto }),
    );
  }

  adminDeactivateUser(userId: string) {
    return firstValueFrom(
      this.userClient.send('admin.deactivate_user', { userId }),
    );
  }

  adminHardDeleteUser(requesterId: string, targetId: string) {
    return firstValueFrom(
      this.userClient.send('admin.hard_delete_user', { requesterId, targetId }),
    );
  }
}
