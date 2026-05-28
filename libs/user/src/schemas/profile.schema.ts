import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { LevelEnum } from '../enums/level.enum';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  user: Types.ObjectId; // 1-1 với User

  @Prop({ default: '' })
  bio: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ default: '' })
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: LevelEnum.NEW_SELLER })
  level: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
