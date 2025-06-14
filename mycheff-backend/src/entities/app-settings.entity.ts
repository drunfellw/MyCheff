import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum ValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json'
}

@Entity('app_settings', { schema: 'mycheff' })
@Index(['key'], { unique: true })
export class AppSettings {
  @ApiProperty({ description: 'Setting ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Setting key' })
  @Column({ unique: true })
  key: string;

  @ApiProperty({ description: 'Setting value' })
  @Column({ type: 'text' })
  value: string;

  @ApiProperty({ description: 'Value type', enum: ValueType })
  @Column({ name: 'value_type', default: ValueType.STRING })
  valueType: ValueType;

  @ApiProperty({ description: 'Setting description' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Whether setting is active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper methods to get typed values
  get stringValue(): string {
    return this.value;
  }

  get numberValue(): number {
    return parseFloat(this.value) || 0;
  }

  get booleanValue(): boolean {
    return this.value === 'true' || this.value === '1';
  }

  get jsonValue(): any {
    try {
      return JSON.parse(this.value);
    } catch {
      return null;
    }
  }

  // Helper method to set typed values
  setTypedValue(value: any, type: ValueType = ValueType.STRING): void {
    this.valueType = type;
    switch (type) {
      case ValueType.STRING:
        this.value = String(value);
        break;
      case ValueType.NUMBER:
        this.value = String(value);
        break;
      case ValueType.BOOLEAN:
        this.value = value ? 'true' : 'false';
        break;
      case ValueType.JSON:
        this.value = JSON.stringify(value);
        break;
      default:
        this.value = String(value);
    }
  }
} 