import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { User } from '../../../entities/user.entity';
import { UserIngredient } from '../../../entities/user-ingredient.entity';
import { UserFavorite } from '../../../entities/user-favorite.entity';
import { Ingredient } from '../../../entities/ingredient.entity';
import { Recipe } from '../../../entities/recipe.entity';
import { UpdateUserDto, ChangePasswordDto, UserResponseDto } from '../dto/user.dto';
import { PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserIngredient)
    private readonly userIngredientRepository: Repository<UserIngredient>,
    @InjectRepository(UserFavorite)
    private readonly userFavoriteRepository: Repository<UserFavorite>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcryptjs.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcryptjs.hash(newPassword, saltRounds);

    user.passwordHash = newPasswordHash;
    await this.userRepository.save(user);
  }

  async getUserIngredients(userId: string): Promise<any[]> {
    const ingredients = await this.userIngredientRepository
      .createQueryBuilder('userIngredient')
      .leftJoinAndSelect('userIngredient.ingredient', 'ingredient')
      .leftJoinAndSelect('ingredient.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode: 'tr' })
      .where('userIngredient.userId = :userId', { userId })
      .orderBy('userIngredient.createdAt', 'DESC')
      .getMany();

    return ingredients.map(userIngredient => ({
      ...userIngredient,
      ingredient: {
        ...userIngredient.ingredient,
        name: userIngredient.ingredient.translations[0]?.name || 'Untranslated',
      },
    }));
  }

  async addUserIngredient(userId: string, ingredientData: {
    ingredientId: string;
    quantity: number;
    unit: string;
    expiryDate?: Date;
    notes?: string;
  }): Promise<UserIngredient> {
    // Check if ingredient already exists for user
    const existingIngredient = await this.userIngredientRepository.findOne({
      where: { userId, ingredientId: ingredientData.ingredientId },
    });

    if (existingIngredient) {
      // Update existing ingredient
      existingIngredient.quantity = ingredientData.quantity;
      existingIngredient.unit = ingredientData.unit;
      if (ingredientData.expiryDate !== undefined) {
        existingIngredient.expiryDate = ingredientData.expiryDate;
      }
      if (ingredientData.notes !== undefined) {
        existingIngredient.notes = ingredientData.notes;
      }
      return this.userIngredientRepository.save(existingIngredient);
    }

    // Create new ingredient
    const userIngredient = this.userIngredientRepository.create({
      userId,
      ...ingredientData,
    });

    return this.userIngredientRepository.save(userIngredient);
  }

  async updateUserIngredient(
    userId: string,
    ingredientId: string,
    updateData: {
      quantity?: number;
      unit?: string;
      expiryDate?: Date;
      notes?: string;
    }
  ): Promise<UserIngredient> {
    const userIngredient = await this.userIngredientRepository.findOne({
      where: { userId, ingredientId },
    });

    if (!userIngredient) {
      throw new NotFoundException('User ingredient not found');
    }

    Object.assign(userIngredient, updateData);
    return this.userIngredientRepository.save(userIngredient);
  }

  async removeUserIngredient(userId: string, ingredientId: string): Promise<void> {
    const userIngredient = await this.userIngredientRepository.findOne({
      where: { userId, ingredientId },
    });

    if (!userIngredient) {
      throw new NotFoundException('User ingredient not found');
    }

    await this.userIngredientRepository.remove(userIngredient);
  }

  async getUserFavorites(
    userId: string,
    paginationDto: any,
    languageCode: string = 'tr'
  ): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [favorites, total] = await this.userFavoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.recipe', 'recipe')
      .leftJoinAndSelect('recipe.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .leftJoinAndSelect('recipe.categories', 'category')
      .where('favorite.userId = :userId', { userId })
      .orderBy('favorite.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const formattedFavorites = favorites.map(favorite => ({
      ...favorite.recipe,
      title: favorite.recipe.translations[0]?.title || 'Untranslated',
      description: favorite.recipe.translations[0]?.description || '',
      favoritedAt: favorite.createdAt,
    }));

    const totalPages = Math.ceil(total / limit);

    return new PaginatedResponseDto(
      formattedFavorites,
      {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    );
  }

  async addToFavorites(userId: string, recipeId: string): Promise<{ success: boolean; message: string; }> {
    // Check if already favorited
    const existingFavorite = await this.userFavoriteRepository.findOne({
      where: { userId, recipeId },
    });

    if (existingFavorite) {
      return { success: true, message: 'Recipe already in favorites' };
    }

    const favorite = this.userFavoriteRepository.create({
      userId,
      recipeId,
    });

    await this.userFavoriteRepository.save(favorite);
    return { success: true, message: 'Recipe added to favorites successfully' };
  }

  async removeFromFavorites(userId: string, recipeId: string): Promise<{ success: boolean; message: string; }> {
    const favorite = await this.userFavoriteRepository.findOne({
      where: { userId, recipeId },
    });

    if (!favorite) {
      return { success: false, message: 'Recipe not in favorites' };
    }

    await this.userFavoriteRepository.remove(favorite);
    return { success: true, message: 'Recipe removed from favorites successfully' };
  }

  async removeMultipleFavorites(userId: string, recipeIds: string[]): Promise<{ success: boolean; message: string; removed: number; }> {
    if (!recipeIds || recipeIds.length === 0) {
      return { success: false, message: 'No recipe IDs provided', removed: 0 };
    }

    const favorites = await this.userFavoriteRepository.find({
      where: { 
        userId, 
        recipeId: In(recipeIds)
      },
    });

    if (favorites.length === 0) {
      return { success: false, message: 'No matching favorites found', removed: 0 };
    }

    await this.userFavoriteRepository.remove(favorites);
    return { 
      success: true, 
      message: `${favorites.length} recipe(s) removed from favorites successfully`,
      removed: favorites.length
    };
  }

  async isFavorite(userId: string, recipeId: string): Promise<boolean> {
    const favorite = await this.userFavoriteRepository.findOne({
      where: { userId, recipeId },
    });

    return !!favorite;
  }

  // Admin method - get all users
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });

    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      preferredLanguageCode: user.preferredLanguageCode,
      isPremium: user.isPremium,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    }));
  }
} 