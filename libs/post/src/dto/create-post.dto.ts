import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreatePackageDto } from './create-package.dto';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  FAQ?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  packages: CreatePackageDto[];
}
