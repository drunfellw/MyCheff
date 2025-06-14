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
import { IngredientsService } from '../services/ingredients.service';
import { CreateIngredientDto, UpdateIngredientDto, IngredientResponseDto } from '../dto/ingredient.dto';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active ingredients' })
  @ApiQuery({ name: 'lang', description: 'Language code', required: false, example: 'tr' })
  @ApiResponse({
    status: 200,
    description: 'Ingredients retrieved successfully',
    type: [IngredientResponseDto],
  })
  async findAll(@Query('lang') languageCode?: string): Promise<ApiResponseDto<IngredientResponseDto[]>> {
    const ingredients = await this.ingredientsService.findAll(languageCode);
    return new ApiResponseDto(ingredients, 'Ingredients retrieved successfully');
  }

  @Get('search')
  @ApiOperation({ summary: 'Search ingredients with autocomplete' })
  @ApiQuery({ name: 'q', description: 'Search query', required: true })
  @ApiQuery({ name: 'lang', description: 'Language code', required: false, example: 'tr' })
  @ApiQuery({ name: 'limit', description: 'Maximum results', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Ingredients search results',
    type: [IngredientResponseDto],
  })
  async search(
    @Query('q') query: string,
    @Query('lang') languageCode?: string,
    @Query('limit') limit: number = 10,
  ): Promise<ApiResponseDto<IngredientResponseDto[]>> {
    const ingredients = await this.ingredientsService.search(query, languageCode, limit);
    return new ApiResponseDto(ingredients, 'Ingredients search completed');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ingredient by ID' })
  @ApiParam({ name: 'id', description: 'Ingredient ID' })
  @ApiQuery({ name: 'lang', description: 'Language code', required: false, example: 'tr' })
  @ApiResponse({
    status: 200,
    description: 'Ingredient retrieved successfully',
    type: IngredientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ingredient not found' })
  async findOne(
    @Param('id') id: string,
    @Query('lang') languageCode?: string,
  ): Promise<ApiResponseDto<IngredientResponseDto>> {
    const ingredient = await this.ingredientsService.findOne(id, languageCode);
    return new ApiResponseDto(ingredient, 'Ingredient retrieved successfully');
  }

  @Post()
  // @UseGuards(JwtAuthGuard) // TODO: Re-enable for production
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiResponse({
    status: 201,
    description: 'Ingredient created successfully',
    type: IngredientResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Ingredient slug already exists' })
  async create(@Body() createIngredientDto: CreateIngredientDto): Promise<ApiResponseDto<any>> {
    const ingredient = await this.ingredientsService.create(createIngredientDto);
    return new ApiResponseDto(ingredient, 'Ingredient created successfully');
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard) // TODO: Re-enable for production
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update ingredient' })
  @ApiParam({ name: 'id', description: 'Ingredient ID' })
  @ApiResponse({
    status: 200,
    description: 'Ingredient updated successfully',
    type: IngredientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ingredient not found' })
  async update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ): Promise<ApiResponseDto<any>> {
    const ingredient = await this.ingredientsService.update(id, updateIngredientDto);
    return new ApiResponseDto(ingredient, 'Ingredient updated successfully');
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard) // TODO: Re-enable for production
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ingredient' })
  @ApiParam({ name: 'id', description: 'Ingredient ID' })
  @ApiResponse({ status: 204, description: 'Ingredient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ingredient not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.ingredientsService.remove(id);
  }

  @Patch(':id/activate')
  // @UseGuards(JwtAuthGuard) // TODO: Re-enable for production
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate ingredient' })
  @ApiParam({ name: 'id', description: 'Ingredient ID' })
  @ApiResponse({
    status: 200,
    description: 'Ingredient activated successfully',
    type: IngredientResponseDto,
  })
  async activate(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const ingredient = await this.ingredientsService.activate(id);
    return new ApiResponseDto(ingredient, 'Ingredient activated successfully');
  }

  @Patch(':id/deactivate')
  // @UseGuards(JwtAuthGuard) // TODO: Re-enable for production
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate ingredient' })
  @ApiParam({ name: 'id', description: 'Ingredient ID' })
  @ApiResponse({
    status: 200,
    description: 'Ingredient deactivated successfully',
    type: IngredientResponseDto,
  })
  async deactivate(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const ingredient = await this.ingredientsService.deactivate(id);
    return new ApiResponseDto(ingredient, 'Ingredient deactivated successfully');
  }
} 