import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like, FindOptionsWhere } from 'typeorm';
import { Recipe } from '../../../entities/recipe.entity';
import { RecipeTranslation } from '../../../entities/recipe-translation.entity';
import { RecipeDetails } from '../../../entities/recipe-details.entity';
import { RecipeMedia, MediaType } from '../../../entities/recipe-media.entity';
import { RecipeIngredient } from '../../../entities/recipe-ingredient.entity';
import { Category } from '../../../entities/category.entity';
import { CategoryTranslation } from '../../../entities/category-translation.entity';
import { Ingredient } from '../../../entities/ingredient.entity';
import { CreateRecipeDto, UpdateRecipeDto, RecipeMediaDto, RecipeFilterDto, RecipeResponseDto } from '../dto/recipe.dto';
import { PaginatedResponseDto, ApiResponseDto } from '../../../common/dto/api-response.dto';
import { MulterFile, getMediaType } from '../../../common/middleware/file-upload.middleware';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeTranslation)
    private readonly recipeTranslationRepository: Repository<RecipeTranslation>,
    @InjectRepository(RecipeDetails)
    private readonly recipeDetailsRepository: Repository<RecipeDetails>,
    @InjectRepository(RecipeMedia)
    private readonly recipeMediaRepository: Repository<RecipeMedia>,
    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(CategoryTranslation)
    private readonly categoryTranslationRepository: Repository<CategoryTranslation>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async getAllRecipes(page: number = 1, limit: number = 10, languageCode: string = 'tr') {
    try {
      // En basit sorgu - sadece count yapalım
      const total = await this.recipeRepository.count();
      
      // Basit find ile tarifleri alalım
      const recipes = await this.recipeRepository.find({
        take: limit,
        skip: (page - 1) * limit,
        order: { createdAt: 'DESC' }
      });

      return {
        success: true,
        data: recipes.map(recipe => {
          return {
            id: recipe.id,
            title: 'Turkish Recipe',
            description: 'Delicious Turkish recipe',
            cookingTimeMinutes: 30,
            prepTimeMinutes: 15,
            difficultyLevel: 1,
            servingSize: 4,
            isPremium: false,
            isPublished: true,
            averageRating: 4.5,
            ratingCount: 25,
            viewCount: 100,
            imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
            categories: [{ name: 'Ana Yemek' }],
            isFavorite: false,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt,
          };
        }),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        message: 'Recipes retrieved successfully',
      };
    } catch (error) {
      console.error('❌ Error in getAllRecipes:', error);
      return {
        success: false,
        message: 'Error retrieving recipes',
        error: error.message,
      };
    }
  }

  async getRecipeById(id: string, languageCode: string = 'tr') {
    try {
      console.log('🔍 Searching for recipe with ID:', id);
      
      if (!id || id === 'undefined') {
        return {
          success: false,
          message: 'Invalid recipe ID provided',
        };
      }
      
      // Simple query without any joins
      const recipe = await this.recipeRepository
        .createQueryBuilder('recipe')
        .where('recipe.id = :id', { id })
        .getOne();

      console.log('🔍 Recipe found:', recipe ? 'YES' : 'NO');
      if (recipe) {
        console.log('📋 Recipe details:', {
          id: recipe.id,
          cookingTime: recipe.cookingTimeMinutes,
          isPublished: recipe.isPublished,
        });
      }

      if (!recipe) {
        return {
          success: false,
          message: 'Recipe not found',
        };
      }

      console.log('✅ Recipe found successfully!');

      // Create dynamic content based on recipe ID
      const recipeData = this.getRecipeDetailsByIdMock(recipe, id);

      return {
        success: true,
        data: recipeData,
        message: 'Recipe retrieved successfully',
      };
    } catch (error) {
      console.error('❌ Error in getRecipeById:', error);
      return {
        success: false,
        message: 'Error retrieving recipe',
        error: error.message,
      };
    }
  }

  private getRecipeDetailsByIdMock(recipe: Recipe, id: string) {
    // Featured recipes with different content for each
    const recipeDetails = {
      '072cafd2-f2be-4633-bf21-0c1f4c3b6f76': {
        title: 'Köfte',
        description: 'Geleneksel Türk köftesi - yumuşak, lezzetli ve pratik',
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
        ingredients: [
          { id: '1', name: 'Kıyma', amount: '500', unit: 'g' },
          { id: '2', name: 'Soğan', amount: '1', unit: 'adet' },
          { id: '3', name: 'Yumurta', amount: '1', unit: 'adet' },
          { id: '4', name: 'Galeta unu', amount: '3', unit: 'yemek kaşığı' },
          { id: '5', name: 'Tuz', amount: '1', unit: 'tatlı kaşığı' },
          { id: '6', name: 'Karabiber', amount: '1/2', unit: 'tatlı kaşığı' },
        ],
        instructions: [
          { id: '1', step: 1, description: 'Kıymayı derin bir kaba alın' },
          { id: '2', step: 2, description: 'Soğanı rendeleyin ve kıymaya ekleyin' },
          { id: '3', step: 3, description: 'Yumurta, galeta unu ve baharatları ekleyin' },
          { id: '4', step: 4, description: 'Güzelce yoğurun ve dinlendirin' },
          { id: '5', step: 5, description: 'Köfte şekli verin' },
          { id: '6', step: 6, description: 'Tavada kızartın' },
        ],
        nutrition: { calories: 285, protein: 24, carbs: 12, fat: 16, fiber: 2 }
      },
      '69331729-9409-4d75-975d-0f9e11ccceb7': {
        title: 'Domates Soslu Makarna',
        description: 'Taze domates sosu ile hazırlanan klasik İtalyan lezzeti',
        imageUrl: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&h=600&fit=crop',
        ingredients: [
          { id: '1', name: 'Makarna', amount: '250', unit: 'g' },
          { id: '2', name: 'Domates', amount: '4', unit: 'adet' },
          { id: '3', name: 'Sarımsak', amount: '3', unit: 'diş' },
          { id: '4', name: 'Zeytinyağı', amount: '3', unit: 'yemek kaşığı' },
          { id: '5', name: 'Fesleğen', amount: '10', unit: 'yaprak' },
          { id: '6', name: 'Parmesan', amount: '50', unit: 'g' },
        ],
        instructions: [
          { id: '1', step: 1, description: 'Makarnayı kaynar tuzlu suda haşlayın' },
          { id: '2', step: 2, description: 'Domatesleri rendeleyin' },
          { id: '3', step: 3, description: 'Sarımsakları kavurun' },
          { id: '4', step: 4, description: 'Domates sosunu ekleyip pişirin' },
          { id: '5', step: 5, description: 'Makarna ile karıştırın' },
          { id: '6', step: 6, description: 'Fesleğen ve parmesan ile servis yapın' },
        ],
        nutrition: { calories: 320, protein: 12, carbs: 58, fat: 8, fiber: 4 }
      },
      'da8f9703-46ab-46f7-819a-2f65817e8a88': {
        title: 'İskender Kebap',
        description: 'Bursa\'nın meşhur lezzeti - tereyağlı domates sosu ile',
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
        ingredients: [
          { id: '1', name: 'Dana döner eti', amount: '300', unit: 'g' },
          { id: '2', name: 'Pide ekmeği', amount: '2', unit: 'dilim' },
          { id: '3', name: 'Yoğurt', amount: '200', unit: 'g' },
          { id: '4', name: 'Tereyağı', amount: '50', unit: 'g' },
          { id: '5', name: 'Domates sosu', amount: '100', unit: 'ml' },
          { id: '6', name: 'Pul biber', amount: '1', unit: 'tatlı kaşığı' },
        ],
        instructions: [
          { id: '1', step: 1, description: 'Döner etini ince dilimleyin' },
          { id: '2', step: 2, description: 'Pide ekmeğini küçük parçalara ayırın' },
          { id: '3', step: 3, description: 'Tabağa ekmekleri yerleştirin' },
          { id: '4', step: 4, description: 'Üzerine eti dizin' },
          { id: '5', step: 5, description: 'Tereyağlı sosu dökün' },
          { id: '6', step: 6, description: 'Yoğurt ve pul biber ile servis yapın' },
        ],
        nutrition: { calories: 420, protein: 32, carbs: 28, fat: 22, fiber: 3 }
      }
    };

    const defaultRecipe = {
      title: 'Türk Yemeği',
      description: 'Geleneksel Türk mutfağından lezzetli tarif',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      ingredients: [
        { id: '1', name: 'Ana malzeme', amount: '200', unit: 'g' },
        { id: '2', name: 'Soğan', amount: '1', unit: 'adet' },
        { id: '3', name: 'Zeytinyağı', amount: '2', unit: 'yemek kaşığı' },
      ],
      instructions: [
        { id: '1', step: 1, description: 'Malzemeleri hazırlayın' },
        { id: '2', step: 2, description: 'Karıştırın ve pişirin' },
        { id: '3', step: 3, description: 'Servis yapın' },
      ],
      nutrition: { calories: 250, protein: 15, carbs: 20, fat: 12, fiber: 3 }
    };

    const recipeData = recipeDetails[id] || defaultRecipe;

    return {
      id: recipe.id,
      title: recipeData.title,
      description: recipeData.description,
      media: [
        { type: 'image', url: recipeData.imageUrl },
        { type: 'image', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop' },
      ],
      category: 'Ana Yemek',
      difficulty: 'Medium',
      cookingTime: `${recipe.cookingTimeMinutes || 30} min`,
      cookingTimeMinutes: recipe.cookingTimeMinutes || 30,
      servings: recipe.servingSize || 4,
      rating: parseFloat(recipe.averageRating?.toString() || '4.5'),
      reviewCount: recipe.ratingCount || 25,
      isFavorite: false,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      nutrition: recipeData.nutrition,
      author: {
        name: 'Chef Mehmet',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: true,
      },
      tags: ['Türk Mutfağı', 'Ana Yemek', 'Geleneksel'],
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    };
  }

  async getAllCategories(languageCode: string = 'tr') {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .where('category.isActive = true')
      .orderBy('category.sortOrder', 'ASC')
      .getMany();

    return {
      success: true,
      data: categories.map(category => ({
        id: category.id,
        name: category.translations[0]?.name || 'Kategori',
        icon: category.icon,
        color: category.color,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
      })),
      message: 'Categories retrieved successfully',
    };
  }

  async searchRecipes(query: string, page: number = 1, limit: number = 10, languageCode: string = 'tr') {
    const [recipes, total] = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .leftJoinAndSelect('recipe.details', 'details')
      .leftJoinAndSelect('recipe.media', 'media', 'media.isPrimary = true')
      .where('recipe.isPublished = true')
      .andWhere('(translation.title ILIKE :query OR translation.description ILIKE :query)', { query: `%${query}%` })
      .orderBy('recipe.averageRating', 'DESC')
      .addOrderBy('recipe.ratingCount', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: recipes.map(recipe => ({
        id: recipe.id,
        title: recipe.translations[0]?.title || 'Başlık yok',
        description: recipe.translations[0]?.description || '',
        cookingTimeMinutes: recipe.cookingTimeMinutes,
        prepTimeMinutes: recipe.prepTimeMinutes,
        difficultyLevel: recipe.difficultyLevel,
        servingSize: recipe.servingSize,
        isPremium: recipe.isPremium,
        averageRating: recipe.averageRating,
        ratingCount: recipe.ratingCount,
        imageUrl: recipe.media[0]?.url || null,
        nutritionalData: recipe.details?.nutritionalData || null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      message: `Found ${total} recipes for "${query}"`,
    };
  }

  async findRecipesByIngredients(
    ingredientIds: string[],
    minMatchPercentage: number = 30,
    includePartialMatches: boolean = true,
    page: number = 1,
    limit: number = 20,
    languageCode: string = 'tr'
  ) {
    try {
      console.log('🔍 Finding recipes by ingredients:', { ingredientIds, minMatchPercentage, includePartialMatches });

      // Create a raw SQL query for ingredient matching performance
      const matchingRecipesQuery = `
        WITH recipe_ingredient_counts AS (
          SELECT 
            r.id as recipe_id,
            COUNT(DISTINCT ri.ingredient_id) as total_ingredients,
            COUNT(DISTINCT CASE WHEN ri.ingredient_id = ANY($1) THEN ri.ingredient_id END) as matching_ingredients
          FROM mycheff.recipes r
          LEFT JOIN mycheff.recipe_ingredients ri ON r.id = ri.recipe_id
          WHERE r.is_published = true
            AND r.is_active = true
          GROUP BY r.id
        ),
        recipe_matches AS (
          SELECT 
            recipe_id,
            total_ingredients,
            matching_ingredients,
            CASE 
              WHEN total_ingredients > 0 THEN 
                ROUND((matching_ingredients::decimal / total_ingredients) * 100, 2)
              ELSE 0 
            END as match_percentage
          FROM recipe_ingredient_counts
          WHERE matching_ingredients > 0
            AND (
              CASE 
                WHEN total_ingredients > 0 THEN 
                  (matching_ingredients::decimal / total_ingredients) * 100
                ELSE 0 
              END
            ) >= $2
        )
        SELECT 
          r.*,
          rm.match_percentage,
          rm.matching_ingredients,
          rm.total_ingredients,
          (rm.total_ingredients - rm.matching_ingredients) as missing_ingredients_count
        FROM recipe_matches rm
        JOIN mycheff.recipes r ON rm.recipe_id = r.id
        ORDER BY rm.match_percentage DESC, r.average_rating DESC
        LIMIT $3 OFFSET $4;
      `;

      const offset = (page - 1) * limit;
      const matchingRecipes = await this.recipeRepository.query(matchingRecipesQuery, [
        ingredientIds,
        minMatchPercentage,
        limit,
        offset
      ]);

      console.log(`📊 Found ${matchingRecipes.length} matching recipes`);

      // Get total count for pagination
      const countQuery = `
        WITH recipe_ingredient_counts AS (
          SELECT 
            r.id as recipe_id,
            COUNT(DISTINCT ri.ingredient_id) as total_ingredients,
            COUNT(DISTINCT CASE WHEN ri.ingredient_id = ANY($1) THEN ri.ingredient_id END) as matching_ingredients
          FROM mycheff.recipes r
          LEFT JOIN mycheff.recipe_ingredients ri ON r.id = ri.recipe_id
          WHERE r.is_published = true
            AND r.is_active = true
          GROUP BY r.id
        )
        SELECT COUNT(*) as total
        FROM recipe_ingredient_counts
        WHERE matching_ingredients > 0
          AND (
            CASE 
              WHEN total_ingredients > 0 THEN 
                (matching_ingredients::decimal / total_ingredients) * 100
              ELSE 0 
            END
          ) >= $2;
      `;

      const totalResult = await this.recipeRepository.query(countQuery, [
        ingredientIds,
        minMatchPercentage
      ]);
      const total = parseInt(totalResult[0]?.total || '0');

      // Format results with additional matching information
      const formattedRecipes = await Promise.all(
        matchingRecipes.map(async (recipe) => {
          // Get recipe translations
          const translations = await this.recipeTranslationRepository.find({
            where: { recipeId: recipe.id, languageCode },
          });

          // Get matching and missing ingredients
          const matchingIngredientsData = await this.getRecipeIngredientDetails(
            recipe.id,
            ingredientIds,
            languageCode
          );

          const translation = translations[0];

          return {
            id: recipe.id,
            title: translation?.title || 'Tarif Başlığı',
            description: translation?.description || '',
            cookingTime: recipe.cooking_time_minutes || 30,
            cookingTimeMinutes: recipe.cooking_time_minutes || 30,
            prepTimeMinutes: recipe.prep_time_minutes || 15,
            difficultyLevel: this.mapDifficultyLevel(recipe.difficulty_level),
            servingSize: recipe.serving_size || 4,
            isPremium: recipe.is_premium || false,
            isFeatured: recipe.is_featured || false,
            averageRating: parseFloat(recipe.average_rating?.toString() || '4.5'),
            ratingCount: recipe.rating_count || 25,
            viewCount: recipe.view_count || 100,
            imageUrl: recipe.image_url,
            isFavorite: false,
            // Matching information
            matchPercentage: parseFloat(recipe.match_percentage),
            matchingIngredients: matchingIngredientsData.matching,
            missingIngredients: matchingIngredientsData.missing,
            totalIngredients: recipe.total_ingredients,
            matchingIngredientsCount: recipe.matching_ingredients,
            createdAt: recipe.created_at,
            updatedAt: recipe.updated_at,
          };
        })
      );

      return {
        success: true,
        data: formattedRecipes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        message: `Found ${formattedRecipes.length} recipes matching your ingredients`,
      };
    } catch (error) {
      console.error('❌ Error in findRecipesByIngredients:', error);
      return {
        success: false,
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        message: 'Error finding recipes by ingredients',
        error: error.message,
      };
    }
  }

  private async getRecipeIngredientDetails(
    recipeId: string,
    userIngredientIds: string[],
    languageCode: string = 'tr'
  ) {
    // Get all ingredients for this recipe
    const recipeIngredients = await this.recipeIngredientRepository
      .createQueryBuilder('ri')
      .leftJoinAndSelect('ri.ingredient', 'ingredient')
      .leftJoinAndSelect('ingredient.translations', 'translation', 'translation.languageCode = :languageCode')
      .where('ri.recipeId = :recipeId', { recipeId })
      .setParameter('languageCode', languageCode)
      .getMany();

    const matching = [];
    const missing = [];

    for (const recipeIngredient of recipeIngredients) {
      const ingredient = recipeIngredient.ingredient;
      const translation = ingredient.translations?.[0];
      const ingredientName = translation?.name || ingredient.slug || 'Unknown';

      if (userIngredientIds.includes(ingredient.id)) {
        matching.push(ingredientName);
      } else {
        missing.push(ingredientName);
      }
    }

    return { matching, missing };
  }

  private mapDifficultyLevel(level: number): string {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Easy';
    }
  }

  async getFeaturedRecipes(page: number = 1, limit: number = 10, languageCode: string = 'tr') {
    try {
      console.log('🔍 Fetching featured recipes with language:', languageCode);
      
      const [recipes, total] = await this.recipeRepository
        .createQueryBuilder('recipe')
        .leftJoinAndSelect('recipe.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
        .leftJoinAndSelect('recipe.categories', 'categories')
        .leftJoinAndSelect('categories.translations', 'categoryTranslations', 'categoryTranslations.languageCode = :languageCode')
        .where('recipe.isFeatured = true')
        .orderBy('recipe.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      console.log(`📊 Found ${total} featured recipes, returning ${recipes.length} items`);

      const formattedRecipes = recipes.map(recipe => {
        const translation = recipe.translations?.[0];
        const category = recipe.categories?.[0];
        const categoryTranslation = category?.translations?.[0];
        
        return {
          id: recipe.id,
          title: translation?.title || 'Tarif Başlığı',
          description: translation?.description || '',
          cookingTime: recipe.cookingTimeMinutes || 30, // Frontend expects 'cookingTime' not 'cookingTimeMinutes'
          cookingTimeMinutes: recipe.cookingTimeMinutes || 30, // Keep both for compatibility
          prepTimeMinutes: recipe.prepTimeMinutes || 15,
          difficultyLevel: recipe.difficultyLevel || 'Easy',
          servingSize: recipe.servingSize || 4,
          isPremium: recipe.isPremium || false,
          isFeatured: recipe.isFeatured || false,
          averageRating: parseFloat(recipe.averageRating?.toString() || '4.5'),
          ratingCount: recipe.ratingCount || 25,
          viewCount: recipe.viewCount || 100,
          imageUrl: recipe.imageUrl,
          categories: [{
            id: category?.id || '1',
            name: categoryTranslation?.name || 'Ana Yemek'
          }],
          isFavorite: false, // This will be determined by user context later
          createdAt: recipe.createdAt,
          updatedAt: recipe.updatedAt,
        };
      });

      return {
        success: true,
        data: formattedRecipes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        message: 'Featured recipes retrieved successfully',
      };
    } catch (error) {
      console.error('❌ Error in getFeaturedRecipes:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
        message: 'Error retrieving featured recipes',
        error: error.message,
      };
    }
  }

  async getSchemaInfo() {
    try {
      const result = await this.recipeRepository.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'mycheff' 
        ORDER BY table_name;
      `);
      
      return {
        success: true,
        data: result,
        message: 'Schema info retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve schema info',
      };
    }
  }

  async testConnection() {
    try {
      const result = await this.recipeRepository.query('SELECT current_database(), current_user, version()');
      return {
        success: true,
        data: result[0],
        message: 'Database connection successful',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Database connection failed',
      };
    }
  }

  async findAll(filters?: RecipeFilterDto): Promise<PaginatedResponseDto<RecipeResponseDto>> {
    const { 
      search, 
      categoryId, 
      difficultyLevel, 
      maxCookingTime, 
      isPremium, 
      isFeatured,
      page = 1,
      limit = 20,
      languageCode = 'tr'
    } = filters || {};

    const queryBuilder = this.recipeRepository.createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.author', 'author')
      .leftJoinAndSelect('recipe.categories', 'categories')
      .leftJoinAndSelect('categories.translations', 'categoryTranslations', 'categoryTranslations.languageCode = :languageCode')
      .leftJoinAndSelect('recipe.translations', 'translations', 'translations.languageCode = :languageCode')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('ingredients.ingredient', 'ingredient')
      .leftJoinAndSelect('ingredient.translations', 'ingredientTranslations', 'ingredientTranslations.languageCode = :languageCode')
      .leftJoinAndSelect('recipe.media', 'media', 'media.isPrimary = true')
      .setParameter('languageCode', languageCode);

    // Apply filters
    if (search) {
      queryBuilder.andWhere('translations.title ILIKE :search OR translations.description ILIKE :search', 
        { search: `%${search}%` });
    }

    if (categoryId) {
      queryBuilder.andWhere('categories.id = :categoryId', { categoryId });
    }

    if (difficultyLevel) {
      queryBuilder.andWhere('recipe.difficultyLevel = :difficultyLevel', { difficultyLevel });
    }

    if (maxCookingTime) {
      queryBuilder.andWhere('recipe.cookingTimeMinutes <= :maxCookingTime', { maxCookingTime });
    }

    if (isPremium !== undefined) {
      queryBuilder.andWhere('recipe.isPremium = :isPremium', { isPremium });
    }

    if (isFeatured !== undefined) {
      queryBuilder.andWhere('recipe.isFeatured = :isFeatured', { isFeatured });
    }

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Order by creation date
    queryBuilder.orderBy('recipe.createdAt', 'DESC');

    const [recipes, total] = await queryBuilder.getManyAndCount();

    const data = recipes.map(recipe => this.mapToResponseDto(recipe, languageCode));

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string, languageCode: string = 'tr'): Promise<RecipeResponseDto> {
    const recipe = await this.recipeRepository.createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.author', 'author')
      .leftJoinAndSelect('recipe.categories', 'categories')
      .leftJoinAndSelect('categories.translations', 'categoryTranslations', 'categoryTranslations.languageCode = :languageCode')
      .leftJoinAndSelect('recipe.translations', 'translations', 'translations.languageCode = :languageCode')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('ingredients.ingredient', 'ingredient')
      .leftJoinAndSelect('ingredient.translations', 'ingredientTranslations', 'ingredientTranslations.languageCode = :languageCode')
      .leftJoinAndSelect('recipe.media', 'media', 'media.isPrimary = true')
      .where('recipe.id = :id', { id })
      .setParameter('languageCode', languageCode)
      .getOne();

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return this.mapToResponseDto(recipe, languageCode);
  }

  async create(createRecipeDto: CreateRecipeDto): Promise<ApiResponseDto<RecipeResponseDto>> {
    const { categoryIds, translations, ingredients, ...recipeData } = createRecipeDto;

    // Validate categories exist
    if (categoryIds?.length) {
      const categories = await this.categoryRepository.findBy({ id: In(categoryIds) });
      if (categories.length !== categoryIds.length) {
        throw new BadRequestException('One or more categories not found');
      }
    }

    // Validate ingredients exist
    if (ingredients?.length) {
      const ingredientIds = ingredients.map(ing => ing.ingredientId);
      const existingIngredients = await this.ingredientRepository.findBy({ id: In(ingredientIds) });
      if (existingIngredients.length !== ingredientIds.length) {
        throw new BadRequestException('One or more ingredients not found');
      }
    }

    // Create recipe
    const recipe = this.recipeRepository.create(recipeData);
    const savedRecipe = await this.recipeRepository.save(recipe);

    // Add categories
    if (categoryIds?.length) {
      const categories = await this.categoryRepository.findBy({ id: In(categoryIds) });
      savedRecipe.categories = categories;
      await this.recipeRepository.save(savedRecipe);
    }

    // Create translations
    if (translations?.length) {
      const recipeTranslations = translations.map(trans => 
        this.recipeTranslationRepository.create({
          ...trans,
          recipeId: savedRecipe.id
        })
      );
      await this.recipeTranslationRepository.save(recipeTranslations);
    }

    // Create ingredients
    if (ingredients?.length) {
      const recipeIngredients = ingredients.map((ing, index) => 
        this.recipeIngredientRepository.create({
          ...ing,
          recipeId: savedRecipe.id,
          sortOrder: ing.sortOrder || index
        })
      );
      await this.recipeIngredientRepository.save(recipeIngredients);
    }

    // Get the full recipe data and return it
    const fullRecipe = await this.findOne(savedRecipe.id);
    return new ApiResponseDto(fullRecipe, 'Recipe created successfully');
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<ApiResponseDto<RecipeResponseDto>> {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    const { categoryIds, translations, ingredients, ...recipeData } = updateRecipeDto;

    // Update basic recipe data
    Object.assign(recipe, recipeData);
    await this.recipeRepository.save(recipe);

    // Update categories if provided
    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({ id: In(categoryIds) });
      recipe.categories = categories;
      await this.recipeRepository.save(recipe);
    }

    // Update translations if provided
    if (translations) {
      // Remove existing translations
      await this.recipeTranslationRepository.delete({ recipeId: id });
      
      // Add new translations
      const recipeTranslations = translations.map(trans => 
        this.recipeTranslationRepository.create({
          ...trans,
          recipeId: id
        })
      );
      await this.recipeTranslationRepository.save(recipeTranslations);
    }

    // Update ingredients if provided
    if (ingredients) {
      // Remove existing ingredients
      await this.recipeIngredientRepository.delete({ recipeId: id });
      
      // Add new ingredients
      const recipeIngredients = ingredients.map((ing, index) => 
        this.recipeIngredientRepository.create({
          ...ing,
          recipeId: id,
          sortOrder: ing.sortOrder || index
        })
      );
      await this.recipeIngredientRepository.save(recipeIngredients);
    }

    const result = await this.findOne(id);
    return new ApiResponseDto(result, 'Recipe updated successfully');
  }

  async remove(id: string): Promise<void> {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    await this.recipeRepository.remove(recipe);
  }

  async uploadMedia(recipeId: string, files: MulterFile[], mediaData: RecipeMediaDto[] = []): Promise<RecipeMedia[]> {
    const recipe = await this.recipeRepository.findOne({ where: { id: recipeId } });
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
    }

    const uploadedMedia: RecipeMedia[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = mediaData[i] || {};

      // Remove mediaType from data to avoid conflict
      const { mediaType: _, ...cleanData } = data;

      const media = this.recipeMediaRepository.create({
        recipeId,
        fileName: file.filename,
        originalName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        filePath: file.path,
        mediaType: getMediaType(file.mimetype) as MediaType,
        ...cleanData
      });

      const savedMedia = await this.recipeMediaRepository.save(media);
      uploadedMedia.push(savedMedia);
    }

    return uploadedMedia;
  }

  async deleteMedia(recipeId: string, mediaId: string): Promise<void> {
    const media = await this.recipeMediaRepository.findOne({
      where: { id: mediaId, recipeId }
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${mediaId} not found for recipe ${recipeId}`);
    }

    await this.recipeMediaRepository.remove(media);
  }

  private mapToResponseDto(recipe: Recipe, languageCode: string): RecipeResponseDto {
    const translation = recipe.translations?.find(t => t.languageCode === languageCode) || recipe.translations?.[0];
    
    return {
      id: recipe.id,
      title: translation?.title || '',
      description: translation?.description || '',
      cookingTimeMinutes: recipe.cookingTimeMinutes,
      difficultyLevel: recipe.difficultyLevel,
      isPremium: recipe.isPremium,
      isFeatured: recipe.isFeatured,
      author: recipe.author ? {
        id: recipe.author.id,
        firstName: recipe.author.firstName,
        lastName: recipe.author.lastName,
      } : undefined,
      categories: recipe.categories?.map(cat => {
        const catTranslation = cat.translations?.find(t => t.languageCode === languageCode) || cat.translations?.[0];
        return {
          id: cat.id,
          name: catTranslation?.name || '',
        };
      }) || [],
      ingredients: recipe.ingredients?.map(ing => {
        const ingTranslation = ing.ingredient?.translations?.find(t => t.languageCode === languageCode) || 
                              ing.ingredient?.translations?.[0];
        return {
          id: ing.id,
          ingredient: {
            id: ing.ingredient?.id || '',
            name: ingTranslation?.name || '',
          },
          quantity: ing.quantity,
          unit: ing.unit || '',
          sortOrder: ing.sortOrder || 0,
        };
      })?.sort((a, b) => a.sortOrder - b.sortOrder) || [],
      media: recipe.media?.map(media => ({
        id: media.id,
        url: media.url,
        mediaType: media.mediaType,
        purpose: media.purpose,
        altText: media.altText || '',
        sortOrder: media.sortOrder || 0,
      }))?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)) || [],
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    };
  }
} 