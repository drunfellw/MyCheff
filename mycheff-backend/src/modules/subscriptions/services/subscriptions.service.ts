import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../../../entities/subscription-plan.entity';
import { SubscriptionPlanTranslation } from '../../../entities/subscription-plan-translation.entity';
import { UserSubscription } from '../../../entities/user-subscription.entity';
import { User } from '../../../entities/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(SubscriptionPlanTranslation)
    private readonly planTranslationRepository: Repository<SubscriptionPlanTranslation>,
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllPlans(languageCode: string = 'tr') {
    const plans = await this.planRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .where('plan.isActive = true')
      .orderBy('plan.sortOrder', 'ASC')
      .getMany();

    return {
      success: true,
      data: plans.map(plan => ({
        id: plan.id,
        name: plan.translations[0]?.name || plan.name,
        description: plan.translations[0]?.description || plan.description,
        durationMonths: plan.durationMonths,
        price: plan.price,
        features: plan.features,
        isActive: plan.isActive,
        sortOrder: plan.sortOrder,
      })),
      message: 'Subscription plans retrieved successfully',
    };
  }

  async getPlanById(id: string, languageCode: string = 'tr') {
    const plan = await this.planRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.translations', 'translation', 'translation.languageCode = :languageCode', { languageCode })
      .where('plan.id = :id', { id })
      .getOne();

    if (!plan) {
      return {
        success: false,
        message: 'Subscription plan not found',
      };
    }

    return {
      success: true,
      data: {
        id: plan.id,
        name: plan.translations[0]?.name || plan.name,
        description: plan.translations[0]?.description || plan.description,
        durationMonths: plan.durationMonths,
        price: plan.price,
        features: plan.features,
        isActive: plan.isActive,
        sortOrder: plan.sortOrder,
      },
      message: 'Subscription plan retrieved successfully',
    };
  }

  async createPlan(data: Partial<SubscriptionPlan>) {
    const plan = this.planRepository.create(data);
    const savedPlan = await this.planRepository.save(plan);

    return {
      success: true,
      data: savedPlan,
      message: 'Subscription plan created successfully',
    };
  }

  async updatePlan(id: string, data: Partial<SubscriptionPlan>) {
    const plan = await this.planRepository.findOne({ where: { id } });

    if (!plan) {
      return {
        success: false,
        message: 'Subscription plan not found',
      };
    }

    Object.assign(plan, data);
    const updatedPlan = await this.planRepository.save(plan);

    return {
      success: true,
      data: updatedPlan,
      message: 'Subscription plan updated successfully',
    };
  }

  async deletePlan(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });

    if (!plan) {
      return {
        success: false,
        message: 'Subscription plan not found',
      };
    }

    await this.planRepository.remove(plan);

    return {
      success: true,
      message: 'Subscription plan deleted successfully',
    };
  }

  async checkUserPremiumStatus(userId: string) {
    const activeSubscription = await this.userSubscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.userId = :userId', { userId })
      .andWhere('subscription.endDate > :now', { now: new Date() })
      .andWhere('subscription.paymentStatus = :status', { status: 'completed' })
      .getOne();

    return {
      success: true,
      data: {
        isPremium: !!activeSubscription,
        subscription: activeSubscription || null,
      },
      message: 'Premium status checked successfully',
    };
  }
} 