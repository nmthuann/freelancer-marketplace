// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoleEnum } from '../enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  // handle công khai, dùng cho URL trang seller: /seller/:username
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: '' })
  fullName: string;

  @Prop({ default: '' })
  avatar: string;

  // buyer vừa có thể mua vừa có thể mở seller profile để bán
  @Prop({ type: String, enum: UserRoleEnum, default: UserRoleEnum.BUYER })
  role: UserRoleEnum;

  @Prop({ default: '' })
  country: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastLoginAt: Date | null;

  @Prop({ default: null, select: false })
  refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
