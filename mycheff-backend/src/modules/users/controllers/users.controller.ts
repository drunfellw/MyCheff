import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { UpdateUserDto, ChangePasswordDto, UserResponseDto } from '../dto/user.dto';
import { ApiResponseDto, PaginatedResponseDto } from '../../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
// PaginationDto is now part of api-response.dto

@ApiTags('users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  async getProfile(@Request() req): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.getProfile(req.user.id);
    return new ApiResponseDto(user, 'User profile retrieved successfully');
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserResponseDto,
  })
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.updateProfile(req.user.id, updateUserDto);
    return new ApiResponseDto(user, 'User profile updated successfully');
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 204, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.usersService.changePassword(req.user.id, changePasswordDto);
  }

  @Get('ingredients')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user ingredients' })
  @ApiResponse({
    status: 200,
    description: 'User ingredients retrieved successfully',
  })
  async getUserIngredients(@Request() req): Promise<ApiResponseDto<any[]>> {
    const ingredients = await this.usersService.getUserIngredients(req.user.id);
    return new ApiResponseDto(ingredients, 'User ingredients retrieved successfully');
  }

  @Post('ingredients')
  @ApiOperation({ summary: 'Add ingredient to user inventory' })
  @ApiResponse({
    status: 201,
    description: 'Ingredient added successfully',
  })
  async addUserIngredient(
    @Request() req,
    @Body() ingredientData: {
      ingredientId: string;
      quantity: number;
      unit: string;
      expiryDate?: Date;
      notes?: string;
    },
  ): Promise<ApiResponseDto<any>> {
    const ingredient = await this.usersService.addUserIngredient(req.user.id, ingredientData);
    return new ApiResponseDto(ingredient, 'Ingredient added successfully');
  }

  @Patch('ingredients/:ingredientId')
  @ApiOperation({ summary: 'Update user ingredient' })
  @ApiParam({ name: 'ingredientId', description: 'Ingredient ID' })
  @ApiResponse({
    status: 200,
    description: 'Ingredient updated successfully',
  })
  async updateUserIngredient(
    @Request() req,
    @Param('ingredientId') ingredientId: string,
    @Body() updateData: {
      quantity?: number;
      unit?: string;
      expiryDate?: Date;
      notes?: string;
    },
  ): Promise<ApiResponseDto<any>> {
    const ingredient = await this.usersService.updateUserIngredient(req.user.id, ingredientId, updateData);
    return new ApiResponseDto(ingredient, 'Ingredient updated successfully');
  }

  @Delete('ingredients/:ingredientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove ingredient from user inventory' })
  @ApiParam({ name: 'ingredientId', description: 'Ingredient ID' })
  @ApiResponse({ status: 204, description: 'Ingredient removed successfully' })
  async removeUserIngredient(
    @Request() req,
    @Param('ingredientId') ingredientId: string,
  ): Promise<void> {
    await this.usersService.removeUserIngredient(req.user.id, ingredientId);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get user favorite recipes' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Items per page', required: false, example: 20 })
  @ApiQuery({ name: 'lang', description: 'Language code', required: false, example: 'tr' })
  @ApiResponse({
    status: 200,
    description: 'User favorites retrieved successfully',
  })
  async getFavorites(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('lang') languageCode?: string,
  ): Promise<PaginatedResponseDto<any>> {
    return this.usersService.getUserFavorites(req.user.id, { page, limit, languageCode });
  }

  @Post('favorites')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add recipe to favorites' })
  @ApiResponse({ status: 204, description: 'Recipe added to favorites' })
  async addToFavorites(
    @Request() req,
    @Body() body: { recipeId: string },
  ): Promise<void> {
    await this.usersService.addToFavorites(req.user.id, body.recipeId);
  }

  @Delete('favorites/:recipeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove recipe from favorites' })
  @ApiParam({ name: 'recipeId', description: 'Recipe ID' })
  @ApiResponse({ status: 204, description: 'Recipe removed from favorites' })
  async removeFromFavorites(
    @Request() req,
    @Param('recipeId') recipeId: string,
  ): Promise<void> {
    await this.usersService.removeFromFavorites(req.user.id, recipeId);
  }

  @Get('favorites/:recipeId/check')
  @ApiOperation({ summary: 'Check if recipe is favorited' })
  @ApiParam({ name: 'recipeId', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Favorite status checked',
  })
  async isFavorite(
    @Request() req,
    @Param('recipeId') recipeId: string,
  ): Promise<ApiResponseDto<{ isFavorite: boolean }>> {
    const isFavorite = await this.usersService.isFavorite(req.user.id, recipeId);
    return new ApiResponseDto({ isFavorite }, 'Favorite status checked');
  }

  @Get('me/favorites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiResponse({ status: 200, description: 'User favorites retrieved successfully.' })
  async getUserFavorites(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('lang') languageCode?: string
  ) {
    return this.usersService.getUserFavorites(req.user.id, { page, limit, languageCode });
  }

  @Post('me/favorites/:recipeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add recipe to favorites' })
  @ApiResponse({ status: 201, description: 'Recipe added to favorites successfully.' })
  async addToFavoritesPost(
    @Request() req: any,
    @Param('recipeId') recipeId: string
  ) {
    return this.usersService.addToFavorites(req.user.id, recipeId);
  }

  @Delete('me/favorites/:recipeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove recipe from favorites' })
  @ApiResponse({ status: 200, description: 'Recipe removed from favorites successfully.' })
  async removeFromFavoritesPost(
    @Request() req: any,
    @Param('recipeId') recipeId: string
  ) {
    return this.usersService.removeFromFavorites(req.user.id, recipeId);
  }

  @Post('me/favorites/bulk-delete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove multiple recipes from favorites' })
  @ApiResponse({ status: 200, description: 'Recipes removed from favorites successfully.' })
  async removeMultipleFavorites(
    @Request() req: any,
    @Body() body: { recipeIds: string[] }
  ) {
    return this.usersService.removeMultipleFavorites(req.user.id, body.recipeIds);
  }
} 