import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Unit } from './unit.entity';

@Entity('unit_translations', { schema: 'mycheff' })
@Unique(['unit', 'languageCode'])
export class UnitTranslation {
  @ApiProperty({ description: 'Translation ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Language code' })
  @Column({ name: 'language_code', length: 5 })
  languageCode: string;

  @ApiProperty({ description: 'Unit name in this language' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({ description: 'Short name or abbreviation' })
  @Column({ name: 'short_name', length: 10 })
  shortName: string;

  @ApiProperty({ description: 'Plural form of the unit name' })
  @Column({ name: 'plural_name', length: 50, nullable: true })
  pluralName: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Unit, unit => unit.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;
} 