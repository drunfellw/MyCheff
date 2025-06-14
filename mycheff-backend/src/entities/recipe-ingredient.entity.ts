import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';

@Entity('recipe_ingredients', { schema: 'mycheff' })
@Index(['recipeId', 'ingredientId'], { unique: true })
@Index(['ingredientId'])
@Index(['recipeId'])
export class RecipeIngredient {
  @ApiProperty({ description: 'Recipe ingredient ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Recipe ID' })
  @Column({ name: 'recipe_id', type: 'uuid' })
  recipeId: string;

  @ApiProperty({ description: 'Ingredient ID' })
  @Column({ name: 'ingredient_id', type: 'uuid' })
  ingredientId: string;

  @ApiProperty({ description: 'Quantity', example: 2.5 })
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  quantity: number;

  @ApiProperty({ description: 'Unit of measurement', example: 'cups' })
  @Column({ length: 30, nullable: true })
  unit: string;

  @ApiProperty({ description: 'Whether ingredient is required' })
  @Column({ name: 'is_required', default: true })
  isRequired: boolean;

  @ApiProperty({ description: 'Sort order' })
  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Recipe, recipe => recipe.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;
} 