import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';
import { Language } from './language.entity';

@Entity('category_translations', { schema: 'mycheff' })
@Index(['categoryId', 'languageCode'], { unique: true })
export class CategoryTranslation {
  @ApiProperty({ description: 'Translation ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Category ID' })
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ApiProperty({ description: 'Language code' })
  @Column({ name: 'language_code', length: 5 })
  languageCode: string;

  @ApiProperty({ description: 'Category name' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Category, category => category.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_code' })
  language: Language;
} 