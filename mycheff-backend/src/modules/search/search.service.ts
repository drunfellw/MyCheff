import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import { Recipe } from '../../entities/recipe.entity';
import { RecipeTranslation } from '../../entities/recipe-translation.entity';
import { Ingredient } from '../../entities/ingredient.entity';
import { IngredientTranslation } from '../../entities/ingredient-translation.entity';
import { Category } from '../../entities/category.entity';
import { CategoryTranslation } from '../../entities/category-translation.entity';

export interface SearchFilters {
  categoryIds?: string[];
  ingredientIds?: string[];
  maxCookingTime?: number;
  difficultyLevel?: number;
  isPremium?: boolean;
  attributes?: any;
}

export interface SearchParams {
  query?: string;
  filters?: SearchFilters;
  languageCode?: string;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'rating' | 'newest' | 'cookingTime';
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    
    @InjectRepository(RecipeTranslation)
    private recipeTranslationRepository: Repository<RecipeTranslation>,
    
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    
    @InjectRepository(IngredientTranslation)
    private ingredientTranslationRepository: Repository<IngredientTranslation>,
    
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    
    @InjectRepository(CategoryTranslation)
    private categoryTranslationRepository: Repository<CategoryTranslation>,
    
    // @Inject(CACHE_MANAGER)
    // private cacheManager: Cache,
  ) {}

  async searchRecipes(params: SearchParams) {
    const {
      query = '',
      filters = {},
      languageCode = 'tr',
      page = 1,
      limit = 20,
      sortBy = 'relevance'
    } = params;

    // const cacheKey = `search:${JSON.stringify(params)}`;
    // const cached = await this.cacheManager.get(cacheKey);
    // if (cached) return cached;

    const queryBuilder = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.translations', 'translation', 'translation.languageCode = :lang', { lang: languageCode })
      .leftJoinAndSelect('recipe.media', 'media', 'media.sortOrder = 0') // Primary media
      .leftJoinAndSelect('recipe.categories', 'recipeCategories')
      .leftJoinAndSelect('recipeCategories.category', 'category')
      .leftJoinAndSelect('category.translations', 'categoryTranslation', 'categoryTranslation.languageCode = :lang')
      .where('recipe.isPublished = true');

    // Text search
    if (query) {
      queryBuilder.andWhere(`
        (translation.title ILIKE :query 
         OR translation.description ILIKE :query 
         OR translation.instructions ILIKE :query)
      `, { query: `%${query}%` });
    }

    // Category filter
    if (filters.categoryIds?.length) {
      queryBuilder.andWhere('category.id IN (:...categoryIds)', { 
        categoryIds: filters.categoryIds 
      });
    }

    // Cooking time filter
    if (filters.maxCookingTime) {
      queryBuilder.andWhere('recipe.cookingTimeMinutes <= :maxTime', { 
        maxTime: filters.maxCookingTime 
      });
    }

    // Difficulty filter
    if (filters.difficultyLevel) {
      queryBuilder.andWhere('recipe.difficultyLevel = :difficulty', { 
        difficulty: filters.difficultyLevel 
      });
    }

    // Premium filter
    if (filters.isPremium !== undefined) {
      queryBuilder.andWhere('recipe.isPremium = :isPremium', { 
        isPremium: filters.isPremium 
      });
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        queryBuilder.orderBy('recipe.averageRating', 'DESC');
        break;
      case 'newest':
        queryBuilder.orderBy('recipe.createdAt', 'DESC');
        break;
      case 'cookingTime':
        queryBuilder.orderBy('recipe.cookingTimeMinutes', 'ASC');
        break;
      default:
        queryBuilder.orderBy('recipe.isFeatured', 'DESC');
        queryBuilder.addOrderBy('recipe.averageRating', 'DESC');
    }

    const [recipes, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const result = {
      recipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // await this.cacheManager.set(cacheKey, result, 5 * 60 * 1000); // 5 min cache
    return result;
  }

  async searchIngredients(query: string, languageCode = 'tr', limit = 10) {
    // const cacheKey = `ingredient_search:${query}:${languageCode}:${limit}`;
    // const cached = await this.cacheManager.get(cacheKey);
    // if (cached) return cached;

    const ingredients = await this.ingredientRepository
      .createQueryBuilder('ingredient')
      .leftJoinAndSelect('ingredient.translations', 'translation', 'translation.languageCode = :lang', { lang: languageCode })
      .where('translation.name ILIKE :query', { query: `%${query}%` })
      .orWhere('translation.aliases @> :aliases', { aliases: JSON.stringify([query]) })
      .orderBy('LENGTH(translation.name)', 'ASC')
      .limit(limit)
      .getMany();

    // await this.cacheManager.set(cacheKey, ingredients, 10 * 60 * 1000);
    return ingredients;
  }

  async searchCategories(query: string, languageCode = 'tr', limit = 10) {
    // const cacheKey = `category_search:${query}:${languageCode}:${limit}`;
    // const cached = await this.cacheManager.get(cacheKey);
    // if (cached) return cached;

    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation', 'translation.languageCode = :lang', { lang: languageCode })
      .where('translation.name ILIKE :query', { query: `%${query}%` })
      .andWhere('category.isActive = true')
      .orderBy('category.sortOrder', 'ASC')
      .limit(limit)
      .getMany();

    // await this.cacheManager.set(cacheKey, categories, 10 * 60 * 1000);
    return categories;
  }

  async getSearchSuggestions(query: string, languageCode = 'tr') {
    const [recipes, ingredients, categories] = await Promise.all([
      this.searchRecipes({ query, languageCode, limit: 3 }),
      this.searchIngredients(query, languageCode, 3),
      this.searchCategories(query, languageCode, 3),
    ]);

    return {
      recipes: recipes.recipes,
      ingredients,
      categories,
    };
  }
} 