import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersClientProxy } from './user-client.proxy';
import { RegisterDto } from '@app/user/dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import {
  CurrentUser,
  Roles,
} from 'apps/api-gateway/decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('')
export class UsersController {
  constructor(private readonly usersClientProxy: UsersClientProxy) {}

  @Post('/auth/register')
  register(@Body() dto: RegisterDto) {
    return this.usersClientProxy.register(dto);
  }

  @UseGuards(LocalAuthGuard) // validate xong → req.user = safeUser
  @Post('/auth/login')
  login(@CurrentUser() user: any) {
    return this.usersClientProxy.login(user);
  }

  @UseGuards(JwtRefreshGuard) // verify refresh token → req.user = { userId, email }
  @Post('/auth/refresh')
  refresh(@CurrentUser() user: any) {
    return this.usersClientProxy.refreshTokens(user.userId, user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/auth/logout')
  logout(@CurrentUser() user: any) {
    return this.usersClientProxy.logout(user.userId);
  }

  // ── Profile cá nhân ───────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('/users/me')
  getMe(@CurrentUser() user: any) {
    return this.usersClientProxy.getMe(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/users/me')
  updateMe(@CurrentUser() user: any, @Body() dto: any) {
    return this.usersClientProxy.updateMe(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/users/me/password')
  changePassword(@CurrentUser() user: any, @Body() dto: any) {
    return this.usersClientProxy.changePassword(user.userId, dto);
  }

  // ── Seller profile ────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('/users/me/seller-profile')
  createSellerProfile(@CurrentUser() user: any, @Body() dto: any) {
    return this.usersClientProxy.createSellerProfile(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/users/me/seller-profile')
  updateSellerProfile(@CurrentUser() user: any, @Body() dto: any) {
    return this.usersClientProxy.updateSellerProfile(user.userId, dto);
  }

  // ── Public ────────────────────────────────────────────

  @Get('/users/search')
  searchUsers(@Query() query: any) {
    return this.usersClientProxy.searchUsers(query);
  }

  @Get('/users/:username')
  getPublicProfile(@Param('username') username: string) {
    return this.usersClientProxy.getPublicProfile(username);
  }

  // ── Admin ─────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/users/admin/list')
  adminGetAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.usersClientProxy.adminGetAllUsers(+page, +limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/users/admin/:userId')
  adminGetUser(@Param('userId') userId: string) {
    return this.usersClientProxy.adminGetUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('/users/admin/:userId')
  adminUpdateUser(@Param('userId') userId: string, @Body() dto: any) {
    return this.usersClientProxy.adminUpdateUser(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('/users/admin/:userId')
  adminDeactivateUser(
    @CurrentUser() requester: any,
    @Param('userId') userId: string,
  ) {
    return this.usersClientProxy.adminDeactivateUser(userId);
  }
}
