// user/user.service.ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { TokensDto } from './dto/tokens.dto';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ═══════════════════════════════════════════════
  // INTERNAL – AuthService dùng
  // ═══════════════════════════════════════════════

  // ── Passport Local Strategy gọi ──────────────────────
  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user.toObject();
    return safeUser; // → gắn vào req.user bởi LocalStrategy
  }

  async register(dto: RegisterDto): Promise<TokensDto> {
    // userService.create đã check duplicate email/username
    const user = await this.create(dto);

    const payload: PayloadDto = {
      userId: user._id.toString(),
      email: user.email,
    };
    const tokens = await this.generateTokens(payload);

    await this.saveRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<TokensDto> {
    const user = await this.findByIdWithRefreshToken(userId);
    if (!user?.refreshToken) throw new UnauthorizedException('Access denied');

    // so sánh raw token
    if (user.refreshToken !== refreshToken)
      throw new UnauthorizedException('Refresh token invalid');

    const payload: PayloadDto = {
      userId: user._id.id.toString(),
      email: user.email,
    };
    const tokens = await this.generateTokens(payload);

    await this.saveRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  private async generateTokens(payload: PayloadDto): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET_KEY'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByIdWithRefreshToken(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).select('+refreshToken').exec();
  }

  async create(dto: RegisterDto): Promise<UserDocument> {
    const emailExists = await this.userModel.exists({ email: dto.email });

    if (emailExists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 12);
    return this.userModel.create({ ...dto, password: hashed });
  }

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: token });
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  // ═══════════════════════════════════════════════
  // PROFILE – buyer & seller
  // ═══════════════════════════════════════════════

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('-__v').exec();
    if (!user) throw new NotFoundException('User not found');
    const profile = await this.profileModel
      .findOne({ user: userId })
      .select('-__v')
      .exec();
    return { user, profile: profile ?? null };
  }

  async getPublicProfile(username: string) {
    const user = await this.userModel
      .findOne({ username, isActive: true })
      .select('-__v')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    const profile = await this.profileModel
      .findOne({ user: user._id })
      .select('-__v')
      .exec();
    return { user, profile: profile ?? null };
  }

  async updateMe(userId: string, dto: UpdateProfileDto): Promise<UserDocument> {
    const updated = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: dto },
        { new: true, runValidators: true },
      )
      .select('-__v')
      .exec();
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userModel
      .findById(userId)
      .select('+password')
      .exec();
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch)
      throw new BadRequestException('Current password is incorrect');
    if (dto.currentPassword === dto.newPassword)
      throw new BadRequestException('New password must differ from current');

    user.password = await bcrypt.hash(dto.newPassword, 12);
    await user.save();
  }

  // ═══════════════════════════════════════════════
  // SELLER PROFILE
  // ═══════════════════════════════════════════════

  async createSellerProfile(
    userId: string,
    dto: Partial<Pick<Profile, 'bio' | 'skills' | 'description'>>,
  ): Promise<ProfileDocument> {
    const exists = await this.profileModel.exists({ user: userId });
    if (exists) throw new ConflictException('Seller profile already exists');
    return this.profileModel.create({
      user: new Types.ObjectId(userId),
      ...dto,
    });
  }

  async updateSellerProfile(
    userId: string,
    dto: Partial<Pick<Profile, 'bio' | 'skills' | 'description'>>,
  ): Promise<ProfileDocument> {
    const profile = await this.profileModel
      .findOneAndUpdate(
        { user: userId },
        { $set: dto },
        { new: true, runValidators: true },
      )
      .exec();
    if (!profile) throw new NotFoundException('Seller profile not found');
    return profile;
  }

  async isSeller(userId: string): Promise<boolean> {
    return !!(await this.profileModel.exists({ user: userId, isActive: true }));
  }

  // ═══════════════════════════════════════════════
  // SEARCH (public)
  // ═══════════════════════════════════════════════

  async searchUsers(dto: SearchUsersDto) {
    const { q, skills, level, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const profileFilter: Record<string, any> = { isActive: true };
    if (skills?.length) profileFilter.skills = { $in: skills };
    if (level) profileFilter.level = level;

    const matchedProfiles = await this.profileModel
      .find(profileFilter)
      .select('user')
      .exec();
    const sellerIds = matchedProfiles.map((p) => p.user);

    const userFilter: Record<string, any> = {
      _id: { $in: sellerIds },
      isActive: true,
    };
    if (q) {
      const regex = new RegExp(q, 'i');
      userFilter.$or = [{ username: regex }, { fullName: regex }];
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(userFilter)
        .select('-__v')
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(userFilter),
    ]);

    const profileMap = new Map(
      matchedProfiles.map((p) => [p.user.toString(), p]),
    );

    return {
      data: users.map((u) => ({
        user: u,
        profile: profileMap.get(u._id.toString()) ?? null,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ═══════════════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════════════

  async adminGetAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find().select('-__v').skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(),
    ]);
    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async adminGetUser(userId: string) {
    const user = await this.userModel.findById(userId).select('-__v').exec();
    if (!user) throw new NotFoundException('User not found');
    const profile = await this.profileModel.findOne({ user: userId }).exec();
    return { user, profile };
  }

  async adminUpdateUser(
    userId: string,
    dto: AdminUpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: dto },
        { new: true, runValidators: true },
      )
      .select('-__v')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async adminDeactivateUser(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndUpdate(userId, {
      isActive: false,
    });
    if (!result) throw new NotFoundException('User not found');
  }

  async adminReactivateUser(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndUpdate(userId, {
      isActive: true,
    });
    if (!result) throw new NotFoundException('User not found');
  }

  async adminHardDeleteUser(
    requesterId: string,
    targetId: string,
  ): Promise<void> {
    if (requesterId === targetId)
      throw new ForbiddenException('Cannot delete your own account');
    await Promise.all([
      this.userModel.findByIdAndDelete(targetId),
      this.profileModel.findOneAndDelete({ user: targetId }),
    ]);
  }
}
