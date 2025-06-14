import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class DatabaseService {
  private client: Client;
  private isConnected: boolean = false;

  constructor() {
    this.client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '123',
      database: 'mycheff',
    });
  }

  async connect() {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.client.end();
      this.isConnected = false;
    }
  }

  async query(text: string, params?: any[]) {
    await this.connect();
    return this.client.query(text, params);
  }

  // Test database connection
  async testConnection() {
    try {
      await this.connect();
      const result = await this.query('SELECT current_database(), current_user, version()');
      return {
        success: true,
        data: result.rows[0],
        message: 'Database connection successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Database connection failed'
      };
    }
  }

  // Get all recipes from database
  async getAllRecipes() {
    try {
      await this.connect();
      const result = await this.query(`
        SET search_path TO mycheff;
        SELECT 
          r.id,
          rt.title,
          rt.description,
          r.cooking_time_minutes,
          r.prep_time_minutes,
          r.difficulty_level,
          r.serving_size,
          r.is_published,
          r.is_premium,
          r.created_at
        FROM recipes r
        LEFT JOIN recipe_translations rt ON r.id = rt.recipe_id
        WHERE rt.language_code = 'tr' OR rt.language_code IS NULL
        LIMIT 10;
      `);
      
      return {
        success: true,
        data: result.rows,
        message: 'Recipes retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve recipes'
      };
    }
  }

  // Get all categories
  async getAllCategories() {
    try {
      await this.connect();
      const result = await this.query(`
        SET search_path TO mycheff;
        SELECT 
          c.id,
          ct.name,
          c.icon,
          c.color,
          c.sort_order,
          c.is_active
        FROM categories c
        LEFT JOIN category_translations ct ON c.id = ct.category_id
        WHERE ct.language_code = 'tr' OR ct.language_code IS NULL
        ORDER BY c.sort_order;
      `);
      
      return {
        success: true,
        data: result.rows,
        message: 'Categories retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve categories'
      };
    }
  }

  // Get all ingredients
  async getAllIngredients() {
    try {
      await this.connect();
      const result = await this.query(`
        SET search_path TO mycheff;
        SELECT 
          i.id,
          it.name,
          i.default_unit,
          i.image,
          i.is_active,
          i.nutritional_info
        FROM ingredients i
        LEFT JOIN ingredient_translations it ON i.id = it.ingredient_id
        WHERE it.language_code = 'tr' OR it.language_code IS NULL
        LIMIT 20;
      `);
      
      return {
        success: true,
        data: result.rows,
        message: 'Ingredients retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve ingredients'
      };
    }
  }

  // Get schema info
  async getSchemaInfo() {
    try {
      await this.connect();
      const result = await this.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'mycheff' 
        ORDER BY table_name;
      `);
      
      return {
        success: true,
        data: result.rows,
        message: 'Schema info retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve schema info'
      };
    }
  }
} 