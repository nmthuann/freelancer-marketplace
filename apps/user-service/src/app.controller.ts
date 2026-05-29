// apps/user-service/src/app.controller.ts
import { UserService } from '@app/user';
import { RegisterDto } from '@app/user/dto/register.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  // ── Auth patterns (API Gateway gọi) ──────────────────

  @MessagePattern('auth.validate_user') // LocalStrategy dùng
  validateUser(@Payload() data: { email: string; password: string }) {
    return this.userService.validateUser(data.email, data.password);
  }

  @MessagePattern('auth.register')
  register(@Payload() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @MessagePattern('auth.save_refresh_token')
  saveRefreshToken(@Payload() data: { userId: string; token: string }) {
    return this.userService.refreshTokens(data.userId, data.token);
  }

  //   @MessagePattern('auth.clear_refresh_token')
  //   clearRefreshToken(@Payload() data: { userId: string }) {
  //     return this.authService.clearRefreshToken(data.userId);
  //   }

  //   @MessagePattern('auth.get_refresh_token') // JwtRefreshGuard dùng
  //   getRefreshToken(@Payload() data: { userId: string }) {
  //     return this.authService.getRefreshToken(data.userId);
  //   }

  // ── User patterns ─────────────────────────────────────

  @MessagePattern('user.get_me')
  getMe(@Payload() data: { userId: string }) {
    return this.userService.getMe(data.userId);
  }

  @MessagePattern('user.update_me')
  updateMe(@Payload() data: { userId: string; dto: any }) {
    return this.userService.updateMe(data.userId, data.dto);
  }

  @MessagePattern('user.change_password')
  changePassword(@Payload() data: { userId: string; dto: any }) {
    return this.userService.changePassword(data.userId, data.dto);
  }

  @MessagePattern('user.get_public_profile')
  getPublicProfile(@Payload() data: { username: string }) {
    return this.userService.getPublicProfile(data.username);
  }

  @MessagePattern('user.search')
  searchUsers(@Payload() dto: any) {
    return this.userService.searchUsers(dto);
  }

  @MessagePattern('user.create_seller_profile')
  createSellerProfile(@Payload() data: { userId: string; dto: any }) {
    return this.userService.createSellerProfile(data.userId, data.dto);
  }

  @MessagePattern('user.update_seller_profile')
  updateSellerProfile(@Payload() data: { userId: string; dto: any }) {
    return this.userService.updateSellerProfile(data.userId, data.dto);
  }

  // ── Admin patterns ────────────────────────────────────

  @MessagePattern('admin.get_all_users')
  adminGetAllUsers(@Payload() data: { page: number; limit: number }) {
    return this.userService.adminGetAllUsers(data.page, data.limit);
  }

  @MessagePattern('admin.get_user')
  adminGetUser(@Payload() data: { userId: string }) {
    return this.userService.adminGetUser(data.userId);
  }

  @MessagePattern('admin.update_user')
  adminUpdateUser(@Payload() data: { userId: string; dto: any }) {
    return this.userService.adminUpdateUser(data.userId, data.dto);
  }

  @MessagePattern('admin.deactivate_user')
  adminDeactivateUser(@Payload() data: { userId: string }) {
    return this.userService.adminDeactivateUser(data.userId);
  }

  @MessagePattern('admin.hard_delete_user')
  adminHardDeleteUser(
    @Payload() data: { requesterId: string; targetId: string },
  ) {
    return this.userService.adminHardDeleteUser(
      data.requesterId,
      data.targetId,
    );
  }
}
