import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Recipe } from './recipe.entity';

@Entity('user_activities', { schema: 'mycheff' })
@Index(['userId', 'createdAt'])
@Index(['activityType'])
export class UserActivity {
  @ApiProperty({ description: 'Activity ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Activity type' })
  @Column({ name: 'activity_type', length: 50 })
  activityType: string;

  @ApiProperty({ description: 'Recipe ID', required: false })
  @Column({ name: 'recipe_id', type: 'uuid', nullable: true })
  recipeId?: string;

  @ApiProperty({ description: 'Additional metadata' })
  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @ApiProperty({ description: 'IP address' })
  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress?: string;

  @ApiProperty({ description: 'User agent' })
  @Column({ name: 'user_agent', nullable: true })
  userAgent?: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe?: Recipe;
} 