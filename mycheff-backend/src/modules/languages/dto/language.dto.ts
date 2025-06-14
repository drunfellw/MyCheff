import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNumber, Length } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({ description: 'Language code', example: 'tr' })
  @IsString()
  @Length(2, 10)
  code: string;

  @ApiProperty({ description: 'Language name in English', example: 'Turkish' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: 'Language name in native language', example: 'Türkçe' })
  @IsString()
  @Length(1, 100)
  nativeName: string;

  @ApiPropertyOptional({ description: 'Language flag emoji', example: '🇹🇷' })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  flag?: string;

  @ApiPropertyOptional({ description: 'Sort order for display', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateLanguageDto {
  @ApiPropertyOptional({ description: 'Language name in English' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @ApiPropertyOptional({ description: 'Language name in native language' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nativeName?: string;

  @ApiPropertyOptional({ description: 'Language flag emoji' })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  flag?: string;

  @ApiPropertyOptional({ description: 'Whether this language is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Sort order for display' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class LanguageResponseDto {
  @ApiProperty({ description: 'Language code', example: 'tr' })
  code: string;

  @ApiProperty({ description: 'Language name', example: 'Turkish' })
  name: string;

  @ApiProperty({ description: 'Whether this language is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;
} 