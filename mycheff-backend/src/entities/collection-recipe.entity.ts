import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RecipeCollection } from './recipe-collection.entity';
import { Recipe } from './recipe.entity';

@Entity('collection_recipes', { schema: 'mycheff' })
@Index(['collectionId', 'recipeId'], { unique: true })
export class CollectionRecipe {
  @ApiProperty({ description: 'Collection recipe ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Collection ID' })
  @Column({ name: 'collection_id', type: 'uuid' })
  collectionId: string;

  @ApiProperty({ description: 'Recipe ID' })
  @Column({ name: 'recipe_id', type: 'uuid' })
  recipeId: string;

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
  @ManyToOne(() => RecipeCollection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'collection_id' })
  collection: RecipeCollection;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
} 