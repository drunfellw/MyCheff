const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123',
  database: 'postgres',
});

async function addSampleData() {
  try {
    console.log('🌱 Adding sample data to database...\n');
    
    const client = await pool.connect();
    
    // Add languages
    console.log('📝 Adding languages...');
    await client.query(`
      INSERT INTO mycheff.languages (code, name, native_name, is_active, is_default) VALUES
      ('tr', 'Turkish', 'Türkçe', true, true),
      ('en', 'English', 'English', true, false),
      ('es', 'Spanish', 'Español', true, false),
      ('fr', 'French', 'Français', true, false)
      ON CONFLICT (code) DO UPDATE SET
        name = EXCLUDED.name,
        native_name = EXCLUDED.native_name,
        is_active = EXCLUDED.is_active,
        is_default = EXCLUDED.is_default;
    `);
    
    // Add categories
    console.log('📝 Adding categories...');
    const categoryIds = [];
    
    // Insert categories and get their IDs
    const categoryResult = await client.query(`
      INSERT INTO mycheff.categories (icon, color, sort_order, is_active) VALUES
      ('utensils', '#FF5722', 1, true),
      ('cookie', '#E91E63', 2, true),
      ('coffee', '#2196F3', 3, true),
      ('leaf', '#4CAF50', 4, true)
      RETURNING id;
    `);
    
    categoryResult.rows.forEach(row => categoryIds.push(row.id));
    
    // Add category translations
    console.log('📝 Adding category translations...');
    await client.query(`
      INSERT INTO mycheff.category_translations (category_id, language_code, name) VALUES
      ($1, 'tr', 'Ana Yemekler'),
      ($1, 'en', 'Main Dishes'),
      ($2, 'tr', 'Tatlılar'),
      ($2, 'en', 'Desserts'),
      ($3, 'tr', 'İçecekler'),
      ($3, 'en', 'Beverages'),
      ($4, 'tr', 'Vegan'),
      ($4, 'en', 'Vegan')
      ON CONFLICT (category_id, language_code) DO UPDATE SET
        name = EXCLUDED.name;
    `, [categoryIds[0], categoryIds[1], categoryIds[2], categoryIds[3]]);
    
    // Add sample users
    console.log('📝 Adding sample users...');
    await client.query(`
      INSERT INTO mycheff.users (email, username, password_hash, full_name, preferred_language, is_active, is_verified, is_premium) VALUES
      ('admin@mycheff.com', 'admin', '$2b$10$dummy.hash.for.testing', 'Admin User', 'tr', true, true, true),
      ('test@mycheff.com', 'testuser', '$2b$10$dummy.hash.for.testing', 'Test User', 'en', true, true, false),
      ('chef@mycheff.com', 'masterchef', '$2b$10$dummy.hash.for.testing', 'Master Chef', 'tr', true, true, true)
      ON CONFLICT (email) DO UPDATE SET
        username = EXCLUDED.username,
        password_hash = EXCLUDED.password_hash,
        full_name = EXCLUDED.full_name,
        preferred_language = EXCLUDED.preferred_language,
        is_active = EXCLUDED.is_active,
        is_verified = EXCLUDED.is_verified,
        is_premium = EXCLUDED.is_premium;
    `);
    
    // Add ingredients
    console.log('📝 Adding sample ingredients...');
    const ingredientResult = await client.query(`
      INSERT INTO mycheff.ingredients (default_unit, is_active) VALUES
      ('gram', true),
      ('adet', true),
      ('su bardağı', true),
      ('çay kaşığı', true),
      ('yemek kaşığı', true)
      RETURNING id;
    `);
    
    const ingredientIds = ingredientResult.rows.map(row => row.id);
    
    // Add ingredient translations
    await client.query(`
      INSERT INTO mycheff.ingredient_translations (ingredient_id, language_code, name) VALUES
      ($1, 'tr', 'Un'),
      ($1, 'en', 'Flour'),
      ($2, 'tr', 'Yumurta'),
      ($2, 'en', 'Egg'),
      ($3, 'tr', 'Süt'),
      ($3, 'en', 'Milk'),
      ($4, 'tr', 'Tuz'),
      ($4, 'en', 'Salt'),
      ($5, 'tr', 'Şeker'),
      ($5, 'en', 'Sugar')
      ON CONFLICT (ingredient_id, language_code) DO UPDATE SET
        name = EXCLUDED.name;
    `, ingredientIds);

    client.release();
    await pool.end();
    console.log('\n🎉 Sample data added successfully!');
    console.log('\n📊 Summary:');
    console.log('  - 4 languages added');
    console.log('  - 4 categories with translations added');
    console.log('  - 3 sample users added');
    console.log('  - 5 ingredients with translations added');
  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
    process.exit(1);
  }
}

addSampleData(); 