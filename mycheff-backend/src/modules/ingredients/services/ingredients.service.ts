import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../../../entities/ingredient.entity';
import { IngredientTranslation } from '../../../entities/ingredient-translation.entity';
import { CreateIngredientDto, UpdateIngredientDto } from '../dto/ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(IngredientTranslation)
    private readonly ingredientTranslationRepository: Repository<IngredientTranslation>,
  ) {}

  async findAll(languageCode: string = 'tr'): Promise<any[]> {
    const ingredients = await this.ingredientRepository
      .createQueryBuilder('ingredient')
      .leftJoinAndSelect('ingredient.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .orderBy('ingredient.createdAt', 'DESC')
      .getMany();

    return ingredients.map(ingredient => ({
      ...ingredient,
      name: ingredient.translations[0]?.name || 'Untranslated',
      description: '', // Description not stored in current schema
    }));
  }

  async search(query: string, languageCode: string = 'tr', limit: number = 10): Promise<any[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const ingredients = await this.ingredientRepository
      .createQueryBuilder('ingredient')
      .leftJoinAndSelect('ingredient.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .where('LOWER(translation.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orderBy('translation.name', 'ASC')
      .limit(limit)
      .getMany();

    return ingredients.map(ingredient => ({
      ...ingredient,
      name: ingredient.translations[0]?.name || 'Untranslated',
      description: '', // Description not stored in current schema
    }));
  }

  async findOne(id: string, languageCode: string = 'tr'): Promise<any> {
    const ingredient = await this.ingredientRepository
      .createQueryBuilder('ingredient')
      .leftJoinAndSelect('ingredient.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .where('ingredient.id = :id', { id })
      .getOne();

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    return {
      ...ingredient,
      name: ingredient.translations[0]?.name || 'Untranslated',
      description: '', // Description not stored in current schema
    };
  }

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    // Create ingredient - only with fields that exist in DB
    const ingredient = this.ingredientRepository.create({
      defaultUnit: createIngredientDto.defaultUnit || 'pieces',
    });

    const savedIngredient = await this.ingredientRepository.save(ingredient);

    // Create translations
    const translations = createIngredientDto.translations.map(translation => 
      this.ingredientTranslationRepository.create({
        ingredientId: savedIngredient.id,
        languageCode: translation.languageCode,
        name: translation.name,
        aliases: [], // Empty array for now
      })
    );

    await this.ingredientTranslationRepository.save(translations);

    return savedIngredient;
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({ where: { id } });
    
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    // Update ingredient - only with fields that exist in DB
    if (updateIngredientDto.defaultUnit) {
      ingredient.defaultUnit = updateIngredientDto.defaultUnit;
    }

    const savedIngredient = await this.ingredientRepository.save(ingredient);

    // Update translations if provided
    if (updateIngredientDto.translations) {
      // Remove existing translations
      await this.ingredientTranslationRepository.delete({ ingredientId: id });

      // Create new translations
      const translations = updateIngredientDto.translations.map(translation => 
        this.ingredientTranslationRepository.create({
          ingredientId: id,
          languageCode: translation.languageCode,
          name: translation.name,
          aliases: [], // Empty array for now
        })
      );

      await this.ingredientTranslationRepository.save(translations);
    }

    return savedIngredient;
  }

  async remove(id: string): Promise<void> {
    const ingredient = await this.ingredientRepository.findOne({ where: { id } });
    
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    await this.ingredientRepository.remove(ingredient);
  }

  async activate(id: string): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({ where: { id } });
    
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    // isActive not stored in current schema, just return ingredient
    return ingredient;
  }

  async deactivate(id: string): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({ where: { id } });
    
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    // isActive not stored in current schema, just return ingredient
    return ingredient;
  }
} 