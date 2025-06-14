import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from '../../entities/recipe.entity';
import { RecipeTranslation } from '../../entities/recipe-translation.entity';
import { Ingredient } from '../../entities/ingredient.entity';
import { IngredientTranslation } from '../../entities/ingredient-translation.entity';
import { Category } from '../../entities/category.entity';
import { CategoryTranslation } from '../../entities/category-translation.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      RecipeTranslation,
      Ingredient,
      IngredientTranslation,
      Category,
      CategoryTranslation,
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {} 