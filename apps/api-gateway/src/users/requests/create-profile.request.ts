import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileRequest {
  @ApiProperty()
  avatar: string;

  @ApiProperty()
  mySkill: string;

  @ApiProperty()
  occupation: string;

  @ApiProperty()
  level: string;
}
