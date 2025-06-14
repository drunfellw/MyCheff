import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from './recipe.entity';
import { Language } from './language.entity';

@Entity('recipe_translations', { schema: 'mycheff' })
@Index(['recipeId', 'languageCode'], { unique: true })
export class RecipeTranslation {
  @ApiProperty({ description: 'Translation ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Recipe ID' })
  @Column({ name: 'recipe_id', type: 'uuid' })
  recipeId: string;

  @ApiProperty({ description: 'Language code' })
  @Column({ name: 'language_code', length: 5 })
  languageCode: string;

  @ApiProperty({ description: 'Recipe title' })
  @Column({ length: 100 })
  title: string;

  @ApiProperty({ description: 'Recipe description' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Preparation steps as JSON' })
  @Column({ name: 'preparation_steps', type: 'jsonb' })
  preparationSteps: any;

  @ApiProperty({ description: 'Tips as text array' })
  @Column({ type: 'text', array: true, nullable: true })
  tips: string[];

  @ApiProperty({ description: 'Search vector for full-text search' })
  @Column({ name: 'search_vector', type: 'tsvector', nullable: true })
  searchVector: any;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Recipe, recipe => recipe.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_code' })
  language: Language;
} 