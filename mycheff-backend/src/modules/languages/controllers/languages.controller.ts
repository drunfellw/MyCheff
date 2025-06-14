import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LanguagesService } from '../services/languages.service';

@ApiTags('languages')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all languages' })
  @ApiResponse({ status: 200, description: 'Languages retrieved successfully' })
  async getAllLanguages() {
    return await this.languagesService.getAllLanguages();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get language by code' })
  @ApiResponse({ status: 200, description: 'Language found' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async getLanguageByCode(@Param('code') code: string) {
    return await this.languagesService.getLanguageByCode(code);
  }

  @Post()
  @ApiOperation({ summary: 'Create new language' })
  @ApiResponse({ status: 201, description: 'Language created successfully' })
  async createLanguage(@Body() createLanguageDto: any) {
    return await this.languagesService.createLanguage(createLanguageDto);
  }

  @Put(':code')
  @ApiOperation({ summary: 'Update language' })
  @ApiResponse({ status: 200, description: 'Language updated successfully' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async updateLanguage(@Param('code') code: string, @Body() updateLanguageDto: any) {
    return await this.languagesService.updateLanguage(code, updateLanguageDto);
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Delete language' })
  @ApiResponse({ status: 200, description: 'Language deleted successfully' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async deleteLanguage(@Param('code') code: string) {
    return await this.languagesService.deleteLanguage(code);
  }
} 