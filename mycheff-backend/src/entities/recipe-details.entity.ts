import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from './recipe.entity';

@Entity('recipe_details', { schema: 'mycheff' })
@Index(['recipeId'], { unique: true })
@Index(['nutritionalData'], { spatial: false })
@Index(['attributes'], { spatial: false })
export class RecipeDetails {
  @ApiProperty({ description: 'Recipe details ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Recipe ID' })
  @Column({ name: 'recipe_id', type: 'uuid', unique: true })
  recipeId: string;

  @ApiProperty({ description: 'Nutritional data as JSONB' })
  @Column({ name: 'nutritional_data', type: 'jsonb', nullable: true })
  nutritionalData: any;

  @ApiProperty({ description: 'Recipe attributes as JSONB' })
  @Column({ name: 'attributes', type: 'jsonb', nullable: true })
  attributes: any;

  @ApiProperty({ description: 'Serving size description' })
  @Column({ name: 'serving_size', nullable: true })
  servingSize: string;

  @ApiProperty({ description: 'Estimated cost' })
  @Column({ name: 'estimated_cost', type: 'numeric', precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Recipe)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  // Nutritional data getters/setters
  get calories(): number {
    return this.nutritionalData?.calories || 0;
  }

  set calories(value: number) {
    if (!this.nutritionalData) this.nutritionalData = {};
    this.nutritionalData.calories = value;
  }

  get protein(): number {
    return this.nutritionalData?.protein || 0;
  }

  set protein(value: number) {
    if (!this.nutritionalData) this.nutritionalData = {};
    this.nutritionalData.protein = value;
  }

  get carbohydrates(): number {
    return this.nutritionalData?.carbohydrates || 0;
  }

  set carbohydrates(value: number) {
    if (!this.nutritionalData) this.nutritionalData = {};
    this.nutritionalData.carbohydrates = value;
  }

  get fat(): number {
    return this.nutritionalData?.fat || 0;
  }

  set fat(value: number) {
    if (!this.nutritionalData) this.nutritionalData = {};
    this.nutritionalData.fat = value;
  }

  get fiber(): number {
    return this.nutritionalData?.fiber || 0;
  }

  set fiber(value: number) {
    if (!this.nutritionalData) this.nutritionalData = {};
    this.nutritionalData.fiber = value;
  }

  get sugar(): number {
    return this.nutritionalData?.sugar || 0;
  }

  set sugar(value: number) {
    if (!this.nutritionalData) this.nutritionalData = {};
    this.nutritionalData.sugar = value;
  }

  get sodium(): number {
    return this.nutritionalData?.sodium || 0;
  }

  set sodium(value: number) {
    if (!this.nutritionalData) this.nutritionalData = {};
    this.nutritionalData.sodium = value;
  }
} 