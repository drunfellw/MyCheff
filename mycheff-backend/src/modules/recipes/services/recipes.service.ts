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
    const [recipes, total] = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .leftJoinAndSelect('recipe.details', 'details')
      .leftJoinAndSelect('recipe.media', 'media', 'media.isPrimary = true')
      .where('recipe.isPublished = true')
      .orderBy('recipe.createdAt', 'DESC')
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
        isPublished: recipe.isPublished,
        averageRating: recipe.averageRating,
        ratingCount: recipe.ratingCount,
        viewCount: recipe.viewCount,
        imageUrl: recipe.media[0]?.url || null,
        nutritionalData: recipe.details?.nutritionalData || null,
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Recipes retrieved successfully',
    };
  }

  async getRecipeById(id: string, languageCode: string = 'tr') {
    const recipe = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .leftJoinAndSelect('recipe.details', 'details')
      .leftJoinAndSelect('recipe.media', 'media')
      .leftJoinAndSelect('recipe.ingredients', 'recipeIngredient')
      .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
      .leftJoinAndSelect('ingredient.translations', 'ingredientTranslation', 'ingredientTranslation.languageCode = :languageCode', { languageCode })
      .where('recipe.id = :id', { id })
      .getOne();

    if (!recipe) {
      return {
        success: false,
        message: 'Recipe not found',
      };
    }

    return {
      success: true,
      data: {
        id: recipe.id,
        title: recipe.translations[0]?.title || 'Başlık yok',
        description: recipe.translations[0]?.description || '',
        preparationSteps: recipe.translations[0]?.preparationSteps || [],
        tips: recipe.translations[0]?.tips || [],
        cookingTimeMinutes: recipe.cookingTimeMinutes,
        prepTimeMinutes: recipe.prepTimeMinutes,
        difficultyLevel: recipe.difficultyLevel,
        servingSize: recipe.servingSize,
        isPremium: recipe.isPremium,
        isPublished: recipe.isPublished,
        averageRating: recipe.averageRating,
        ratingCount: recipe.ratingCount,
        viewCount: recipe.viewCount,
        nutritionalData: recipe.details?.nutritionalData || null,
        attributes: recipe.details?.attributes || null,
        ingredients: recipe.ingredients?.map(ri => ({
          id: ri.ingredient.id,
          name: ri.ingredient.translations[0]?.name || 'Malzeme',
          quantity: ri.quantity,
          unit: ri.unit,
          isRequired: ri.isRequired,
        })) || [],
        media: recipe.media?.map(media => ({
          id: media.id,
          url: media.url,
          mediaType: media.mediaType,
          isPrimary: media.isPrimary,
          displayOrder: media.displayOrder,
        })) || [],
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
      },
      message: 'Recipe retrieved successfully',
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

  async getFeaturedRecipes(page: number = 1, limit: number = 10, languageCode: string = 'tr') {
    const [recipes, total] = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .leftJoinAndSelect('recipe.details', 'details')
      .leftJoinAndSelect('recipe.media', 'media', 'media.isPrimary = true')
      .where('recipe.isPublished = true')
      .andWhere('recipe.isFeatured = true')
      .orderBy('recipe.createdAt', 'DESC')
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
      message: 'Featured recipes retrieved successfully',
    };
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

    return {
      success: true,
      data: { id: savedRecipe.id },
      message: 'Recipe created successfully'
    };
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