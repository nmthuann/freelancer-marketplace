import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

// Danh mục gig — trước đây category chỉ là string tự do trong Post.
// Tách ra collection riêng để chuẩn hoá & lọc.
@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true, trim: true })
  name: string; // "Programming & Tech"

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string; // "programming-tech"

  @Prop({ type: [String], default: [] })
  subCategories: string[]; // ["Web Development", "Mobile Apps", ...]

  @Prop({ default: '' })
  icon: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ slug: 1 });
