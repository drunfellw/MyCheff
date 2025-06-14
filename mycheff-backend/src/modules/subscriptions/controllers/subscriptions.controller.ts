import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionsService } from '../services/subscriptions.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all subscription plans' })
  @ApiResponse({ status: 200, description: 'Subscription plans retrieved successfully' })
  async getPlans(@Query('lang') languageCode: string = 'tr') {
    return await this.subscriptionsService.getAllPlans(languageCode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription plan by ID' })
  @ApiResponse({ status: 200, description: 'Subscription plan found' })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  async getPlan(
    @Param('id') id: string,
    @Query('lang') languageCode: string = 'tr'
  ) {
    return await this.subscriptionsService.getPlanById(id, languageCode);
  }

  @Post('plans')
  @ApiOperation({ summary: 'Create new subscription plan' })
  @ApiResponse({ status: 201, description: 'Subscription plan created successfully' })
  async createPlan(@Body() createPlanDto: any) {
    return await this.subscriptionsService.createPlan(createPlanDto);
  }

  @Put('plans/:id')
  @ApiOperation({ summary: 'Update subscription plan' })
  @ApiResponse({ status: 200, description: 'Subscription plan updated successfully' })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  async updatePlan(@Param('id') id: string, @Body() updatePlanDto: any) {
    return await this.subscriptionsService.updatePlan(id, updatePlanDto);
  }

  @Delete('plans/:id')
  @ApiOperation({ summary: 'Delete subscription plan' })
  @ApiResponse({ status: 200, description: 'Subscription plan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  async deletePlan(@Param('id') id: string) {
    return await this.subscriptionsService.deletePlan(id);
  }
} 