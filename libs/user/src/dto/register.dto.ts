import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  // handle công khai duy nhất — chỉ chữ thường, số, gạch dưới
  @IsString()
  @MinLength(3)
  @Matches(/^[a-z0-9_]+$/, {
    message: 'username chỉ gồm chữ thường, số và gạch dưới',
  })
  username: string;

  @IsString()
  @MinLength(3)
  fullName: string;

  @IsString()
  @MinLength(6)
  password: string;
}
