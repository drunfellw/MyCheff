import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

@Entity('push_notifications', { schema: 'mycheff' })
@Index(['status'])
@Index(['userId'])
export class PushNotification {
  @ApiProperty({ description: 'Notification ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @ApiProperty({ description: 'Notification title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Notification body' })
  @Column({ type: 'text' })
  body: string;

  @ApiProperty({ description: 'Additional data as JSONB' })
  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @ApiProperty({ description: 'Notification status', enum: NotificationStatus })
  @Column({ default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @ApiProperty({ description: 'Scheduled send time' })
  @Column({ name: 'scheduled_for', type: 'timestamp with time zone', nullable: true })
  scheduledFor: Date;

  @ApiProperty({ description: 'Actual sent time' })
  @Column({ name: 'sent_at', type: 'timestamp with time zone', nullable: true })
  sentAt: Date;

  @ApiProperty({ description: 'Notification type' })
  @Column({ name: 'notification_type', nullable: true })
  notificationType: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;
} 