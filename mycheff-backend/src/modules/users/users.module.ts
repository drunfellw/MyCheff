import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UserIngredient } from '../../entities/user-ingredient.entity';
import { UserFavorite } from '../../entities/user-favorite.entity';
import { Ingredient } from '../../entities/ingredient.entity';
import { Recipe } from '../../entities/recipe.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      UserIngredient, 
      UserFavorite,
      Ingredient,
      Recipe,
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {} 