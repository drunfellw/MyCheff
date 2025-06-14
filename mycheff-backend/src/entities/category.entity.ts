import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryTranslation } from './category-translation.entity';
import { Recipe } from './recipe.entity';

@Entity('categories', { schema: 'mycheff' })
export class Category {
  @ApiProperty({ description: 'Category ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Icon code' })
  @Column({ length: 50, nullable: true })
  icon: string;

  @ApiProperty({ description: 'Color code (#FF0000)' })
  @Column({ length: 7, nullable: true })
  color: string;

  @ApiProperty({ description: 'Sort order' })
  @Column({ name: 'sort_order', type: 'integer', default: 0 })
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
  @OneToMany(() => CategoryTranslation, translation => translation.category, { cascade: true })
  translations: CategoryTranslation[];

  @ManyToMany(() => Recipe, recipe => recipe.categories)
  recipes: Recipe[];

  // Virtual properties for compatibility with admin panel
  get name(): string {
    // Will return the name from translations for current language
    return this.translations?.[0]?.name || '';
  }

  set name(value: string) {
    // This will be handled by translation entities
  }

  get description(): string {
    return '';
  }

  set description(value: string) {
    // Description is not stored in the current schema
  }

  get slug(): string {
    return `category-${this.id}`;
  }

  set slug(value: string) {
    // Auto-generated from id
  }

  get recipeCount(): number {
    return this.recipes?.length || 0;
  }

  set recipeCount(value: number) {
    // Calculated from recipes relation
  }
} 