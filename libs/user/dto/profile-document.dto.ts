import { IsNotEmpty } from 'class-validator';
import { CreateProfileDetailDto } from './create-profile-detail.dto';

export class ProfileDocumentDto {
  // @IsEmail()
  // email: string;

  @IsNotEmpty()
  first_name: string;

  last_name: string;

  gender: string;

  @IsNotEmpty()
  birthday: Date;

  address: string;

  @IsNotEmpty()
  phone: string;

  education: string;

  profileDetail: CreateProfileDetailDto;
}
