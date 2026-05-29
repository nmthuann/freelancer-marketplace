import { PricingTypeEnum } from '../enums/pricing-type.enum';

export class CreatePostDto {
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  tags?: string[];
  pricingType: PricingTypeEnum;
  packages: {
    name: string;
    description: string;
    price: number;
    deliveryDays: number;
    revisions: number;
    features?: string[];
  }[];
  gallery?: {
    url: string;
    type: 'image' | 'video' | 'pdf';
    caption?: string;
    thumbnailUrl?: string;
  }[];
  requirements?: string[];
  portfolioUrl?: string;
  languages?: string[];
}
