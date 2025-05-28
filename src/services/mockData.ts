import type { Category, Recipe } from '../types';

// Categories Data
export const CATEGORIES_DATA: Category[] = [
  {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Breakfast',
    icon: 'breakfast-icon',
    recipeCount: 156,
  },
  {
    id: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Sandwiches',
    icon: 'sandwich-icon',
    recipeCount: 89,
  },
  {
    id: '3',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Salads',
    icon: 'salad-icon',
    recipeCount: 124,
  },
  {
    id: '4',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Meats',
    icon: 'steak-icon',
    recipeCount: 198,
  },
  {
    id: '5',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Chickens',
    icon: 'chicken-icon',
    recipeCount: 145,
  },
  {
    id: '6',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Vegetables',
    icon: 'vegetable-icon',
    recipeCount: 112,
  },
  {
    id: '7',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Pastas',
    icon: 'pastas-icon',
    recipeCount: 87,
  },
  {
    id: '8',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Main meals',
    icon: 'main-meals-icon',
    recipeCount: 234,
  },
  {
    id: '9',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Desserts',
    icon: 'desserts-icon',
    recipeCount: 167,
  },
  {
    id: '10',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Drinks',
    icon: 'drinks-icon',
    recipeCount: 93,
  },
];

// Mock Recipes Data
export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Soğuk Amerikano',
    description: 'Perfectly brewed cold coffee with ice for hot summer days',
    time: '3 min',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop',
    isFavorite: false,
    category: 'Drinks',
    difficulty: 'Easy',
    servings: 1,
    rating: 4.5,
    reviewCount: 128,
    author: 'Coffee Master',
    tags: ['cold', 'coffee', 'summer', 'quick'],
    ingredients: [
      '2 shots espresso',
      '1 cup cold water',
      'Ice cubes',
      'Sugar (optional)',
    ],
    instructions: [
      'Brew 2 shots of espresso',
      'Let it cool for 2 minutes',
      'Pour over ice in a tall glass',
      'Add cold water',
      'Stir gently and serve',
    ],
    nutrition: {
      calories: 15,
      protein: 0.5,
      carbs: 3,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 5,
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Avocado Toast',
    description: 'Creamy avocado on toasted bread with perfect seasonings',
    time: '5 min',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=200&fit=crop',
    isFavorite: true,
    category: 'Breakfast',
    difficulty: 'Easy',
    servings: 2,
    rating: 4.8,
    reviewCount: 256,
    author: 'Healthy Chef',
    tags: ['healthy', 'breakfast', 'avocado', 'quick'],
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      'Salt and pepper',
      'Lemon juice',
      'Cherry tomatoes (optional)',
      'Red pepper flakes (optional)',
    ],
    instructions: [
      'Toast the bread slices until golden brown',
      'Mash the avocado in a bowl',
      'Add salt, pepper, and lemon juice',
      'Spread avocado mixture on toast',
      'Top with cherry tomatoes and red pepper flakes',
      'Serve immediately',
    ],
    nutrition: {
      calories: 285,
      protein: 8,
      carbs: 32,
      fat: 18,
      fiber: 12,
      sugar: 3,
      sodium: 240,
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '3',
    title: 'Greek Salad',
    description: 'Fresh Mediterranean salad with feta cheese and olives',
    time: '10 min',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
    isFavorite: false,
    category: 'Salads',
    difficulty: 'Easy',
    servings: 4,
    rating: 4.6,
    reviewCount: 189,
    author: 'Mediterranean Chef',
    tags: ['healthy', 'salad', 'mediterranean', 'fresh'],
    ingredients: [
      '3 large tomatoes, chopped',
      '1 cucumber, sliced',
      '1 red onion, thinly sliced',
      '200g feta cheese, cubed',
      '1/2 cup kalamata olives',
      '3 tbsp olive oil',
      '2 tbsp red wine vinegar',
      'Fresh oregano',
      'Salt and pepper',
    ],
    instructions: [
      'Chop tomatoes and place in large bowl',
      'Add sliced cucumber and red onion',
      'Add feta cheese cubes and olives',
      'Whisk olive oil and vinegar together',
      'Pour dressing over salad',
      'Season with oregano, salt, and pepper',
      'Toss gently and serve',
    ],
    nutrition: {
      calories: 245,
      protein: 12,
      carbs: 15,
      fat: 18,
      fiber: 4,
      sugar: 12,
      sodium: 680,
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '4',
    title: 'Grilled Chicken',
    description: 'Juicy grilled chicken breast with herbs and spices',
    time: '25 min',
    image: 'https://images.unsplash.com/photo-1532636875304-0c89119d9b4d?w=300&h=200&fit=crop',
    isFavorite: false,
    category: 'Chickens',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.7,
    reviewCount: 312,
    author: 'Grill Master',
    tags: ['protein', 'grilled', 'healthy', 'main course'],
    ingredients: [
      '4 chicken breast fillets',
      '2 tbsp olive oil',
      '2 cloves garlic, minced',
      '1 tsp paprika',
      '1 tsp dried thyme',
      '1 tsp dried rosemary',
      'Salt and black pepper',
      'Lemon wedges for serving',
    ],
    instructions: [
      'Preheat grill to medium-high heat',
      'Mix olive oil, garlic, and spices in a bowl',
      'Season chicken with salt and pepper',
      'Brush chicken with herb mixture',
      'Grill for 6-7 minutes per side',
      'Check internal temperature reaches 165°F',
      'Let rest for 5 minutes before serving',
      'Serve with lemon wedges',
    ],
    nutrition: {
      calories: 310,
      protein: 45,
      carbs: 2,
      fat: 12,
      fiber: 0,
      sugar: 1,
      sodium: 380,
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '5',
    title: 'Beef Steak',
    description: 'Perfect medium-rare steak with garlic butter',
    time: '15 min',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
    isFavorite: true,
    category: 'Meats',
    difficulty: 'Medium',
    servings: 2,
    rating: 4.9,
    reviewCount: 198,
    author: 'Steakhouse Chef',
    tags: ['steak', 'beef', 'gourmet', 'main course'],
    ingredients: [
      '2 ribeye steaks (8oz each)',
      '2 tbsp butter',
      '3 cloves garlic, crushed',
      'Fresh thyme sprigs',
      'Salt and coarse black pepper',
      '1 tbsp vegetable oil',
    ],
    instructions: [
      'Let steaks come to room temperature (30 min)',
      'Season generously with salt and pepper',
      'Heat oil in cast iron skillet over high heat',
      'Sear steaks for 3-4 minutes per side',
      'Add butter, garlic, and thyme to pan',
      'Baste steaks with melted butter',
      'Rest for 5 minutes before serving',
    ],
    nutrition: {
      calories: 650,
      protein: 48,
      carbs: 1,
      fat: 49,
      fiber: 0,
      sugar: 0,
      sodium: 420,
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: '6',
    title: 'Pasta Carbonara',
    description: 'Classic Italian pasta with eggs, cheese, and pancetta',
    time: '20 min',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
    isFavorite: false,
    category: 'Pastas',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.8,
    reviewCount: 267,
    author: 'Italian Chef',
    tags: ['italian', 'pasta', 'cream', 'traditional'],
    ingredients: [
      '400g spaghetti',
      '200g pancetta, diced',
      '4 large eggs',
      '100g Parmesan cheese, grated',
      '2 cloves garlic, minced',
      'Black pepper',
      'Salt',
      'Fresh parsley for garnish',
    ],
    instructions: [
      'Cook spaghetti according to package directions',
      'Cook pancetta until crispy',
      'Beat eggs with Parmesan and black pepper',
      'Drain pasta, reserve 1 cup pasta water',
      'Add hot pasta to pancetta pan',
      'Remove from heat, add egg mixture',
      'Toss quickly, adding pasta water as needed',
      'Serve immediately with extra Parmesan',
    ],
    nutrition: {
      calories: 585,
      protein: 28,
      carbs: 72,
      fat: 22,
      fiber: 3,
      sugar: 3,
      sodium: 890,
    },
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-30'),
  },
];

// Helper function to get recipes by category
export const getRecipesByCategory = (categoryName: string): Recipe[] => {
  if (categoryName === 'All' || !categoryName) {
    return MOCK_RECIPES;
  }
  return MOCK_RECIPES.filter(recipe => 
    recipe.category.toLowerCase() === categoryName.toLowerCase()
  );
};

// Helper function to search recipes
export const searchRecipes = (query: string): Recipe[] => {
  if (!query.trim()) {
    return MOCK_RECIPES;
  }
  
  const searchTerm = query.toLowerCase();
  return MOCK_RECIPES.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm) ||
    recipe.description?.toLowerCase().includes(searchTerm) ||
    recipe.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    recipe.ingredients?.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
  );
};

// Helper function to get featured recipes
export const getFeaturedRecipes = (): Recipe[] => {
  return MOCK_RECIPES.filter(recipe => recipe.rating && recipe.rating >= 4.7)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);
};

// Helper function to get favorite recipes
export const getFavoriteRecipes = (): Recipe[] => {
  return MOCK_RECIPES.filter(recipe => recipe.isFavorite);
}; 