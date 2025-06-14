import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryTranslationDto {
  @ApiProperty({ description: 'Language code', example: 'tr' })
  @IsString()
  languageCode: string;

  @ApiProperty({ description: 'Category name', example: 'Ana Yemekler' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'Category description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category slug', example: 'main-dishes' })
  @IsString()
  @MinLength(1)
  slug: string;

  @ApiProperty({ description: 'Category icon', example: 'utensils', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Category color', example: '#FF6B6B', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ description: 'Sort order', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ description: 'Category translations', type: [CategoryTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  translations: CategoryTranslationDto[];
}

export class UpdateCategoryDto {
  @ApiProperty({ description: 'Category slug', example: 'main-dishes', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  slug?: string;

  @ApiProperty({ description: 'Category icon', example: 'utensils', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Category color', example: '#FF6B6B', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ description: 'Whether category is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Sort order', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ description: 'Category translations', type: [CategoryTranslationDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  translations?: CategoryTranslationDto[];
}

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category ID' })
  id: string;

  @ApiProperty({ description: 'Category slug' })
  slug: string;

  @ApiProperty({ description: 'Category name (translated)' })
  name: string;

  @ApiProperty({ description: 'Category description (translated)' })
  description?: string;

  @ApiProperty({ description: 'Category icon' })
  icon?: string;

  @ApiProperty({ description: 'Category color' })
  color?: string;

  @ApiProperty({ description: 'Recipe count' })
  recipeCount: number;

  @ApiProperty({ description: 'Whether category is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Sort order' })
  sortOrder: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
} 