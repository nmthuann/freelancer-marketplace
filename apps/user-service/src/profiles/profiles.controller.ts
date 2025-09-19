// import { ProfileService } from '@app/profile';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('profiles')
export class ProfilesController {
  // constructor(private readonly profileService: ProfileService) {}
  // @MessagePattern('get-user-by-email')
  // async getUserByEmail(data: { email: string }) {
  //   return this.profileService.getProfileByEmail(data.email);
  // }
}
