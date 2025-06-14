import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Ingredient } from './ingredient.entity';

@Entity('user_ingredients', { schema: 'mycheff' })
@Index(['userId', 'ingredientId'], { unique: true })
@Index(['userId'])
@Index(['ingredientId'])
export class UserIngredient {
  @ApiProperty({ description: 'User ingredient ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Ingredient ID' })
  @Column({ name: 'ingredient_id', type: 'uuid' })
  ingredientId: string;

  @ApiProperty({ description: 'Quantity available' })
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  quantity: number;

  @ApiProperty({ description: 'Unit of measurement' })
  @Column({ length: 30, nullable: true })
  unit: string;

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

  @ManyToOne(() => Ingredient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  // Virtual properties for compatibility
  get expiryDate(): Date | null {
    return null; // Not stored in current schema
  }

  set expiryDate(value: Date | null) {
    // Not stored in current schema
  }

  get notes(): string {
    return '';
  }

  set notes(value: string) {
    // Not stored in current schema
  }
} 