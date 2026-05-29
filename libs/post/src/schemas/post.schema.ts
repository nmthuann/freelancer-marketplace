import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PricingTypeEnum } from '../enums/pricing-type.enum';
import { PostStatusEnum } from '../enums/post-status.enum';

@Schema({ _id: false })
export class GalleryItem {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: ['image', 'video', 'pdf'] })
  type: string;

  @Prop({ trim: true })
  caption?: string;

  @Prop()
  thumbnailUrl?: string; // dùng cho video
}

export const GalleryItemSchema = SchemaFactory.createForClass(GalleryItem);

@Schema({ _id: false })
export class PackageItem {
  @Prop({ required: true, trim: true })
  name: string; // e.g. "Basic", "Standard", "Premium"

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number; // USD cents hoặc VND, tuỳ hệ thống

  @Prop({ required: true, min: 1 })
  deliveryDays: number;

  @Prop({ default: 1, min: 0 })
  revisions: number; // -1 = unlimited

  @Prop({ type: [String], default: [] })
  features: string[]; // danh sách tính năng đi kèm gói
}

export const PackageItemSchema = SchemaFactory.createForClass(PackageItem);
@Schema({ _id: false })
export class PostStats {
  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  orders: number;

  @Prop({ default: 0 })
  completedOrders: number;

  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: 0 })
  favorites: number; // số người đã lưu (bookmark)
}

export const PostStatsSchema = SchemaFactory.createForClass(PostStats);

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  // ── Thông tin cơ bản ────────────────────────
  @Prop({ required: true, trim: true, maxlength: 80 })
  title: string;

  @Prop({ required: true, trim: true, maxlength: 1200 })
  description: string;

  @Prop({ required: true, index: true })
  sellerId: string; // ref đến User._id -> lưu type string -> microservice architecture

  // ── Phân loại ────────────────────────────────
  @Prop({ required: true, trim: true })
  category: string; // e.g. "Programming & Tech"

  @Prop({ name: 'sub_category', trim: true })
  subCategory?: string; // e.g. "Web Development"

  @Prop({ type: [String], default: [], maxlength: 5 })
  tags: string[]; // tối đa 5 tag / keyword

  // ── Gói giá ──────────────────────────────────
  @Prop({
    required: true,
    enum: PricingTypeEnum,
    default: PricingTypeEnum.SINGLE,
  })
  pricingType: PricingTypeEnum;

  /**
   * SINGLE  → packages[0] là gói duy nhất
   * TIERED  → packages[0]=Basic, [1]=Standard, [2]=Premium
   */
  @Prop({
    type: [PackageItemSchema],
    required: true,
    validate: (v: PackageItem[]) => v.length >= 1 && v.length <= 3,
  })
  packages: PackageItem[];

  // ── Thư viện media ────────────────────────────
  @Prop({
    type: [GalleryItemSchema],
    default: [],
    validate: (v: GalleryItem[]) => v.length <= 5,
  })
  gallery: GalleryItem[];

  // ── Trạng thái & hiển thị ─────────────────────
  @Prop({
    required: true,
    enum: PostStatusEnum,
    default: PostStatusEnum.DRAFT,
    index: true,
  })
  status: PostStatusEnum;

  @Prop({ default: false })
  isFeatured: boolean;

  // ── Thống kê ──────────────────────────────────
  @Prop({ type: PostStatsSchema, default: () => ({}) })
  stats: PostStats;

  // ── Metadata bổ sung ──────────────────────────
  @Prop({ trim: true })
  portfolioUrl?: string; // link portfolio ngoài

  @Prop({ type: [String], default: [] })
  languages: string[]; // ngôn ngữ seller có thể làm việc

  // timestamps (createdAt, updatedAt) tự sinh bởi { timestamps: true }
}

export const PostSchema = SchemaFactory.createForClass(Post);

// ─────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────

PostSchema.index({ title: 'text', description: 'text', tags: 'text' }); // full-text search
PostSchema.index({ category: 1, subCategory: 1 });
PostSchema.index({ 'stats.averageRating': -1 });
PostSchema.index({ createdAt: -1 });
