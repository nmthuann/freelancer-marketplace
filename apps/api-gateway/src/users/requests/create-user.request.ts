import { IsNotEmpty } from 'class-validator';
import { CreateProfileRequest } from './create-profile.request';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
  @IsNotEmpty()
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly gender: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly birthday: Date;

  @ApiProperty()
  readonly address: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly education: string;

  @ApiProperty()
  readonly profile: CreateProfileRequest;
}
