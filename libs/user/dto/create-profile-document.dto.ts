import { CreateProfileDetailDto } from './create-profile-detail.dto';

export class CreateProfileDocumentDto {
  email: string;
  first_name: string; //full_name: string;
  last_name: string;
  gender: string;
  birthday: Date;
  address: string;
  phone: string;
  education: string;
  profileDetail: CreateProfileDetailDto;
}
