import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AnalyticsService, ActivityData } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Track user activity' })
  async trackActivity(@Body() data: ActivityData, @Request() req) {
    const activityData = {
      ...data,
      userId: req.user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    await this.analyticsService.trackActivity(activityData);
    
    return {
      success: true,
      message: 'Activity tracked successfully',
    };
  }

  @Get('user/stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user statistics' })
  async getUserStats(@Request() req, @Query('days') days = 30) {
    const stats = await this.analyticsService.getUserStats(req.user.id, days);
    
    return {
      success: true,
      data: stats,
    };
  }

  @Get('popular-recipes')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get popular recipes' })
  async getPopularRecipes(
    @Query('languageCode') languageCode = 'tr',
    @Query('days') days = 7,
    @Query('limit') limit = 10,
  ) {
    const recipes = await this.analyticsService.getPopularRecipes(languageCode, days, limit);
    
    return {
      success: true,
      data: recipes,
    };
  }

  @Get('system/stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get system statistics (Admin only)' })
  async getSystemStats() {
    const stats = await this.analyticsService.getSystemStats();
    
    return {
      success: true,
      data: stats,
    };
  }
} 