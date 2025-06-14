import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../entities/category.entity';
import { CategoryTranslation } from '../../../entities/category-translation.entity';
import { Recipe } from '../../../entities/recipe.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(CategoryTranslation)
    private readonly categoryTranslationRepository: Repository<CategoryTranslation>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  async findAll(languageCode: string = 'tr'): Promise<any[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .orderBy('category.createdAt', 'DESC')
      .getMany();

    return categories.map(category => ({
      ...category,
      name: category.translations[0]?.name || 'Untranslated',
      description: '', // Description not stored in current schema
    }));
  }

  async findOne(id: string, languageCode: string = 'tr'): Promise<any> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .where('category.id = :id', { id })
      .getOne();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return {
      ...category,
      name: category.translations[0]?.name || 'Untranslated',
      description: '', // Description not stored in current schema
    };
  }

  async getCategoryRecipes(
    categoryId: string,
    page: number = 1,
    limit: number = 20,
    languageCode: string = 'tr',
  ): Promise<PaginatedResponseDto<any>> {
    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const skip = (page - 1) * limit;

    const [recipes, total] = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .leftJoin('recipe.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .orderBy('recipe.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const formattedRecipes = recipes.map(recipe => ({
      ...recipe,
      title: recipe.translations[0]?.title || 'Untranslated',
      description: recipe.translations[0]?.description || '',
      preparationSteps: recipe.translations[0]?.preparationSteps || [],
    }));

    const totalPages = Math.ceil(total / limit);

    return new PaginatedResponseDto(
      formattedRecipes,
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

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Create category - only basic fields that exist in DB
    const category = this.categoryRepository.create({});

    const savedCategory = await this.categoryRepository.save(category);

    // Create translations
    const translations = createCategoryDto.translations.map(translation => 
      this.categoryTranslationRepository.create({
        categoryId: savedCategory.id,
        languageCode: translation.languageCode,
        name: translation.name,
      })
    );

    await this.categoryTranslationRepository.save(translations);

    return savedCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Update category - basic fields only
    const savedCategory = await this.categoryRepository.save(category);

    // Update translations if provided
    if (updateCategoryDto.translations) {
      // Remove existing translations
      await this.categoryTranslationRepository.delete({ categoryId: id });

      // Create new translations
      const translations = updateCategoryDto.translations.map(translation => 
        this.categoryTranslationRepository.create({
          categoryId: id,
          languageCode: translation.languageCode,
          name: translation.name,
        })
      );

      await this.categoryTranslationRepository.save(translations);
    }

    return savedCategory;
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryRepository.remove(category);
  }

  async activate(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.categoryRepository.save(category);
  }

  async deactivate(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.categoryRepository.save(category);
  }
} 