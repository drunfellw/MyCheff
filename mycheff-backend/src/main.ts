import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { createConnection } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:19006', 'exp://192.168.1.100:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
    credentials: true,
  });

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Health check endpoint (before API prefix)
  app.getHttpAdapter().get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Backend is running', timestamp: new Date().toISOString() });
  });

  // Admin endpoint to load sample data (before API prefix)
  app.getHttpAdapter().post('/admin/load-sample-data', async (req: Request, res: Response) => {
    try {
      const dataSource = app.get('DataSource');
      
      // Read and execute SQL script
      const sqlScript = fs.readFileSync(join(__dirname, '..', 'create_sample_recipes.sql'), 'utf8');
      await dataSource.query(sqlScript);
      
      res.json({ 
        success: true, 
        message: 'Sample data loaded successfully!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading sample data:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to load sample data: ' + error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // API prefix (set after admin endpoints)
  app.setGlobalPrefix('api/v1');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('MyCheff API')
    .setDescription('Professional Recipe Management API with Multi-language Support')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('recipes', 'Recipe management')
    .addTag('categories', 'Category management')
    .addTag('ingredients', 'Ingredient management')
    .addTag('favorites', 'User favorites')
    .addTag('subscriptions', 'Subscription management')
    .addTag('languages', 'Language management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 MyCheff API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
