import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IngredientCategory } from './ingredient-category.entity';

@Entity('ingredient_category_translations', { schema: 'mycheff' })
@Unique(['category', 'languageCode'])
export class IngredientCategoryTranslation {
  @ApiProperty({ description: 'Translation ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Language code' })
  @Column({ name: 'language_code', length: 5 })
  languageCode: string;

  @ApiProperty({ description: 'Category name in this language' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({ description: 'Category description in this language' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => IngredientCategory, category => category.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: IngredientCategory;
} 