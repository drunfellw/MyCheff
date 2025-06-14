import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from '../../entities/ingredient.entity';
import { IngredientTranslation } from '../../entities/ingredient-translation.entity';
import { IngredientCategory } from '../../entities/ingredient-category.entity';
import { IngredientCategoryTranslation } from '../../entities/ingredient-category-translation.entity';
import { Unit } from '../../entities/unit.entity';
import { UnitTranslation } from '../../entities/unit-translation.entity';
import { IngredientsController } from './controllers/ingredients.controller';
import { IngredientsService } from './services/ingredients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ingredient,
      IngredientTranslation,
      IngredientCategory,
      IngredientCategoryTranslation,
      Unit,
      UnitTranslation,
    ]),
  ],
  controllers: [IngredientsController],
  providers: [IngredientsService],
  exports: [IngredientsService],
})
export class IngredientsModule {} 