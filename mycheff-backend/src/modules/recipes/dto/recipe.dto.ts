import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean, IsUUID, ValidateNested, Min, Max, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { DifficultyLevel } from '../../../entities/recipe.entity';
import { MediaType, MediaPurpose } from '../../../entities/recipe-media.entity';

export class RecipeTranslationDto {
  @ApiProperty({ description: 'Language code', example: 'tr' })
  @IsString()
  @Length(2, 5)
  languageCode: string;

  @ApiProperty({ description: 'Recipe title', example: 'Türk Kahvesi' })
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiPropertyOptional({ description: 'Recipe description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Preparation steps', example: ['Kahveyi ölçün', 'Suyı kaynatın', 'Karıştırın'] })
  @IsArray()
  @IsString({ each: true })
  preparationSteps: string[];
}

export class RecipeIngredientDto {
  @ApiProperty({ description: 'Ingredient ID' })
  @IsUUID()
  ingredientId: string;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ description: 'Unit', example: 'cups' })
  @IsString()
  @Length(1, 20)
  unit: string;

  @ApiPropertyOptional({ description: 'Optional notes for this ingredient' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RecipeMediaDto {
  @ApiProperty({ description: 'Media type', enum: MediaType })
  @IsEnum(MediaType)
  mediaType: MediaType;

  @ApiProperty({ description: 'Media purpose', enum: MediaPurpose })
  @IsEnum(MediaPurpose)
  purpose: MediaPurpose;

  @ApiPropertyOptional({ description: 'Alt text for accessibility' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Media description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Sort order', example: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class NutritionalDataDto {
  @ApiPropertyOptional({ description: 'Calories per serving', example: 250 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @ApiPropertyOptional({ description: 'Protein in grams', example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @ApiPropertyOptional({ description: 'Carbohydrates in grams', example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  carbohydrates?: number;

  @ApiPropertyOptional({ description: 'Fat in grams', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fat?: number;

  @ApiPropertyOptional({ description: 'Fiber in grams', example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fiber?: number;

  @ApiPropertyOptional({ description: 'Sugar in grams', example: 8 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sugar?: number;

  @ApiPropertyOptional({ description: 'Sodium in milligrams', example: 400 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sodium?: number;
}

export class CreateRecipeTranslationDto {
  @ApiProperty({ description: 'Language code', example: 'tr' })
  @IsString()
  languageCode: string;

  @ApiProperty({ description: 'Recipe title', example: 'Menemen' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Recipe description' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Instructions in JSON format' })
  @IsOptional()
  instructions: any;

  @ApiPropertyOptional({ description: 'Recipe notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateRecipeIngredientDto {
  @ApiProperty({ description: 'Ingredient ID' })
  @IsUUID()
  ingredientId: string;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ description: 'Unit', example: 'adet' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Optional ingredient' })
  @IsBoolean()
  @IsOptional()
  isOptional?: boolean;
}

export class CreateRecipeDto {
  @ApiPropertyOptional({ description: 'Author ID' })
  @IsUUID()
  @IsOptional()
  authorId?: string;

  @ApiProperty({ description: 'Cooking time in minutes', example: 30 })
  @IsNumber()
  @Min(1)
  @Max(600)
  cookingTimeMinutes: number;

  @ApiPropertyOptional({ description: 'Difficulty level', enum: DifficultyLevel })
  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficultyLevel?: DifficultyLevel;

  @ApiPropertyOptional({ description: 'Whether recipe is premium content' })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiPropertyOptional({ description: 'Whether recipe is featured' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ description: 'Category IDs', type: [String] })
  @IsArray()
  @IsUUID(4, { each: true })
  categoryIds: string[];

  @ApiProperty({ description: 'Recipe translations', type: [CreateRecipeTranslationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeTranslationDto)
  translations: CreateRecipeTranslationDto[];

  @ApiProperty({ description: 'Recipe ingredients', type: [CreateRecipeIngredientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients: CreateRecipeIngredientDto[];
}

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}

export class RecipeFilterDto {
  @ApiPropertyOptional({ description: 'Search term' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Difficulty level', enum: DifficultyLevel })
  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficultyLevel?: DifficultyLevel;

  @ApiPropertyOptional({ description: 'Maximum cooking time in minutes' })
  @IsNumber()
  @IsOptional()
  maxCookingTime?: number;

  @ApiPropertyOptional({ description: 'Premium content only' })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiPropertyOptional({ description: 'Featured recipes only' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Language code for translations', default: 'tr' })
  @IsString()
  @IsOptional()
  languageCode?: string = 'tr';
}

export class RecipeResponseDto {
  @ApiProperty({ description: 'Recipe ID' })
  id: string;

  @ApiProperty({ description: 'Recipe title' })
  title: string;

  @ApiProperty({ description: 'Recipe description' })
  description: string;

  @ApiProperty({ description: 'Cooking time in minutes' })
  cookingTimeMinutes: number;

  @ApiProperty({ description: 'Difficulty level' })
  difficultyLevel: DifficultyLevel;

  @ApiProperty({ description: 'Whether recipe is premium' })
  isPremium: boolean;

  @ApiProperty({ description: 'Whether recipe is featured' })
  isFeatured: boolean;

  @ApiPropertyOptional({ description: 'Author information' })
  author?: {
    id: string;
    firstName: string;
    lastName: string;
  };

  @ApiProperty({ description: 'Recipe categories' })
  categories: Array<{
    id: string;
    name: string;
  }>;

  @ApiProperty({ description: 'Recipe ingredients' })
  ingredients: Array<{
    id: string;
    ingredient: {
      id: string;
      name: string;
    };
    quantity: number;
    unit: string;
    sortOrder: number;
  }>;

  @ApiProperty({ description: 'Recipe media' })
  media: Array<{
    id: string;
    url: string;
    mediaType: string;
    purpose: string;
    altText: string;
    sortOrder: number;
  }>;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
} 