import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderStatusEnum } from '../enums/order-status.enum';

/**
 * SNAPSHOT gói dịch vụ tại thời điểm đặt hàng.
 * Vì order-service KHÔNG chung DB với post-service (không FK/populate được),
 * ta sao chép (denormalize) thông tin gói vào order để giữ nguyên giá & điều
 * khoản kể cả khi seller sửa/xoá gig sau này.
 */
@Schema({ _id: false })
export class PackageSnapshot {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  deliveryDays: number;

  @Prop({ default: 0 })
  revisions: number;

  @Prop({ type: [String], default: [] })
  features: string[];
}

export const PackageSnapshotSchema =
  SchemaFactory.createForClass(PackageSnapshot);

// Mỗi lần seller giao bài
@Schema({ _id: false })
export class Delivery {
  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ type: [String], default: [] })
  attachments: string[]; // URL file bàn giao

  @Prop({ type: Date, default: Date.now })
  deliveredAt: Date;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string; // mã đơn dễ đọc, vd "FM-20260825-0001"

  // ── Tham chiếu cross-service (ID string, KHÔNG FK) ──
  @Prop({ required: true, index: true })
  postId: string; // ref Post (post-service)

  @Prop({ required: true, index: true })
  buyerId: string; // ref User (user-service)

  @Prop({ required: true, index: true })
  sellerId: string; // ref User (user-service)

  // ── Gói đã chọn (snapshot) ──
  @Prop({ required: true, trim: true })
  packageName: string; // "Basic" | "Standard" | "Premium"

  @Prop({ type: PackageSnapshotSchema, required: true })
  package: PackageSnapshot;

  @Prop({ required: true, min: 0 })
  amount: number; // tổng tiền phải trả (= package.price * quantity)

  @Prop({ default: 1, min: 1 })
  quantity: number;

  // ── Trạng thái & tiến trình ──
  @Prop({
    type: String,
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING_PAYMENT,
    index: true,
  })
  status: OrderStatusEnum;

  @Prop({ default: '', trim: true })
  requirements: string; // brief/yêu cầu buyer gửi seller

  @Prop({ type: [DeliverySchema], default: [] })
  deliveries: Delivery[];

  @Prop({ default: 0 })
  revisionsUsed: number;

  @Prop({ type: Date, default: null })
  dueAt: Date | null; // hạn giao = paidAt + deliveryDays

  @Prop({ type: Date, default: null })
  completedAt: Date | null;

  @Prop({ default: null, trim: true })
  cancelReason: string | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ buyerId: 1, createdAt: -1 });
OrderSchema.index({ sellerId: 1, createdAt: -1 });
