import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { BullModule } from '@nestjs/bull';
import { Recipe } from '../../entities/recipe.entity';
import { User } from '../../entities/user.entity';
import { UserActivity } from '../../entities/user-activity.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserActivity, Recipe, User]),
    // BullModule.registerQueue({
    //   name: 'analytics',
    // }),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {} 