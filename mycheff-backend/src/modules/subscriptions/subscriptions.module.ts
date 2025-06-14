import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from '../../entities/subscription-plan.entity';
import { SubscriptionPlanTranslation } from '../../entities/subscription-plan-translation.entity';
import { UserSubscription } from '../../entities/user-subscription.entity';
import { User } from '../../entities/user.entity';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { SubscriptionsService } from './services/subscriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionPlan,
      SubscriptionPlanTranslation,
      UserSubscription,
      User,
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {} 