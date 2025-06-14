import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Recipe } from './recipe.entity';

@Entity('recipe_ratings', { schema: 'mycheff' })
@Index(['userId', 'recipeId'], { unique: true })
@Index(['recipeId'])
@Index(['userId'])
export class RecipeRating {
  @ApiProperty({ description: 'Rating ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Recipe ID' })
  @Column({ name: 'recipe_id', type: 'uuid' })
  recipeId: string;

  @ApiProperty({ description: 'Rating value (1-5)', minimum: 1, maximum: 5 })
  @Column({ type: 'smallint' })
  rating: number;

  @ApiProperty({ description: 'Optional comment' })
  @Column({ type: 'text', nullable: true })
  comment: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Recipe, recipe => recipe.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
} 