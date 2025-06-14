import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

// Entities
import { Language } from './entities/language.entity';
import { Category } from './entities/category.entity';
import { CategoryTranslation } from './entities/category-translation.entity';
import { User } from './entities/user.entity';
import { Recipe } from './entities/recipe.entity';
import { RecipeTranslation } from './entities/recipe-translation.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { RecipeDetails } from './entities/recipe-details.entity';
import { RecipeMedia } from './entities/recipe-media.entity';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientTranslation } from './entities/ingredient-translation.entity';
import { IngredientCategory } from './entities/ingredient-category.entity';
import { IngredientCategoryTranslation } from './entities/ingredient-category-translation.entity';
import { Unit } from './entities/unit.entity';
import { UnitTranslation } from './entities/unit-translation.entity';
import { UserIngredient } from './entities/user-ingredient.entity';
import { UserFavorite } from './entities/user-favorite.entity';
import { RecipeRating } from './entities/recipe-rating.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { SubscriptionPlanTranslation } from './entities/subscription-plan-translation.entity';
import { UserSubscription } from './entities/user-subscription.entity';
import { CalorieEntry } from './entities/calorie-entry.entity';
import { AppSettings } from './entities/app-settings.entity';
import { PushNotification } from './entities/push-notification.entity';
import { RecipeCollection } from './entities/recipe-collection.entity';
import { CollectionRecipe } from './entities/collection-recipe.entity';
import { UserActivity } from './entities/user-activity.entity';

// Modules
import { LanguagesModule } from './modules/languages/languages.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || '123',
      database: process.env.DATABASE_NAME || 'postgres',
      schema: 'mycheff',
      entities: [
        Language,
        Category,
        CategoryTranslation,
        Ingredient,
        IngredientTranslation,
        IngredientCategory,
        IngredientCategoryTranslation,
        Unit,
        UnitTranslation,
        User,
        Recipe,
        RecipeTranslation,
        RecipeIngredient,
        RecipeDetails,
        RecipeMedia,
        UserIngredient,
        UserFavorite,
        RecipeRating,
        SubscriptionPlan,
        SubscriptionPlanTranslation,
        UserSubscription,
        CalorieEntry,
        AppSettings,
        PushNotification,
        RecipeCollection,
        CollectionRecipe,
        UserActivity,
      ],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    LanguagesModule,
    CategoriesModule,
    AuthModule,
    UsersModule,
    IngredientsModule,
    RecipesModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
