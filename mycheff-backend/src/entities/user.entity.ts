import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, IsString, MinLength, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { UserIngredient } from './user-ingredient.entity';
import { UserFavorite } from './user-favorite.entity';
import { RecipeRating } from './recipe-rating.entity';
import { UserSubscription } from './user-subscription.entity';

@Entity('users', { schema: 'mycheff' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  @IsString()
  username: string;

  @Column({ unique: true, length: 100 })
  @IsEmail()
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  @IsString()
  @MinLength(6)
  passwordHash: string;

  @Column({ name: 'preferred_language', length: 5, default: 'tr' })
  preferredLanguage: string;

  @Column({ name: 'profile_image', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Column({ name: 'cooking_skill_level', type: 'smallint', nullable: true })
  @IsOptional()
  cookingSkillLevel?: number;

  @Column({ name: 'dietary_restrictions', type: 'jsonb', nullable: true })
  @IsOptional()
  dietaryRestrictions?: any;

  @Column({ type: 'text', array: true, nullable: true })
  @IsOptional()
  @IsArray()
  allergies?: string[];

  @Column({ name: 'is_active', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ name: 'last_login_at', type: 'timestamp with time zone', nullable: true })
  @IsOptional()
  lastLoginAt?: Date;

  @Column({ name: 'fcm_token', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  fcmToken?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // Computed properties for compatibility
  get password(): string {
    return this.passwordHash;
  }

  set password(value: string) {
    this.passwordHash = value;
  }

  get preferredLanguageCode(): string {
    return this.preferredLanguage;
  }

  set preferredLanguageCode(value: string) {
    this.preferredLanguage = value;
  }

  // Virtual fullName field computed from username (since we don't have firstName/lastName in new schema)
  @Column({ name: 'full_name', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  fullName?: string;

  get firstName(): string {
    return this.fullName?.split(' ')[0] || '';
  }

  set firstName(value: string) {
    const lastName = this.fullName?.split(' ').slice(1).join(' ') || '';
    this.fullName = value ? (lastName ? `${value} ${lastName}` : value) : lastName;
  }

  get lastName(): string {
    return this.fullName?.split(' ').slice(1).join(' ') || '';
  }

  set lastName(value: string) {
    const firstName = this.fullName?.split(' ')[0] || '';
    this.fullName = firstName ? (value ? `${firstName} ${value}` : firstName) : value;
  }

  get isVerified(): boolean {
    return this.isActive;
  }

  set isVerified(value: boolean) {
    this.isActive = value;
  }

  // TODO: Implement premium status check from subscriptions
  get isPremium(): boolean {
    return false; // Will be computed from active subscriptions
  }

  set isPremium(value: boolean) {
    // Read-only computed property
  }

  // Relations
  @OneToMany(() => UserIngredient, (userIngredient) => userIngredient.user)
  ingredients: UserIngredient[];

  @OneToMany(() => UserFavorite, (favorite) => favorite.user)
  favorites: UserFavorite[];

  @OneToMany(() => RecipeRating, (rating) => rating.user)
  ratings: RecipeRating[];

  @OneToMany(() => UserSubscription, (subscription) => subscription.user)
  subscriptions: UserSubscription[];

  // Recipe relation - will be added properly later
  recipes: any[];
} 