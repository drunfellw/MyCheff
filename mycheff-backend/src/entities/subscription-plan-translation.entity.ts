import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Language } from './language.entity';

@Entity('subscription_plan_translations', { schema: 'mycheff' })
@Index(['planId', 'languageCode'], { unique: true })
export class SubscriptionPlanTranslation {
  @ApiProperty({ description: 'Translation ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Plan ID' })
  @Column({ name: 'plan_id', type: 'uuid' })
  planId: string;

  @ApiProperty({ description: 'Language code' })
  @Column({ name: 'language_code' })
  languageCode: string;

  @ApiProperty({ description: 'Plan name in this language' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Plan description in this language' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => SubscriptionPlan, plan => plan.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_code', referencedColumnName: 'code' })
  language: Language;
} 