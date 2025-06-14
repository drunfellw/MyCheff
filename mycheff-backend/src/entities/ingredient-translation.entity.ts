import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Ingredient } from './ingredient.entity';
import { Language } from './language.entity';

@Entity('ingredient_translations', { schema: 'mycheff' })
@Index(['ingredientId', 'languageCode'], { unique: true })
export class IngredientTranslation {
  @ApiProperty({ description: 'Translation ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Ingredient ID' })
  @Column({ name: 'ingredient_id', type: 'uuid' })
  ingredientId: string;

  @ApiProperty({ description: 'Language code' })
  @Column({ name: 'language_code', length: 5 })
  languageCode: string;

  @ApiProperty({ description: 'Ingredient name' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Alternative names/aliases' })
  @Column({ type: 'text', array: true, nullable: true })
  aliases: string[];

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Ingredient, ingredient => ingredient.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_code' })
  language: Language;
} 