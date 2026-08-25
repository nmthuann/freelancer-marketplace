export enum OrderStatusEnum {
  PENDING_PAYMENT = 'pending_payment', // vừa tạo, chờ thanh toán
  IN_PROGRESS = 'in_progress', // đã thanh toán, seller đang làm
  DELIVERED = 'delivered', // seller đã giao bài, chờ buyer duyệt
  COMPLETED = 'completed', // buyer chấp nhận → xong
  CANCELLED = 'cancelled', // huỷ
  DISPUTED = 'disputed', // tranh chấp
}
