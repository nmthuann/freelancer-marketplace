import { Request } from 'express';

// Request đã qua JwtAuthGuard / interceptor — có thông tin user đính kèm.
export interface UserRequest extends Request {
  email?: string;
  userId?: string;
  user?: { userId: string; email: string };
}
