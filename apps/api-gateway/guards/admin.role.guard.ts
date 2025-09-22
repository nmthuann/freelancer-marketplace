import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'y/user/enums/role.enum';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //  get context in reflector
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    //  check the request is public
    if (isPublic) return true;
    else {
      const request = context.switchToHttp().getRequest();
      const payload = request['user']; // Lấy thông tin người dùng từ request object

      // Kiểm tra và xử lý vai trò của người dùng
      //const decode_token = this.jwtService.decode(token);
      console.log(payload['role']);
      if (payload['role'] != Role.Admin) {
        //  Hoặc trả về false nếu không đủ quyền truy cập
        throw new ForbiddenException('Access denied - You are not Admin');
      }
      request['email'] = payload['email'];
      return true;
    }
  }
}
