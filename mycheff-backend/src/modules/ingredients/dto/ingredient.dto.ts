import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IngredientTranslationDto {
  @ApiProperty({ description: 'Language code', example: 'tr' })
  @IsString()
  languageCode: string;

  @ApiProperty({ description: 'Ingredient name', example: 'Domates' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Ingredient description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateIngredientDto {
  @ApiProperty({ description: 'Ingredient slug', example: 'tomato' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Ingredient image URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Default unit', example: 'pieces' })
  @IsString()
  defaultUnit: string;

  @ApiProperty({ description: 'Calories per 100g', required: false })
  @IsOptional()
  @IsNumber()
  caloriesPer100g?: number;

  @ApiProperty({ description: 'Translations', type: [IngredientTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientTranslationDto)
  translations: IngredientTranslationDto[];
}

export class UpdateIngredientDto {
  @ApiProperty({ description: 'Ingredient slug', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'Ingredient image URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Default unit', required: false })
  @IsOptional()
  @IsString()
  defaultUnit?: string;

  @ApiProperty({ description: 'Calories per 100g', required: false })
  @IsOptional()
  @IsNumber()
  caloriesPer100g?: number;

  @ApiProperty({ description: 'Whether ingredient is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Translations', type: [IngredientTranslationDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientTranslationDto)
  translations?: IngredientTranslationDto[];
}

export class IngredientResponseDto {
  @ApiProperty({ description: 'Ingredient ID' })
  id: string;

  @ApiProperty({ description: 'Ingredient slug' })
  slug: string;

  @ApiProperty({ description: 'Ingredient name' })
  name: string;

  @ApiProperty({ description: 'Ingredient description' })
  description?: string;

  @ApiProperty({ description: 'Ingredient image URL' })
  imageUrl?: string;

  @ApiProperty({ description: 'Default unit' })
  defaultUnit: string;

  @ApiProperty({ description: 'Calories per 100g' })
  caloriesPer100g?: number;

  @ApiProperty({ description: 'Whether ingredient is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
} 