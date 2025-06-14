import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { seedLanguages } from './languages.seed';
import { seedSubscriptionPlans } from './subscription-plans.seed';
import { seedCategories } from './categories.seed';
import { seedUsers } from './users.seed';

async function runSeeds() {
  const configService = new ConfigService();
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: configService.get('DATABASE_HOST', 'localhost'),
    port: configService.get('DATABASE_PORT', 5432),
    username: configService.get('DATABASE_USERNAME', 'postgres'),
    password: configService.get('DATABASE_PASSWORD', '123'),
    database: configService.get('DATABASE_NAME', 'postgres'),
    schema: 'mycheff',
    entities: [__dirname + '/../../entities/*.entity{.ts,.js}'],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected successfully');

    console.log('🌱 Running seeds...');
    
    await seedLanguages(dataSource);
    await seedSubscriptionPlans(dataSource);
    await seedCategories(dataSource);
    await seedUsers(dataSource);
    
    console.log('🎉 All seeds completed successfully');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds(); 