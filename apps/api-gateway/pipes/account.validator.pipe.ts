import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AccountRequest } from '../src/auth/requests/account.request';

@Injectable()
export class AccountPipeValidator implements PipeTransform {
  transform(value: AccountRequest) {
    if (!value.email) {
      throw new BadRequestException('Missing email');
    }

    if (!value.password) {
      throw new BadRequestException('Missing password');
    }

    if (value.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    // Return the validated object
    return value;
  }
}
