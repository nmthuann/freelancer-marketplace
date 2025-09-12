import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { Repository } from 'typeorm';
import { UserInformationEntity } from './entities/user-information.entity';
import { UserProfileEntity } from './entities/user-profile.entity';
import { ProfileDocumentDto } from './dto/profile-document.dto';
import { CreateProfileDetailDto } from './dto/create-profile-detail.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,

    @InjectRepository(UserInformationEntity)
    private readonly informationRepository: Repository<UserInformationEntity>,

    @InjectRepository(UserProfileEntity)
    private readonly profileRepo: Repository<UserProfileEntity>,
  ) {}

  async getProfiles(): Promise<any[]> {
    // placeholder
    return Promise.resolve([]);
  }

  async getProfileByEmail(email: string): Promise<ProfileDocumentDto | null> {
    return Promise.resolve(null);
  }

  async getFreelancerProfileByEmail(
    email: string,
  ): Promise<ProfileDocumentDto | null> {
    return Promise.resolve(null);
  }

  async isCreatedProfile(email: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  async createInformation(
    email: string,
    profileDto: ProfileDocumentDto,
  ): Promise<ProfileDocumentDto | object | null> {
    return Promise.resolve(null);
  }

  async createProfile(
    email: string,
    profileDetailDto: CreateProfileDetailDto,
  ): Promise<ProfileDocumentDto | object | null> {
    return Promise.resolve(null);
  }

  async getFreelancerName(get_user: string): Promise<string> {
    return Promise.resolve('Fail');
  }
}
