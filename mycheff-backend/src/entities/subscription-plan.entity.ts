import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('subscription_plans', { schema: 'mycheff' })
export class SubscriptionPlan {
  @ApiProperty({ description: 'Plan ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Plan name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Duration in months' })
  @Column({ name: 'duration_months' })
  durationMonths: number;

  @ApiProperty({ description: 'Price' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Plan description' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Plan features as JSON' })
  @Column({ type: 'jsonb', nullable: true })
  features: any;

  @ApiProperty({ description: 'Whether plan is active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

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
  @OneToMany('SubscriptionPlanTranslation', 'plan', { cascade: true })
  translations: any[];
} 