import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('user_subscriptions', { schema: 'mycheff' })
@Index(['userId'])
@Index(['endDate'])
@Index(['userId', 'endDate'])
export class UserSubscription {
  @ApiProperty({ description: 'Subscription ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Plan ID' })
  @Column({ name: 'plan_id', type: 'uuid' })
  planId: string;

  @ApiProperty({ description: 'Subscription start date' })
  @Column({ name: 'start_date', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @ApiProperty({ description: 'Subscription end date' })
  @Column({ name: 'end_date', type: 'timestamptz' })
  endDate: Date;

  @ApiProperty({ description: 'Payment reference' })
  @Column({ name: 'payment_reference', length: 100, nullable: true })
  paymentReference: string;

  @ApiProperty({ description: 'Payment status' })
  @Column({ name: 'payment_status', length: 20, default: 'completed' })
  paymentStatus: string;

  @ApiProperty({ description: 'Whether subscription auto-renews' })
  @Column({ name: 'is_auto_renew', default: false })
  isAutoRenew: boolean;

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

  @ManyToOne(() => SubscriptionPlan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;
} 