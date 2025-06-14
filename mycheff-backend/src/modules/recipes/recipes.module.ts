import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './controllers/recipes.controller';
import { RecipesService } from './services/recipes.service';
import { Recipe } from '../../entities/recipe.entity';
import { RecipeTranslation } from '../../entities/recipe-translation.entity';
import { RecipeDetails } from '../../entities/recipe-details.entity';
import { RecipeMedia } from '../../entities/recipe-media.entity';
import { RecipeIngredient } from '../../entities/recipe-ingredient.entity';
import { Category } from '../../entities/category.entity';
import { CategoryTranslation } from '../../entities/category-translation.entity';
import { Ingredient } from '../../entities/ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      RecipeTranslation,
      RecipeDetails,
      RecipeMedia,
      RecipeIngredient,
      Category,
      CategoryTranslation,
      Ingredient,
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {} 