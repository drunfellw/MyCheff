import { DataSource } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CategoryTranslation } from '../../entities/category-translation.entity';

export async function seedCategories(dataSource: DataSource) {
  const categoryRepository = dataSource.getRepository(Category);
  const translationRepository = dataSource.getRepository(CategoryTranslation);

  const categories = [
    {
      translations: {
        tr: 'Kahvaltı',
        en: 'Breakfast',
        es: 'Desayuno',
        fr: 'Petit-déjeuner',
      },
    },
    {
      translations: {
        tr: 'Ana Yemekler',
        en: 'Main Dishes',
        es: 'Platos Principales',
        fr: 'Plats Principaux',
      },
    },
    {
      translations: {
        tr: 'Salatalar',
        en: 'Salads',
        es: 'Ensaladas',
        fr: 'Salades',
      },
    },
    {
      translations: {
        tr: 'Et Yemekleri',
        en: 'Meat Dishes',
        es: 'Platos de Carne',
        fr: 'Plats de Viande',
      },
    },
    {
      translations: {
        tr: 'Balık ve Deniz Ürünleri',
        en: 'Fish & Seafood',
        es: 'Pescado y Mariscos',
        fr: 'Poisson et Fruits de Mer',
      },
    },
    {
      translations: {
        tr: 'Tatlılar',
        en: 'Desserts',
        es: 'Postres',
        fr: 'Desserts',
      },
    },
    {
      translations: {
        tr: 'İçecekler',
        en: 'Beverages',
        es: 'Bebidas',
        fr: 'Boissons',
      },
    },
    {
      translations: {
        tr: 'Sandviçler',
        en: 'Sandwiches',
        es: 'Sándwiches',
        fr: 'Sandwichs',
      },
    },
    {
      translations: {
        tr: 'Pizza ve Makarna',
        en: 'Pizza & Pasta',
        es: 'Pizza y Pasta',
        fr: 'Pizza et Pâtes',
      },
    },
    {
      translations: {
        tr: 'Atıştırmalıklar',
        en: 'Snacks',
        es: 'Aperitivos',
        fr: 'Collations',
      },
    },
  ];

  for (const categoryData of categories) {
    const { translations } = categoryData;
    
    // Check if category exists by checking translations
    const existingTranslation = await translationRepository.findOne({
      where: { 
        languageCode: 'tr',
        name: translations.tr,
      },
    });

    if (!existingTranslation) {
      const category = categoryRepository.create({});
      const savedCategory = await categoryRepository.save(category);

      // Create translations
      for (const [languageCode, name] of Object.entries(translations)) {
        const translation = translationRepository.create({
          categoryId: savedCategory.id,
          languageCode,
          name,
        });
        await translationRepository.save(translation);
      }

      console.log(`Created category: ${translations.tr}`);
    }
  }
} 