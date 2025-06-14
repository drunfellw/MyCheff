import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Full name', example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ description: 'User bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Profile image URL', required: false })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @ApiProperty({ description: 'Preferred language code', example: 'tr', required: false })
  @IsOptional()
  @IsString()
  preferredLanguageCode?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'Full name' })
  fullName?: string;

  @ApiProperty({ description: 'Profile image URL' })
  profileImageUrl?: string;

  @ApiProperty({ description: 'User bio' })
  bio?: string;

  @ApiProperty({ description: 'Preferred language code' })
  preferredLanguageCode: string;

  @ApiProperty({ description: 'Whether user has premium subscription' })
  isPremium: boolean;

  @ApiProperty({ description: 'Whether user is verified' })
  isVerified: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last login date' })
  lastLoginAt?: Date;
} 