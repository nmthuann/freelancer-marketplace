import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

// Đánh giá của buyer sau khi order COMPLETED.
// Nằm trong DB của post-service (đánh giá gắn với gig).
// Mọi ref sang service khác đều là ID dạng string — KHÔNG FK/populate.
@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, index: true })
  postId: string; // ref Post (cùng DB, nhưng vẫn lưu string cho đồng nhất)

  @Prop({ required: true, unique: true })
  orderId: string; // ref Order (order-service) — 1 order chỉ review 1 lần

  @Prop({ required: true, index: true })
  buyerId: string; // ref User (user-service)

  @Prop({ required: true })
  sellerId: string; // ref User (user-service)

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, trim: true, maxlength: 1000 })
  comment: string;

  @Prop({ default: null, trim: true })
  sellerReply: string | null; // seller phản hồi lại review
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ postId: 1, createdAt: -1 });
