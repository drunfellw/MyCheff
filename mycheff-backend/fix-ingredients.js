// CRITICAL FIX: Add ingredient translations for app to work
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '123',
});

async function fixIngredients() {
  console.log('🚑 EMERGENCY FIX: Adding ingredient translations...');

  try {
    // Get existing ingredients (no name column, just id)
    const ingredients = await pool.query('SELECT id FROM mycheff.ingredients');
    console.log(`Found ${ingredients.rows.length} ingredients`);

    // Get existing translations
    const existingTranslations = await pool.query('SELECT ingredient_id, name FROM mycheff.ingredient_translations');
    console.log(`Found ${existingTranslations.rows.length} existing translations`);

    // Add common missing ingredients
    const commonIngredients = [
      { tr: 'Domates', en: 'Tomato' },
      { tr: 'Soğan', en: 'Onion' },
      { tr: 'Sarımsak', en: 'Garlic' },
      { tr: 'Biber', en: 'Pepper' },
      { tr: 'Patates', en: 'Potato' },
      { tr: 'Havuç', en: 'Carrot' },
      { tr: 'Salatalık', en: 'Cucumber' },
      { tr: 'Peynir', en: 'Cheese' },
      { tr: 'Tavuk', en: 'Chicken' },
      { tr: 'Pirinç', en: 'Rice' },
      { tr: 'Makarna', en: 'Pasta' },
      { tr: 'Ekmek', en: 'Bread' },
      { tr: 'Tereyağı', en: 'Butter' },
      { tr: 'Zeytinyağı', en: 'Olive Oil' },
      { tr: 'Mantar', en: 'Mushroom' },
      { tr: 'Muz', en: 'Banana' },
      { tr: 'Elma', en: 'Apple' },
      { tr: 'Limon', en: 'Lemon' },
      { tr: 'Nar', en: 'Pomegranate' },
      { tr: 'Portakal', en: 'Orange' },
    ];

    // Add missing common ingredients
    for (const ing of commonIngredients) {
      // Check if already exists
      const existing = await pool.query(
        'SELECT id FROM mycheff.ingredient_translations WHERE name = $1',
        [ing.tr]
      );

      if (existing.rows.length === 0) {
        // Create ingredient
        const newIngredient = await pool.query(
          'INSERT INTO mycheff.ingredients (default_unit, is_active) VALUES ($1, $2) RETURNING id',
          ['adet', true]
        );

        const ingredientId = newIngredient.rows[0].id;

        // Add Turkish translation
        await pool.query(
          'INSERT INTO mycheff.ingredient_translations (ingredient_id, language_code, name, aliases) VALUES ($1, $2, $3, $4)',
          [ingredientId, 'tr', ing.tr, '{}']
        );

        // Add English translation
        await pool.query(
          'INSERT INTO mycheff.ingredient_translations (ingredient_id, language_code, name, aliases) VALUES ($1, $2, $3, $4)',
          [ingredientId, 'en', ing.en, '{}']
        );

        console.log(`✅ Added ingredient: ${ing.tr} / ${ing.en}`);
      } else {
        console.log(`⚪ Already exists: ${ing.tr}`);
      }
    }

    console.log('🎉 Ingredient translations fixed!');
    
    // Test search
    const searchTest = await pool.query(
      'SELECT i.id, it.name FROM mycheff.ingredients i JOIN mycheff.ingredient_translations it ON i.id = it.ingredient_id WHERE LOWER(it.name) LIKE LOWER($1)',
      ['%domates%']
    );
    
    console.log(`Search test result: Found ${searchTest.rows.length} results for "domates"`);
    
    // Show all available ingredients for debugging
    const allIngredients = await pool.query(
      'SELECT it.name FROM mycheff.ingredient_translations it WHERE it.language_code = $1 ORDER BY it.name',
      ['tr']
    );
    
    console.log('Available Turkish ingredients:');
    allIngredients.rows.forEach(row => console.log(`  - ${row.name}`));
    
  } catch (error) {
    console.error('Error fixing ingredients:', error);
  } finally {
    await pool.end();
  }
}

fixIngredients(); 