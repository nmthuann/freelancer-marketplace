import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserRequest } from '../src/users/requests/create-user.request';

@Injectable()
export class CreateUserPipeValidator implements PipeTransform {
  transform(value: CreateUserRequest) {
    if (!value.firstName) {
      throw new BadRequestException('Missing firstName');
    }

    if (value.phone.length < 9) {
      throw new BadRequestException('Phone must be at least 9 characters');
    }

    // Return the validated object
    return value;
  }
}
