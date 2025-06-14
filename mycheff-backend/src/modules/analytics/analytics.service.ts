import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { InjectQueue } from '@nestjs/bull';
// import { Queue } from 'bull';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import { UserActivity } from '../../entities/user-activity.entity';
import { Recipe } from '../../entities/recipe.entity';
import { User } from '../../entities/user.entity';

export interface ActivityData {
  userId: string;
  activityType: string;
  recipeId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface AnalyticsStats {
  totalUsers: number;
  totalRecipes: number;
  totalActivities: number;
  popularRecipes: any[];
  userEngagement: any;
  dailyStats: any[];
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(UserActivity)
    private activityRepository: Repository<UserActivity>,
    
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    // @InjectQueue('analytics')
    // private analyticsQueue: Queue,
    
    // @Inject(CACHE_MANAGER)
    // private cacheManager: Cache,
  ) {}

  async trackActivity(data: ActivityData) {
    // Add to queue for async processing (commented out for now)
    // await this.analyticsQueue.add('track-activity', data, {
    //   attempts: 3,
    //   backoff: {
    //     type: 'exponential',
    //     delay: 2000,
    //   },
    // });

    // Store immediately for real-time needs
    const activity = this.activityRepository.create(data);
    return await this.activityRepository.save(activity);
  }

  async getUserStats(userId: string, days = 30) {
    // const cacheKey = `user_stats:${userId}:${days}`;
    // const cached = await this.cacheManager.get(cacheKey);
    // if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.createdAt >= :startDate', { startDate })
      .orderBy('activity.createdAt', 'DESC')
      .getMany();

    const stats = {
      totalActivities: activities.length,
      recipeViews: activities.filter(a => a.activityType === 'recipe_view').length,
      searches: activities.filter(a => a.activityType === 'search').length,
      favorites: activities.filter(a => a.activityType === 'favorite').length,
      ratings: activities.filter(a => a.activityType === 'rating').length,
      dailyActivity: this.groupActivitiesByDay(activities),
      mostViewedRecipes: await this.getMostViewedRecipes(userId, days),
    };

    // await this.cacheManager.set(cacheKey, stats, 5 * 60 * 1000);
    return stats;
  }

  async getPopularRecipes(languageCode = 'tr', days = 7, limit = 10) {
    // const cacheKey = `popular_recipes:${languageCode}:${days}:${limit}`;
    // const cached = await this.cacheManager.get(cacheKey);
    // if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const popular = await this.activityRepository
      .createQueryBuilder('activity')
      .select('activity.recipeId', 'recipeId')
      .addSelect('COUNT(*)', 'viewCount')
      .leftJoin('activity.recipe', 'recipe')
      .leftJoin('recipe.translations', 'translation', 'translation.languageCode = :lang', { lang: languageCode })
      .where('activity.activityType = :type', { type: 'recipe_view' })
      .andWhere('activity.createdAt >= :startDate', { startDate })
      .andWhere('recipe.isPublished = true')
      .groupBy('activity.recipeId')
      .orderBy('COUNT(*)', 'DESC')
      .limit(limit)
      .getRawMany();

    const recipeIds = popular.map(p => p.recipeId);
    if (recipeIds.length === 0) return [];

    const recipes = await this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.translations', 'translation', 'translation.languageCode = :lang', { lang: languageCode })
      .leftJoinAndSelect('recipe.media', 'media', 'media.sortOrder = 0')
      .where('recipe.id IN (:...ids)', { ids: recipeIds })
      .getMany();

    const result = popular.map(p => ({
      ...recipes.find(r => r.id === p.recipeId),
      viewCount: parseInt(p.viewCount),
    }));

    // await this.cacheManager.set(cacheKey, result, 10 * 60 * 1000);
    return result;
  }

  async getSystemStats(): Promise<AnalyticsStats> {
    // const cacheKey = 'system_stats';
    // const cached = await this.cacheManager.get(cacheKey);
    // if (cached) return cached;

    const [totalUsers, totalRecipes, totalActivities] = await Promise.all([
      this.userRepository.count({ where: { isActive: true } }),
      this.recipeRepository.count({ where: { isPublished: true } }),
      this.activityRepository.count(),
    ]);

    const popularRecipes = await this.getPopularRecipes('tr', 7, 5);
    const userEngagement = await this.getUserEngagementStats();
    const dailyStats = await this.getDailyStats(30);

    const stats: AnalyticsStats = {
      totalUsers,
      totalRecipes,
      totalActivities,
      popularRecipes,
      userEngagement,
      dailyStats,
    };

    // await this.cacheManager.set(cacheKey, stats, 15 * 60 * 1000);
    return stats;
  }

  private groupActivitiesByDay(activities: UserActivity[]) {
    const grouped = activities.reduce((acc, activity) => {
      const date = activity.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private async getMostViewedRecipes(userId: string, days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.activityRepository
      .createQueryBuilder('activity')
      .select('activity.recipeId', 'recipeId')
      .addSelect('COUNT(*)', 'viewCount')
      .leftJoin('activity.recipe', 'recipe')
      .leftJoin('recipe.translations', 'translation', 'translation.languageCode = :lang', { lang: 'tr' })
      .addSelect('translation.title', 'title')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.activityType = :type', { type: 'recipe_view' })
      .andWhere('activity.createdAt >= :startDate', { startDate })
      .groupBy('activity.recipeId')
      .addGroupBy('translation.title')
      .orderBy('COUNT(*)', 'DESC')
      .limit(5)
      .getRawMany();
  }

  private async getUserEngagementStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await this.activityRepository
      .createQueryBuilder('activity')
      .select('COUNT(DISTINCT activity.userId)', 'count')
      .where('activity.createdAt >= :date', { date: thirtyDaysAgo })
      .getRawOne();

    const avgSessionDuration = await this.activityRepository
      .createQueryBuilder('activity')
      .select('AVG(EXTRACT(EPOCH FROM (MAX(activity.createdAt) - MIN(activity.createdAt))))', 'avgDuration')
      .where('activity.createdAt >= :date', { date: thirtyDaysAgo })
      .groupBy('activity.userId')
      .getRawOne();

    return {
      activeUsers: parseInt(activeUsers.count),
      avgSessionDuration: Math.round(parseInt(avgSessionDuration?.avgDuration || '0') / 60), // minutes
    };
  }

  private async getDailyStats(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.activityRepository
      .createQueryBuilder('activity')
      .select('DATE(activity.createdAt)', 'date')
      .addSelect('COUNT(*)', 'totalActivities')
      .addSelect('COUNT(DISTINCT activity.userId)', 'uniqueUsers')
      .where('activity.createdAt >= :startDate', { startDate })
      .groupBy('DATE(activity.createdAt)')
      .orderBy('DATE(activity.createdAt)', 'ASC')
      .getRawMany();
  }
} 