import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { LevelEnum } from '../enums/level.enum';

// Thống kê seller — cập nhật bởi Review/Order service
@Schema({ _id: false })
export class SellerStats {
  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: 0 })
  completedOrders: number;
}

export const SellerStatsSchema = SchemaFactory.createForClass(SellerStats);

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  // ref tới User trong CÙNG một DB (user-service) → dùng ObjectId ref hợp lệ
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  user: Types.ObjectId; // 1-1 với User

  // headline nghề nghiệp, vd "Senior Full-stack Developer"
  @Prop({ default: '', trim: true })
  title: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop({ min: 0, default: 0 })
  hourlyRate: number;

  @Prop({ type: SellerStatsSchema, default: () => ({}) })
  stats: SellerStats;

  @Prop({ default: LevelEnum.NEW_SELLER })
  level: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
