import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CreatePostInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { body } = request;

    if (!body.post_detail.profile_user) {
      console.log(body.post_detail.profile_user);
      body.post_detail.profile_user = request['email'];
    }
    return next.handle();
  }
}
