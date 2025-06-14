import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IngredientTranslation } from './ingredient-translation.entity';
import { IngredientCategory } from './ingredient-category.entity';
import { Unit } from './unit.entity';

@Entity('ingredients', { schema: 'mycheff' })
export class Ingredient {
  @ApiProperty({ description: 'Ingredient ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Default unit of measurement' })
  @Column({ name: 'default_unit', length: 20 })
  defaultUnit: string;

  @ApiProperty({ description: 'URL-friendly slug' })
  @Column({ length: 50, nullable: true })
  slug: string;

  @ApiProperty({ description: 'Image URL' })
  @Column({ length: 255, nullable: true })
  image: string;

  @ApiProperty({ description: 'Nutritional info per 100g as JSONB' })
  @Column({ name: 'nutritional_info', type: 'jsonb', nullable: true })
  nutritionalInfo: any;

  @ApiProperty({ description: 'Whether this ingredient is active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => IngredientTranslation, translation => translation.ingredient, { cascade: true })
  translations: IngredientTranslation[];

  @ManyToOne(() => IngredientCategory, categoryEntity => categoryEntity.ingredients)
  @JoinColumn({ name: 'category_id' })
  category: IngredientCategory;

  @ManyToOne(() => Unit, unitEntity => unitEntity)
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  // Virtual properties for compatibility
  get name(): string {
    return this.translations?.[0]?.name || '';
  }

  set name(value: string) {
    // This will be handled by translation entities
  }

  get description(): string {
    return '';
  }

  set description(value: string) {
    // Description not stored separately
  }

  // Nutritional data getters (per 100g)
  get calories(): number {
    return this.nutritionalInfo?.calories || 0;
  }

  set calories(value: number) {
    if (!this.nutritionalInfo) this.nutritionalInfo = {};
    this.nutritionalInfo.calories = value;
  }

  get protein(): number {
    return this.nutritionalInfo?.protein || 0;
  }

  set protein(value: number) {
    if (!this.nutritionalInfo) this.nutritionalInfo = {};
    this.nutritionalInfo.protein = value;
  }

  get carbs(): number {
    return this.nutritionalInfo?.carbohydrates || 0;
  }

  set carbs(value: number) {
    if (!this.nutritionalInfo) this.nutritionalInfo = {};
    this.nutritionalInfo.carbohydrates = value;
  }

  get fat(): number {
    return this.nutritionalInfo?.fat || 0;
  }

  set fat(value: number) {
    if (!this.nutritionalInfo) this.nutritionalInfo = {};
    this.nutritionalInfo.fat = value;
  }

  get fiber(): number {
    return this.nutritionalInfo?.fiber || 0;
  }

  set fiber(value: number) {
    if (!this.nutritionalInfo) this.nutritionalInfo = {};
    this.nutritionalInfo.fiber = value;
  }
} 