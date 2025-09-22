import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryRequest {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  categoryName: string;

  @ApiProperty({
    description: 'A short description of the category',
    example: 'Category for electronic products and accessories',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @MaxLength(255)
  description: string;
}
