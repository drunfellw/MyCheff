import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UnitTranslation } from './unit-translation.entity';

@Entity('units', { schema: 'mycheff' })
export class Unit {
  @ApiProperty({ description: 'Unit ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Unit code (gr, kg, ml, adet, etc.)' })
  @Column({ length: 10, unique: true })
  code: string;

  @ApiProperty({ description: 'Measurement system (metric, imperial, count)' })
  @Column({ length: 10 })
  system: string;

  @ApiProperty({ description: 'Base unit code for conversions' })
  @Column({ name: 'base_unit_code', length: 10, nullable: true })
  baseUnitCode: string;

  @ApiProperty({ description: 'Conversion factor to base unit' })
  @Column({ name: 'conversion_factor', type: 'decimal', precision: 10, scale: 6, nullable: true })
  conversionFactor: number;

  @ApiProperty({ description: 'Whether this unit is active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => UnitTranslation, translation => translation.unit, { cascade: true })
  translations: UnitTranslation[];

  // Virtual properties for compatibility
  get name(): string {
    return this.translations?.[0]?.name || this.code;
  }

  set name(value: string) {
    // This will be handled by translation entities
  }

  get shortName(): string {
    return this.translations?.[0]?.shortName || this.code;
  }

  set shortName(value: string) {
    // This will be handled by translation entities
  }

  get pluralName(): string {
    return this.translations?.[0]?.pluralName || this.name;
  }

  set pluralName(value: string) {
    // This will be handled by translation entities
  }
} 