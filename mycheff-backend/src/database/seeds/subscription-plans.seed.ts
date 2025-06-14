import { DataSource } from 'typeorm';
import { SubscriptionPlan } from '../../entities/subscription-plan.entity';

export async function seedSubscriptionPlans(dataSource: DataSource) {
  const planRepository = dataSource.getRepository(SubscriptionPlan);

  const plans = [
    {
      name: 'Monthly Premium',
      durationMonths: 1,
      price: 29.99,
      description: 'Monthly premium membership',
      features: {
        premiumRecipes: true,
        adFree: true,
        unlimitedFavorites: true,
        calorieTracking: true,
      },
      isActive: true,
    },
    {
      name: '6-Month Premium',
      durationMonths: 6,
      price: 149.99,
      description: '6-month premium membership with 17% discount',
      features: {
        premiumRecipes: true,
        adFree: true,
        unlimitedFavorites: true,
        calorieTracking: true,
        discount: '17%',
      },
      isActive: true,
    },
    {
      name: 'Annual Premium',
      durationMonths: 12,
      price: 249.99,
      description: 'Annual premium membership with 30% discount',
      features: {
        premiumRecipes: true,
        adFree: true,
        unlimitedFavorites: true,
        calorieTracking: true,
        discount: '30%',
        priority: true,
      },
      isActive: true,
    },
  ];

  for (const planData of plans) {
    const existingPlan = await planRepository.findOne({
      where: { name: planData.name },
    });

    if (!existingPlan) {
      const plan = planRepository.create(planData);
      await planRepository.save(plan);
      console.log(`Created subscription plan: ${planData.name}`);
    }
  }
} 