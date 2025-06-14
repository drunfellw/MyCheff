import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
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
  @ApiResponse({ status: 200, description: 'Featured recipes retrieved successfully' })
  async getFeaturedRecipes(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('lang') languageCode: string = 'tr'
  ) {
    return await this.recipesService.getFeaturedRecipes(
      parseInt(page),
      parseInt(limit),
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

  // Mock data endpoints for backward compatibility
  @Get('mock/test')
  @ApiOperation({ summary: 'Get mock recipes (for testing)' })
  @ApiResponse({ status: 200, description: 'Mock recipes retrieved successfully' })
  async getMockRecipes(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const mockRecipes: Recipe[] = [
      {
        id: '1',
        title: 'Menemen',
        description: 'Geleneksel Türk kahvaltısı, domates ve yumurta ile',
        cookingTime: 15,
        difficulty: 'Easy',
        servings: 2,
        imageUrl: '/uploads/menemen.jpg',
        ingredients: ['2 adet yumurta', '1 adet domates', '1 adet yeşil biber', 'Tuz', 'Karabiber'],
        instructions: ['Domatesleri doğrayın', 'Biberleri doğrayın', 'Tavada pişirin', 'Yumurtaları ekleyin'],
        categoryId: '1',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Mercimek Çorbası',
        description: 'Sıcak ve besleyici kırmızı mercimek çorbası',
        cookingTime: 30,
        difficulty: 'Easy',
        servings: 4,
        imageUrl: '/uploads/mercimek-corbasi.jpg',
        ingredients: ['1 su bardağı kırmızı mercimek', '1 adet soğan', '2 yemek kaşığı tereyağı', 'Tuz', 'Karabiber'],
        instructions: ['Soğanı kavurun', 'Mercimeği ekleyin', 'Su ilave edin', '25 dakika pişirin'],
        categoryId: '2',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedRecipes = mockRecipes.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedRecipes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: mockRecipes.length,
        totalPages: Math.ceil(mockRecipes.length / limitNum)
      },
      message: 'Mock recipes retrieved successfully',
      timestamp: new Date().toISOString()
    };
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