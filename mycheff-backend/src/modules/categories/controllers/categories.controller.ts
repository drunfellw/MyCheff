import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../dto/category.dto';
import { ApiResponseDto, PaginatedResponseDto } from '../../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiQuery({ name: 'lang', description: 'Language code', required: false, example: 'tr' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [CategoryResponseDto],
  })
  async findAll(@Query('lang') languageCode?: string): Promise<ApiResponseDto<CategoryResponseDto[]>> {
    const categories = await this.categoriesService.findAll(languageCode);
    return new ApiResponseDto(categories, 'Categories retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiQuery({ name: 'lang', description: 'Language code', required: false, example: 'tr' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(
    @Param('id') id: string,
    @Query('lang') languageCode?: string,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    const category = await this.categoriesService.findOne(id, languageCode);
    return new ApiResponseDto(category, 'Category retrieved successfully');
  }

  @Get(':id/recipes')
  @ApiOperation({ summary: 'Get recipes by category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Items per page', required: false, example: 20 })
  @ApiQuery({ name: 'lang', description: 'Language code', required: false, example: 'tr' })
  @ApiResponse({
    status: 200,
    description: 'Category recipes retrieved successfully',
  })
  async getCategoryRecipes(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('lang') languageCode?: string,
  ): Promise<PaginatedResponseDto<any>> {
    const result = await this.categoriesService.getCategoryRecipes(id, page, limit, languageCode);
    return result;
  }

  @Post()
  // @UseGuards(JwtAuthGuard)  // Temporarily disabled for admin panel
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Category slug already exists' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ApiResponseDto<any>> {
    const category = await this.categoriesService.create(createCategoryDto);
    return new ApiResponseDto(category, 'Category created successfully');
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard) // TODO: Re-enable for production
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponseDto<any>> {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    return new ApiResponseDto(category, 'Category updated successfully');
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)  // Temporarily disabled for admin panel
  // @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.categoriesService.remove(id);
  }

  @Patch(':id/activate')
  // @UseGuards(JwtAuthGuard) // TODO: Re-enable for production
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category activated successfully',
    type: CategoryResponseDto,
  })
  async activate(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const category = await this.categoriesService.activate(id);
    return new ApiResponseDto(category, 'Category activated successfully');
  }

  @Patch(':id/deactivate')
  // @UseGuards(JwtAuthGuard) // TODO: Re-enable for production
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Category deactivated successfully',
    type: CategoryResponseDto,
  })
  async deactivate(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const category = await this.categoriesService.deactivate(id);
    return new ApiResponseDto(category, 'Category deactivated successfully');
  }
} 