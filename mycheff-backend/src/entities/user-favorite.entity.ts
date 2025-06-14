import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, Index, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Recipe } from './recipe.entity';

@Entity('favorite_recipes', { schema: 'mycheff' })
@Index(['userId', 'recipeId'], { unique: true })
export class UserFavorite {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid') 
  recipeId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
} 