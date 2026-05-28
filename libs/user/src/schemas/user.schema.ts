// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  fullName: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null, select: false })
  refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
