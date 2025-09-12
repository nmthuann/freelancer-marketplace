import { ProfileService } from '@app/profile';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateProfileUserResponse } from './responses/create-profile-user.response';

// working with DTO
@Controller('profiles')
export class ProfileUserController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  createProfileUser(@Body() profileDto: ProfileUserDto) {
    const email = '';
    return this.profileService.createInformation(email, profileDto);
  }

  @Put('update/:id')
  async updateProfileUserById(
    @Param('id') id: number,
    @Body() profileDto: ProfileUserDto,
  ): Promise<ProfileUserDto> {
    return this.profileService.updateProfileUserById(id, profileDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfileUserById(@Param('id') id: number): Promise<void> {
    console.log(this.profileService.deleteProfileUserById(id));
  }

  @Get(':id')
  async getProfileUserById(
    @Param('id') id: number,
  ): Promise<CreateProfileUserResponse> {
    return await this.profileService.getProfileById(id);
  }

  @Get('')
  async getProfiles() {
    return await this.profileService.getProfiles();
  }
}
