import { IsEmail, IsNotEmpty } from 'class-validator';

export class AccountRequest {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  toString() {
    return JSON.stringify({
      email: this.email,
      password: this.password,
    });
  }
}
