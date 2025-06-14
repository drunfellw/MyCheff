import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IngredientCategoryTranslation } from './ingredient-category-translation.entity';
import { Ingredient } from './ingredient.entity';

@Entity('ingredient_categories', { schema: 'mycheff' })
export class IngredientCategory {
  @ApiProperty({ description: 'Category ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Parent category ID for hierarchical structure' })
  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @ApiProperty({ description: 'Icon name for the category' })
  @Column({ length: 50, nullable: true })
  icon: string;

  @ApiProperty({ description: 'Color code for the category' })
  @Column({ length: 7, nullable: true })
  color: string;

  @ApiProperty({ description: 'Sort order for display' })
  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Whether this category is active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => IngredientCategoryTranslation, translation => translation.category, { cascade: true })
  translations: IngredientCategoryTranslation[];

  @OneToMany(() => Ingredient, ingredient => ingredient.category)
  ingredients: Ingredient[];

  @ManyToOne(() => IngredientCategory, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: IngredientCategory;

  @OneToMany(() => IngredientCategory, category => category.parent)
  children: IngredientCategory[];

  // Virtual properties for compatibility
  get name(): string {
    return this.translations?.[0]?.name || '';
  }

  set name(value: string) {
    // This will be handled by translation entities
  }

  get description(): string {
    return this.translations?.[0]?.description || '';
  }

  set description(value: string) {
    // This will be handled by translation entities
  }
} 