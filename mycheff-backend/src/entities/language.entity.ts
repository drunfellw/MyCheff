import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('languages', { schema: 'mycheff' })
export class Language {
  @ApiProperty({ description: 'Language code (primary key)' })
  @PrimaryColumn({ length: 5 })
  code: string;

  @ApiProperty({ description: 'Language name' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({ description: 'Native language name' })
  @Column({ name: 'native_name', length: 50, nullable: true })
  nativeName: string;

  @ApiProperty({ description: 'Whether this language is active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Whether this is the default language' })
  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 