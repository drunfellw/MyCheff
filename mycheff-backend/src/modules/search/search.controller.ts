import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SearchService, SearchParams } from './search.service';

@ApiTags('Search')
@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('recipes')
  @ApiOperation({ summary: 'Search recipes with filters' })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'categoryIds', required: false, type: [String] })
  @ApiQuery({ name: 'maxCookingTime', required: false, type: Number })
  @ApiQuery({ name: 'difficultyLevel', required: false, type: Number })
  @ApiQuery({ name: 'isPremium', required: false, type: Boolean })
  @ApiQuery({ name: 'languageCode', required: false, enum: ['tr', 'en', 'es', 'fr', 'de', 'ar'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['relevance', 'rating', 'newest', 'cookingTime'] })
  async searchRecipes(
    @Query('query') query?: string,
    @Query('categoryIds') categoryIds?: string | string[],
    @Query('maxCookingTime') maxCookingTime?: number,
    @Query('difficultyLevel') difficultyLevel?: number,
    @Query('isPremium') isPremium?: boolean,
    @Query('languageCode') languageCode?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'relevance' | 'rating' | 'newest' | 'cookingTime',
  ) {
    const params: SearchParams = {
      query,
      filters: {
        categoryIds: Array.isArray(categoryIds) ? categoryIds : categoryIds ? [categoryIds] : undefined,
        maxCookingTime,
        difficultyLevel,
        isPremium,
      },
      languageCode,
      page,
      limit,
      sortBy,
    };

    const result = await this.searchService.searchRecipes(params);
    
    return {
      success: true,
      data: result,
    };
  }

  @Get('ingredients')
  @ApiOperation({ summary: 'Search ingredients' })
  async searchIngredients(
    @Query('query') query: string,
    @Query('languageCode') languageCode = 'tr',
    @Query('limit') limit = 10,
  ) {
    const ingredients = await this.searchService.searchIngredients(query, languageCode, limit);
    
    return {
      success: true,
      data: ingredients,
    };
  }

  @Get('categories')
  @ApiOperation({ summary: 'Search categories' })
  async searchCategories(
    @Query('query') query: string,
    @Query('languageCode') languageCode = 'tr',
    @Query('limit') limit = 10,
  ) {
    const categories = await this.searchService.searchCategories(query, languageCode, limit);
    
    return {
      success: true,
      data: categories,
    };
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  async getSearchSuggestions(
    @Query('query') query: string,
    @Query('languageCode') languageCode = 'tr',
  ) {
    const suggestions = await this.searchService.getSearchSuggestions(query, languageCode);
    
    return {
      success: true,
      data: suggestions,
    };
  }
} 