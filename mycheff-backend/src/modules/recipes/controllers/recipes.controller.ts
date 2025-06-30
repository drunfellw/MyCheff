import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecipesService } from '../services/recipes.service';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  servings: number;
  imageUrl?: string;
  ingredients: string[];
  instructions: string[];
  categoryId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  
  constructor(private readonly recipesService: RecipesService) {}

  @Get('test')
  @ApiOperation({ summary: 'Test recipes endpoint' })
  @ApiResponse({ status: 200, description: 'Test successful' })
  async test() {
    return { 
      message: 'Recipes controller is working!', 
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  }

  @Get('db-test')
  @ApiOperation({ summary: 'Test database connection' })
  @ApiResponse({ status: 200, description: 'Database test result' })
  async testDatabase() {
    return await this.recipesService.testConnection();
  }

  @Get('db-schema')
  @ApiOperation({ summary: 'Get database schema info' })
  @ApiResponse({ status: 200, description: 'Schema info retrieved' })
  async getSchemaInfo() {
    return await this.recipesService.getSchemaInfo();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories(@Query('lang') languageCode: string = 'tr') {
    return await this.recipesService.getAllCategories(languageCode);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured recipes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Featured recipes retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Recipe' } },
        message: { type: 'string' }
      }
    }
  })
  async getFeaturedRecipes(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    try {
      return await this.recipesService.getFeaturedRecipes(parseInt(page), parseInt(limit));
    } catch (error) {
      throw new HttpException('Failed to retrieve featured recipes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('by-ingredients')
  @ApiOperation({ summary: 'Find recipes by ingredients' })
  @ApiResponse({ 
    status: 200, 
    description: 'Recipes matching ingredients retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { 
          type: 'array', 
          items: { 
            allOf: [
              { $ref: '#/components/schemas/Recipe' },
              {
                type: 'object',
                properties: {
                  matchPercentage: { type: 'number' },
                  missingIngredients: { type: 'array', items: { type: 'string' } },
                  matchingIngredients: { type: 'array', items: { type: 'string' } }
                }
              }
            ]
          }
        },
        message: { type: 'string' },
        pagination: { $ref: '#/components/schemas/Pagination' }
      }
    }
  })
  async findRecipesByIngredients(
    @Body() matchParams: {
      ingredientIds: string[];
      minMatchPercentage?: number;
      includePartialMatches?: boolean;
      page?: number;
      limit?: number;
      languageCode?: string;
    }
  ) {
    const {
      ingredientIds,
      minMatchPercentage = 30,
      includePartialMatches = true,
      page = 1,
      limit = 20,
      languageCode = 'tr'
    } = matchParams;

    if (!ingredientIds || ingredientIds.length === 0) {
      return {
        success: false,
        message: 'At least one ingredient ID is required',
        timestamp: new Date().toISOString()
      };
    }

    return await this.recipesService.findRecipesByIngredients(
      ingredientIds,
      minMatchPercentage,
      includePartialMatches,
      page,
      limit,
      languageCode
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Search recipes' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchRecipes(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('lang') languageCode: string = 'tr'
  ) {
    if (!query) {
      return {
        success: false,
        message: 'Search query is required',
        timestamp: new Date().toISOString()
      };
    }

    return await this.recipesService.searchRecipes(
      query,
      parseInt(page),
      parseInt(limit),
      languageCode
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiResponse({ status: 200, description: 'Recipes retrieved successfully' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('lang') languageCode: string = 'tr'
  ) {
    return await this.recipesService.getAllRecipes(
      parseInt(page),
      parseInt(limit),
      languageCode
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recipe by ID' })
  @ApiResponse({ status: 200, description: 'Recipe found' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  async findOne(
    @Param('id') id: string,
    @Query('lang') languageCode: string = 'tr'
  ) {
    return await this.recipesService.getRecipeById(id, languageCode);
  }

  @Post()
  @ApiOperation({ summary: 'Create new recipe' })
  @ApiResponse({ status: 201, description: 'Recipe created successfully' })
  async create(@Body() createRecipeDto: any) {
    try {
      return await this.recipesService.create(createRecipeDto);
    } catch (error) {
      return {
        success: false,
        message: 'Recipe creation failed: ' + error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update recipe' })
  @ApiResponse({ status: 200, description: 'Recipe updated successfully' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  async update(@Param('id') id: string, @Body() updateRecipeDto: Partial<Recipe>) {
    return {
      success: true,
      message: 'Recipe update endpoint - Coming soon',
      timestamp: new Date().toISOString()
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete recipe' })
  @ApiResponse({ status: 200, description: 'Recipe deleted successfully' })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  async remove(@Param('id') id: string) {
    return {
      success: true,
      message: 'Recipe delete endpoint - Coming soon',
      timestamp: new Date().toISOString()
    };
  }
} 