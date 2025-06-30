import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, ManyToMany, JoinColumn, JoinTable, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Category } from './category.entity';
import { RecipeTranslation } from './recipe-translation.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { UserFavorite } from './user-favorite.entity';
import { RecipeRating } from './recipe-rating.entity';

export enum DifficultyLevel {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3
}

@Entity('recipes', { schema: 'mycheff' })
@Index(['authorId'])
@Index(['difficultyLevel'])
@Index(['cookingTimeMinutes'])
@Index(['isPremium'])
@Index(['isFeatured'])
@Index(['isPublished'])
@Index(['averageRating'])
export class Recipe {
  @ApiProperty({ description: 'Recipe ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Author ID' })
  @Column({ name: 'author_id', type: 'uuid', nullable: true })
  authorId: string;

  @ApiProperty({ description: 'Cooking time in minutes', example: 30 })
  @Column({ name: 'cooking_time_minutes' })
  cookingTimeMinutes: number;

  @ApiProperty({ description: 'Preparation time in minutes', example: 15 })
  @Column({ name: 'prep_time_minutes', nullable: true })
  prepTimeMinutes: number;

  @ApiProperty({ description: 'Difficulty level', enum: DifficultyLevel })
  @Column({ name: 'difficulty_level', type: 'smallint', nullable: true })
  difficultyLevel: DifficultyLevel;

  @ApiProperty({ description: 'Serving size', example: 4 })
  @Column({ name: 'serving_size', type: 'smallint', default: 4 })
  servingSize: number;

  @ApiProperty({ description: 'Whether recipe is premium content' })
  @Column({ name: 'is_premium', default: false })
  isPremium: boolean;

  @ApiProperty({ description: 'Whether recipe is featured' })
  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Whether recipe is published' })
  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @ApiProperty({ description: 'View count' })
  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @ApiProperty({ description: 'Average rating' })
  @Column({ name: 'average_rating', type: 'numeric', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @ApiProperty({ description: 'Rating count' })
  @Column({ name: 'rating_count', default: 0 })
  ratingCount: number;

  @ApiProperty({ description: 'Primary image URL' })
  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToMany(() => Category, category => category.recipes)
  @JoinTable({
    name: 'recipe_categories',
    joinColumn: { name: 'recipe_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: Category[];

  @OneToMany(() => RecipeTranslation, translation => translation.recipe, { cascade: true })
  translations: RecipeTranslation[];

  @OneToMany(() => RecipeIngredient, ingredient => ingredient.recipe, { cascade: true })
  ingredients: RecipeIngredient[];

  @OneToMany(() => UserFavorite, favorite => favorite.recipe)
  favorites: UserFavorite[];

  @OneToMany(() => RecipeRating, rating => rating.recipe)
  ratings: RecipeRating[];

  @OneToOne('RecipeDetails', 'recipe', { cascade: true })
  details: any;

  @OneToMany('RecipeMedia', 'recipe', { cascade: true })
  media: any[];

  @OneToMany('CalorieEntry', 'recipe')
  calorieEntries: any[];

  @OneToMany('CollectionRecipe', 'recipe')
  collectionRecipes: any[];

  // Compatibility properties for admin panel
  get title(): string {
    return this.translations?.[0]?.title || '';
  }

  set title(value: string) {
    // This will be handled by translation entities
  }

  get description(): string {
    return this.translations?.[0]?.description || '';
  }

  set description(value: string) {
    // This will be handled by translation entities
  }

  get slug(): string {
    return `recipe-${this.id}`;
  }

  set slug(value: string) {
    // Do nothing, this is auto-generated
  }

  get categoryId(): string {
    return this.categories?.[0]?.id || '';
  }

  set categoryId(value: string) {
    // Categories are handled through many-to-many relation
  }

  get prepTime(): number {
    return this.prepTimeMinutes || 15;
  }

  set prepTime(value: number) {
    this.prepTimeMinutes = value;
  }

  get cookingTime(): number {
    return this.cookingTimeMinutes;
  }

  set cookingTime(value: number) {
    this.cookingTimeMinutes = value;
  }

  get servings(): number {
    return this.servingSize || 4;
  }

  set servings(value: number) {
    this.servingSize = value;
  }

  get difficulty(): 'easy' | 'medium' | 'hard' {
    switch (this.difficultyLevel) {
      case 1: return 'easy';
      case 2: return 'medium';
      case 3: return 'hard';
      default: return 'medium';
    }
  }

  set difficulty(value: 'easy' | 'medium' | 'hard') {
    switch (value) {
      case 'easy': this.difficultyLevel = 1; break;
      case 'medium': this.difficultyLevel = 2; break;
      case 'hard': this.difficultyLevel = 3; break;
    }
  }

  get isActive(): boolean {
    return this.isPublished;
  }

  set isActive(value: boolean) {
    this.isPublished = value;
  }

  get favoriteCount(): number {
    return this.favorites?.length || 0;
  }

  set favoriteCount(value: number) {
    // Do nothing, favorite count calculated
  }

  get tags(): string[] {
    return [];
  }

  set tags(value: string[]) {
    // Do nothing, tags not stored
  }

  // Nutritional data getters/setters (delegated to RecipeDetails entity)
  get caloriesPerServing(): number {
    return this.details?.calories || 0;
  }

  set caloriesPerServing(value: number) {
    // Will be handled by RecipeDetails entity
  }

  get proteinGrams(): number {
    return this.details?.protein || 0;
  }

  set proteinGrams(value: number) {
    // Will be handled by RecipeDetails entity
  }

  get carbsGrams(): number {
    return this.details?.carbohydrates || 0;
  }

  set carbsGrams(value: number) {
    // Will be handled by RecipeDetails entity
  }

  get fatGrams(): number {
    return this.details?.fat || 0;
  }

  set fatGrams(value: number) {
    // Will be handled by RecipeDetails entity  
  }

  get fiberGrams(): number {
    return this.details?.fiber || 0;
  }

  set fiberGrams(value: number) {
    // Will be handled by RecipeDetails entity
  }
} 