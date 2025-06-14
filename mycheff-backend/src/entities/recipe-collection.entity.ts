import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('recipe_collections', { schema: 'mycheff' })
@Index(['userId'])
@Index(['isPublic'])
export class RecipeCollection {
  @ApiProperty({ description: 'Collection ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Collection name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Collection description' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Whether collection is public' })
  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @ApiProperty({ description: 'Cover image URL' })
  @Column({ name: 'cover_image', nullable: true })
  coverImage: string;

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
} 