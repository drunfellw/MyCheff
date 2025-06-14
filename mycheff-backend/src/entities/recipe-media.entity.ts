import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from './recipe.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

export enum MediaPurpose {
  MAIN = 'main',
  STEP = 'step',
  INGREDIENT = 'ingredient'
}

@Entity('recipe_media', { schema: 'mycheff' })
@Index(['recipeId', 'displayOrder'])
export class RecipeMedia {
  @ApiProperty({ description: 'Recipe media ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Recipe ID' })
  @Column({ name: 'recipe_id', type: 'uuid' })
  recipeId: string;

  @ApiProperty({ description: 'Media type', enum: MediaType })
  @Column({ name: 'media_type' })
  mediaType: MediaType;

  @ApiProperty({ description: 'Media URL' })
  @Column()
  url: string;

  @ApiProperty({ description: 'Whether this is the primary media' })
  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @ApiProperty({ description: 'Display order' })
  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @ApiProperty({ description: 'Sort order' })
  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Original file name' })
  @Column({ name: 'original_name', nullable: true })
  originalName: string;

  @ApiProperty({ description: 'File name on disk' })
  @Column({ name: 'file_name', nullable: true })
  fileName: string;

  @ApiProperty({ description: 'MIME type' })
  @Column({ name: 'mime_type', nullable: true })
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes' })
  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number;

  @ApiProperty({ description: 'File path on disk' })
  @Column({ name: 'file_path', nullable: true })
  filePath: string;

  @ApiProperty({ description: 'Media purpose', enum: MediaPurpose })
  @Column({ name: 'purpose', default: MediaPurpose.MAIN })
  purpose: MediaPurpose;

  @ApiProperty({ description: 'Alt text for accessibility' })
  @Column({ name: 'alt_text', nullable: true })
  altText: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
} 