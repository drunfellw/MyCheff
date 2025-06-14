import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Recipe } from './recipe.entity';

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack'
}

@Entity('calorie_entries', { schema: 'mycheff' })
@Index(['userId', 'date'])
export class CalorieEntry {
  @ApiProperty({ description: 'Calorie entry ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Recipe ID' })
  @Column({ name: 'recipe_id', type: 'uuid', nullable: true })
  recipeId: string;

  @ApiProperty({ description: 'Entry date' })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ description: 'Meal type', enum: MealType })
  @Column({ name: 'meal_type' })
  mealType: MealType;

  @ApiProperty({ description: 'Calories consumed' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  calories: number;

  @ApiProperty({ description: 'Serving multiplier' })
  @Column({ name: 'serving_multiplier', type: 'numeric', precision: 4, scale: 2, default: 1 })
  servingMultiplier: number;

  @ApiProperty({ description: 'Nutritional data as JSONB' })
  @Column({ name: 'nutritional_data', type: 'jsonb', nullable: true })
  nutritionalData: any;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Recipe, { nullable: true })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
} 