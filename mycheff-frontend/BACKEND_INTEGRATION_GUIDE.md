# 🚀 BACKEND ENTEGRASYON REHBERİ

## 📋 GENEL BAKIŞ

Bu rehber, MyCheff React Native uygulamasının backend entegrasyonu için gerekli tüm bilgileri içerir. Frontend tamamen hazır durumda ve backend API'leri implementasyonu bekliyor.

## 🏗️ BACKEND MİMARİSİ GEREKSİNİMLERİ

### 1. **AUTHENTICATION & USER MANAGEMENT**

#### Gerekli Endpoint'ler:
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh-token
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/verify-email
```

#### User Management:
```
GET    /user/profile
PUT    /user/profile
DELETE /user/account
PUT    /user/preferences
GET    /user/subscription-status
```

### 2. **RECIPE MANAGEMENT**

#### Ana Recipe Endpoint'leri:
```
GET  /recipes                    # Paginated recipes with filters
GET  /recipes/:id               # Single recipe details
GET  /recipes/category/:id      # Recipes by category
POST /recipes/by-ingredients    # Recipe matching by ingredients
GET  /recipes/search           # Text search in name/description
GET  /recipes/trending         # Popular/trending recipes
GET  /recipes/recommended      # Personalized recommendations
```

#### Recipe Filters:
```
GET /recipes/filters           # Available filter options
```

### 3. **CATEGORY MANAGEMENT**

```
GET /categories               # All categories with recipe counts
GET /categories/:id          # Single category details
```

### 4. **INGREDIENT MANAGEMENT**

```
GET /ingredients             # All available ingredients
GET /ingredients/search      # Autocomplete ingredient search
GET /ingredients/:id         # Single ingredient details
```

### 5. **USER FAVORITES**

```
GET    /user/favorites       # User's favorite recipes (paginated)
POST   /user/favorites       # Add recipe to favorites
DELETE /user/favorites/:id   # Remove from favorites
```

## 🗄️ DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP,
  language VARCHAR(10) DEFAULT 'tr',
  region VARCHAR(10) DEFAULT 'TR',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Recipes Table
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  cooking_time INTEGER NOT NULL, -- minutes
  difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  servings INTEGER DEFAULT 1,
  calories INTEGER,
  category_id UUID REFERENCES categories(id),
  author_id UUID REFERENCES users(id),
  instructions JSONB, -- Array of instruction steps
  nutrition_info JSONB, -- Nutrition information object
  dietary_flags JSONB, -- Dietary restriction flags
  tags TEXT[], -- Array of tags
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_recipes_category ON recipes(category_id);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_cooking_time ON recipes(cooking_time);
CREATE INDEX idx_recipes_rating ON recipes(rating);
CREATE INDEX idx_recipes_created_at ON recipes(created_at);
CREATE INDEX idx_recipes_search ON recipes USING gin(to_tsvector('turkish', name || ' ' || description));
```

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  description TEXT,
  color VARCHAR(7), -- Hex color code
  recipe_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Ingredients Table
```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  translations JSONB, -- Multi-language support
  common_allergens TEXT[],
  nutrition_per_100g JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX idx_ingredients_search ON ingredients USING gin(to_tsvector('turkish', name));
```

### Recipe_Ingredients Table
```sql
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id),
  quantity DECIMAL(10,2),
  unit VARCHAR(50),
  notes TEXT,
  is_optional BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0
);
```

### User_Favorites Table
```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);
```

### User_Preferences Table
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dietary_restrictions JSONB,
  favorite_categories UUID[],
  disliked_ingredients UUID[],
  preferred_cooking_time INTEGER, -- max minutes
  preferred_difficulty TEXT[],
  notification_settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 API RESPONSE FORMATS

### Standard API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Error Response
```typescript
interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  code?: string;
  timestamp: string;
}
```

## 🚀 PERFORMANS GEREKSİNİMLERİ

### 1. **Response Time Targets**
- Ingredient autocomplete: < 200ms
- Recipe search: < 500ms
- Recipe list loading: < 1s
- Single recipe details: < 300ms

### 2. **Caching Strategy**
```
- Categories: Cache for 1 hour
- Popular recipes: Cache for 30 minutes
- User favorites: No cache (real-time)
- Ingredient search: Cache for 24 hours
```

### 3. **Database Optimization**
- Use proper indexes for search queries
- Implement database connection pooling
- Use read replicas for heavy read operations
- Implement query optimization for complex filters

## 🌍 LOCALIZATION SUPPORT

### Multi-language Requirements:
```typescript
// Recipe translations
{
  "tr": {
    "name": "Türk Kahvesi",
    "description": "Geleneksel Türk kahvesi tarifi"
  },
  "en": {
    "name": "Turkish Coffee",
    "description": "Traditional Turkish coffee recipe"
  }
}

// Ingredient translations
{
  "tr": "domates",
  "en": "tomato",
  "ar": "طماطم"
}
```

## 🔐 SECURITY REQUIREMENTS

### 1. **Authentication**
- JWT tokens with refresh mechanism
- Password hashing with bcrypt (min 12 rounds)
- Rate limiting on auth endpoints
- Email verification for new accounts

### 2. **API Security**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting per user/IP

### 3. **Data Protection**
- Encrypt sensitive user data
- Secure file upload for recipe images
- GDPR compliance for EU users
- Data retention policies

## 📱 FRONTEND INTEGRATION POINTS

### 1. **Environment Configuration**
```typescript
// .env file
EXPO_PUBLIC_API_URL=https://api.mycheff.com
EXPO_PUBLIC_API_VERSION=v1
EXPO_PUBLIC_ENVIRONMENT=production
```

### 2. **API Service Usage**
```typescript
// Frontend kullanımı
import { api } from '../services/api';

// Recipes
const recipes = await api.recipes.getRecipes(1, 20, filters);
const recipe = await api.recipes.getRecipeById(recipeId);

// Search
const results = await api.recipes.searchRecipes(query);
const ingredients = await api.ingredients.searchIngredients(query);

// Favorites
await api.user.addToFavorites(recipeId);
await api.user.removeFromFavorites(recipeId);
```

### 3. **Custom Hooks Integration**
```typescript
// Hazır hook'lar
const { recipes, loading, error, loadMore } = useRecipes();
const { searchRecipes, recipes: searchResults } = useRecipeSearch();
const { selectedIngredients, addIngredient } = useIngredients();
const { isFavorite, toggleFavorite } = useFavoriteToggle();
```

## 🧪 TESTING REQUIREMENTS

### 1. **API Testing**
- Unit tests for all endpoints
- Integration tests for complex workflows
- Load testing for high-traffic scenarios
- Security testing for vulnerabilities

### 2. **Data Validation**
- Input validation tests
- Edge case handling
- Error response validation
- Performance benchmarking

## 📊 ANALYTICS & MONITORING

### 1. **Required Metrics**
- API response times
- Error rates by endpoint
- User engagement metrics
- Search query analytics
- Recipe popularity tracking

### 2. **Logging Requirements**
- Structured logging (JSON format)
- Error tracking and alerting
- Performance monitoring
- User activity logging (GDPR compliant)

## 🚀 DEPLOYMENT CHECKLIST

### 1. **Infrastructure**
- [ ] Database setup with proper indexes
- [ ] API server deployment
- [ ] CDN for recipe images
- [ ] SSL certificate configuration
- [ ] Load balancer setup

### 2. **Configuration**
- [ ] Environment variables
- [ ] Database migrations
- [ ] Seed data for categories/ingredients
- [ ] API rate limiting
- [ ] CORS configuration

### 3. **Monitoring**
- [ ] Health check endpoints
- [ ] Error tracking setup
- [ ] Performance monitoring
- [ ] Database monitoring
- [ ] Backup strategy

## 📞 FRONTEND HAZIRLIK DURUMU

### ✅ HAZIR OLAN KISIMLARDA:
1. **API Service Layer** - Tüm endpoint'ler tanımlı
2. **Custom Hooks** - Recipe, ingredient, favorite management
3. **Error Handling** - Centralized error management
4. **Type Definitions** - Complete TypeScript interfaces
5. **Performance Optimization** - Debouncing, caching, memoization
6. **Security Utilities** - Input validation, sanitization
7. **Responsive Design** - All device sizes supported
8. **Accessibility** - WCAG 2.1 AA compliance

### 🔄 BACKEND BAĞLANTISI SONRASI:
1. Environment variables ayarlanacak
2. Authentication token management aktif edilecek
3. Real API endpoints'lere geçiş yapılacak
4. Error handling test edilecek
5. Performance monitoring aktif edilecek

## 🎯 SONUÇ

Frontend tamamen hazır durumda ve backend API'lerini bekliyor. Bu rehberdeki tüm gereksinimler implementasyonu tamamlandığında, uygulama production'a hazır olacak.

**Kritik Noktalar:**
- Tüm API endpoint'leri bu dokümanda belirtildiği gibi implement edilmeli
- Database schema'ları tam olarak uygulanmalı
- Performance gereksinimleri karşılanmalı
- Security best practices uygulanmalı
- Proper error handling ve logging implementasyonu yapılmalı

Frontend kodu hiçbir değişiklik gerektirmeden backend'e bağlanmaya hazır! 🚀 