import { DataSource } from 'typeorm';
import { Recipe } from '../../entities/recipe.entity';
import { RecipeTranslation } from '../../entities/recipe-translation.entity';
import { RecipeIngredient } from '../../entities/recipe-ingredient.entity';
import { Category } from '../../entities/category.entity';
import { Ingredient } from '../../entities/ingredient.entity';
import { DifficultyLevel } from '../../entities/recipe.entity';

export async function seedRecipes(dataSource: DataSource) {
  const recipeRepository = dataSource.getRepository(Recipe);
  const recipeTranslationRepository = dataSource.getRepository(RecipeTranslation);
  const recipeIngredientRepository = dataSource.getRepository(RecipeIngredient);
  const categoryRepository = dataSource.getRepository(Category);
  const ingredientRepository = dataSource.getRepository(Ingredient);

  // Get existing categories by Turkish name
  const categories = await categoryRepository
    .createQueryBuilder('category')
    .leftJoinAndSelect('category.translations', 'translation')
    .where('translation.languageCode = :lang', { lang: 'tr' })
    .getMany();

  const categoryMap = new Map();
  categories.forEach(cat => {
    const trTranslation = cat.translations?.find(t => t.languageCode === 'tr');
    if (trTranslation) {
      categoryMap.set(trTranslation.name, cat.id);
    }
  });

  // Sample Turkish recipes data
  const recipesData = [
    {
      cookingTimeMinutes: 30,
      difficultyLevel: DifficultyLevel.EASY,
      isFeatured: true,
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      categories: ['Kahvaltı'],
      translations: [
        {
          languageCode: 'tr',
          title: 'Menemen',
          description: 'Geleneksel Türk kahvaltısının vazgeçilmezi olan nefis menemen tarifi.',
          instructions: [
            'Domates ve biberleri küçük küçük doğrayın',
            'Tavada tereyağını eritin',
            'Domates ve biberleri kavurun',
            'Çırpılmış yumurtaları ekleyin',
            'Karıştırarak pişirin',
            'Baharatları ekleyip servis yapın'
          ]
        },
        {
          languageCode: 'en',
          title: 'Turkish Menemen',
          description: 'Traditional Turkish scrambled eggs with tomatoes and peppers.',
          instructions: [
            'Dice tomatoes and peppers',
            'Melt butter in pan',
            'Sauté tomatoes and peppers',
            'Add beaten eggs',
            'Cook while stirring',
            'Season and serve'
          ]
        }
      ],
      ingredients: ['Domates', 'Biber', 'Yumurta', 'Tereyağı']
    },
    {
      cookingTimeMinutes: 45,
      difficultyLevel: DifficultyLevel.MEDIUM,
      isFeatured: true,
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
      categories: ['Ana Yemekler'],
      translations: [
        {
          languageCode: 'tr',
          title: 'Karnıyarık',
          description: 'İçi doldurulmuş patlıcanlardan oluşan geleneksel Türk yemeği.',
          instructions: [
            'Patlıcanları boyuna yarın',
            'Tuzlayıp 30 dakika bekletin',
            'Kıymayı soğan ile kavurun',
            'Patlıcanları kızartın',
            'İç harcını doldurun',
            'Fırında pişirin'
          ]
        },
        {
          languageCode: 'en',
          title: 'Stuffed Eggplant',
          description: 'Traditional Turkish stuffed eggplant with meat filling.',
          instructions: [
            'Cut eggplants lengthwise',
            'Salt and wait 30 minutes',
            'Sauté meat with onions',
            'Fry eggplants',
            'Stuff with filling',
            'Bake in oven'
          ]
        }
      ],
      ingredients: ['Patlıcan', 'Kıyma', 'Soğan', 'Domates']
    },
    {
      cookingTimeMinutes: 20,
      difficultyLevel: DifficultyLevel.EASY,
      isFeatured: false,
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
      categories: ['Salatalar'],
      translations: [
        {
          languageCode: 'tr',
          title: 'Çoban Salatası',
          description: 'Taze sebzelerle hazırlanan klasik Türk salatası.',
          instructions: [
            'Domates, salatalık, soğanı doğrayın',
            'Maydanozu ince kıyın',
            'Limon suyu, zeytinyağı ekleyin',
            'Tuz, karabiber ile tatlandırın',
            'Karıştırıp servis yapın'
          ]
        },
        {
          languageCode: 'en',
          title: 'Turkish Shepherd Salad',
          description: 'Classic Turkish salad with fresh vegetables.',
          instructions: [
            'Dice tomatoes, cucumber, onion',
            'Chop parsley finely',
            'Add lemon juice, olive oil',
            'Season with salt and pepper',
            'Mix and serve'
          ]
        }
      ],
      ingredients: ['Domates', 'Salatalık', 'Soğan', 'Maydanoz']
    },
    {
      cookingTimeMinutes: 90,
      difficultyLevel: DifficultyLevel.HARD,
      isFeatured: true,
      isPremium: true,
      imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop',
      categories: ['Ana Yemekler'],
      translations: [
        {
          languageCode: 'tr',
          title: 'İskender Kebap',
          description: 'Yogurt ve tereyağı soslu nefis Bursa kebabı.',
          instructions: [
            'Döner etini ince dilimleyin',
            'Pide ekmeğini kesin',
            'Domates sosunu hazırlayın',
            'Tereyağını eritin',
            'Tabakta döşeyin',
            'Yogurt ve sos ile servis yapın'
          ]
        },
        {
          languageCode: 'en',
          title: 'Iskender Kebab',
          description: 'Famous Turkish kebab with yogurt and butter sauce.',
          instructions: [
            'Slice döner meat thinly',
            'Cut pita bread',
            'Prepare tomato sauce',
            'Melt butter',
            'Arrange on plate',
            'Serve with yogurt and sauce'
          ]
        }
      ],
      ingredients: ['Et', 'Pide', 'Yogurt', 'Tereyağı']
    },
    {
      cookingTimeMinutes: 60,
      difficultyLevel: DifficultyLevel.MEDIUM,
      isFeatured: false,
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=800&h=600&fit=crop',
      categories: ['Ana Yemekler'],
      translations: [
        {
          languageCode: 'tr',
          title: 'Mantı',
          description: 'Küçük hamur paketlerinde kıymalı geleneksel Türk yemeği.',
          instructions: [
            'Hamuru açın ve kareleyin',
            'Kıyma harcını hazırlayın',
            'Hamur karelerine doldurun',
            'Kaynayan suda pişirin',
            'Yogurt sosunu hazırlayın',
            'Tereyağı ile servis yapın'
          ]
        },
        {
          languageCode: 'en',
          title: 'Turkish Manti',
          description: 'Traditional Turkish dumplings with meat filling.',
          instructions: [
            'Roll out dough and cut squares',
            'Prepare meat filling',
            'Fill dough squares',
            'Cook in boiling water',
            'Prepare yogurt sauce',
            'Serve with butter'
          ]
        }
      ],
      ingredients: ['Un', 'Kıyma', 'Yogurt', 'Tereyağı']
    },
    {
      cookingTimeMinutes: 25,
      difficultyLevel: DifficultyLevel.EASY,
      isFeatured: true,
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop',
      categories: ['Pizza ve Makarna'],
      translations: [
        {
          languageCode: 'tr',
          title: 'Domates Soslu Makarna',
          description: 'Basit ve lezzetli domates soslu spagetti.',
          instructions: [
            'Makarnayı haşlayın',
            'Domates sosunu hazırlayın',
            'Sarımsak ve soğanı kavurun',
            'Makarna ile karıştırın',
            'Fesleğen ekleyin',
            'Parmesan ile servis yapın'
          ]
        },
        {
          languageCode: 'en',
          title: 'Spaghetti with Tomato Sauce',
          description: 'Simple and delicious spaghetti with tomato sauce.',
          instructions: [
            'Cook pasta',
            'Prepare tomato sauce',
            'Sauté garlic and onion',
            'Mix with pasta',
            'Add basil',
            'Serve with parmesan'
          ]
        }
      ],
      ingredients: ['Makarna', 'Domates', 'Sarımsak', 'Fesleğen']
    },
    {
      cookingTimeMinutes: 40,
      difficultyLevel: DifficultyLevel.MEDIUM,
      isFeatured: false,
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
      categories: ['Ana Yemekler'],
      translations: [
        {
          languageCode: 'tr',
          title: 'Tavuk Pilav',
          description: 'Baharatlı tavuklu nefis pilav.',
          instructions: [
            'Tavukları marine edin',
            'Pirinçleri yıkayın',
            'Tavukları pişirin',
            'Pirinçleri kavurun',
            'Su ve baharatları ekleyin',
            'Birlikte pişirin'
          ]
        },
        {
          languageCode: 'en',
          title: 'Chicken Rice Pilaf',
          description: 'Delicious spiced chicken with rice.',
          instructions: [
            'Marinate chicken',
            'Wash rice',
            'Cook chicken',
            'Sauté rice',
            'Add water and spices',
            'Cook together'
          ]
        }
      ],
      ingredients: ['Tavuk', 'Pirinç', 'Havuç', 'Soğan']
    },
    {
      cookingTimeMinutes: 15,
      difficultyLevel: DifficultyLevel.EASY,
      isFeatured: false,
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
      categories: ['İçecekler'],
      translations: [
        {
          languageCode: 'tr',
          title: 'Türk Çayı',
          description: 'Geleneksel çaydanlıkta demlenmiş Türk çayı.',
          instructions: [
            'Suyu kaynatın',
            'Çaydanlığa çay yaprakları koyun',
            'Kaynar su ile demlendirin',
            '10 dakika bekletin',
            'İnce belli bardaklarda servis yapın',
            'Şeker ile tatlandırın'
          ]
        },
        {
          languageCode: 'en',
          title: 'Turkish Tea',
          description: 'Traditional Turkish tea brewed in double teapot.',
          instructions: [
            'Boil water',
            'Put tea leaves in teapot',
            'Brew with boiling water',
            'Wait 10 minutes',
            'Serve in tulip glasses',
            'Sweeten with sugar'
          ]
        }
      ],
      ingredients: ['Çay', 'Su', 'Şeker']
    },
    {
      cookingTimeMinutes: 50,
      difficultyLevel: DifficultyLevel.MEDIUM,
      isFeatured: true,
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
      categories: ['Et Yemekleri'],
      translations: [
        {
          languageCode: 'tr',
          title: 'Köfte',
          description: 'Baharatlı et köftesi ve garnitürleri.',
          instructions: [
            'Kıymayı baharatlarla yoğurun',
            'Köfte şekli verin',
            'Tavada kızartın',
            'Soğan ve domatesi kavurun',
            'Köfteleri ekleyin',
            'Suyu ilave edip pişirin'
          ]
        },
        {
          languageCode: 'en',
          title: 'Turkish Meatballs',
          description: 'Spiced meatballs with vegetables.',
          instructions: [
            'Knead meat with spices',
            'Shape into meatballs',
            'Fry in pan',
            'Sauté onion and tomato',
            'Add meatballs',
            'Add water and cook'
          ]
        }
      ],
      ingredients: ['Kıyma', 'Soğan', 'Domates', 'Maydanoz']
    },
    {
      cookingTimeMinutes: 35,
      difficultyLevel: DifficultyLevel.EASY,
      isFeatured: false,
      isPremium: false,
      imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop',
      categories: ['Tatlılar'],
      translations: [
        {
          languageCode: 'tr',
          title: 'Sütlaç',
          description: 'Geleneksel fırın sütlacı.',
          instructions: [
            'Pirinçleri haşlayın',
            'Süt ve şekeri ekleyin',
            'Karıştırarak pişirin',
            'Fırın kaplarına doldurun',
            'Fırında üstünü kızartın',
            'Soğuk servis yapın'
          ]
        },
        {
          languageCode: 'en',
          title: 'Turkish Rice Pudding',
          description: 'Traditional oven-baked rice pudding.',
          instructions: [
            'Cook rice',
            'Add milk and sugar',
            'Cook while stirring',
            'Pour into baking dishes',
            'Brown top in oven',
            'Serve cold'
          ]
        }
      ],
      ingredients: ['Pirinç', 'Süt', 'Şeker', 'Vanilya']
    }
  ];

  // Create recipes
  for (const recipeData of recipesData) {
    const { categories: categoryNames, translations, ingredients: ingredientNames, ...baseRecipe } = recipeData;

    // Check if recipe already exists
    const existingRecipe = await recipeTranslationRepository.findOne({
      where: { 
        title: translations[0].title,
        languageCode: 'tr'
      }
    });

    if (!existingRecipe) {
      // Create recipe
      const recipe = recipeRepository.create(baseRecipe);
      const savedRecipe = await recipeRepository.save(recipe);

      // Add categories
      if (categoryNames.length > 0) {
        const categoryIds = categoryNames.map(name => categoryMap.get(name)).filter(id => id);
        if (categoryIds.length > 0) {
          const recipeCategories = await categoryRepository.findByIds(categoryIds);
          savedRecipe.categories = recipeCategories;
          await recipeRepository.save(savedRecipe);
        }
      }

      // Create translations
      for (const translationData of translations) {
        const translation = recipeTranslationRepository.create({
          recipeId: savedRecipe.id,
          languageCode: translationData.languageCode,
          title: translationData.title,
          description: translationData.description,
          preparationSteps: translationData.instructions // Use preparationSteps instead of instructions
        });
        await recipeTranslationRepository.save(translation);
      }

      // Skip recipe ingredients for now - will be handled when ingredient system is complete
      // TODO: Implement proper ingredient seeding when ingredient entities are ready

      console.log(`Created recipe: ${translations[0].title}`);
    }
  }

  console.log('Recipe seeding completed!');
} 