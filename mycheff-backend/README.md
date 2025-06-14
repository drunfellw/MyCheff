# MyCheff Backend API

Professional NestJS backend for MyCheff recipe management application with multi-language support, premium subscriptions, and comprehensive recipe management.

## 🚀 Features

- **Modular Architecture**: Clean, scalable modular structure
- **Multi-language Support**: Professional translation system with unlimited language support
- **Premium Subscriptions**: Complete subscription management system
- **Recipe Management**: Advanced recipe search, ingredient matching, and rating system
- **User Management**: Authentication, profiles, favorites, and ingredient inventory
- **API Documentation**: Auto-generated Swagger documentation
- **Database**: PostgreSQL with TypeORM and proper indexing
- **Security**: JWT authentication, input validation, rate limiting
- **Performance**: Optimized queries, caching, and pagination

## 📁 Project Structure

```
src/
├── common/                 # Shared utilities and DTOs
│   ├── dto/               # Common DTOs (pagination, responses)
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Exception filters
│   ├── guards/            # Authentication guards
│   ├── interceptors/      # Response interceptors
│   └── pipes/             # Validation pipes
├── config/                # Configuration files
├── modules/               # Feature modules
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── recipes/           # Recipe management
│   ├── categories/        # Category management
│   ├── ingredients/       # Ingredient management
│   ├── languages/         # Language management
│   └── subscriptions/     # Subscription management
├── entities/              # Shared entities
├── app.module.ts          # Main application module
└── main.ts               # Application entry point
```

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mycheff-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb mycheff
   
   # Run migrations (auto-sync in development)
   npm run start:dev
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## 📊 Database Schema

### Core Entities

- **Language**: Multi-language support
- **User**: User accounts with premium status
- **Category/CategoryTranslation**: Recipe categories with translations
- **Ingredient/IngredientTranslation**: Ingredients with translations
- **Recipe/RecipeTranslation**: Recipes with translations and instructions
- **RecipeIngredient**: Recipe-ingredient relationships
- **UserIngredient**: User's ingredient inventory
- **UserFavorite**: User's favorite recipes
- **RecipeRating**: Recipe ratings and reviews
- **SubscriptionPlan/UserSubscription**: Premium subscription system

### Key Features

- **Search Vectors**: Full-text search support for each language
- **Proper Indexing**: Optimized database performance
- **Cascade Operations**: Proper entity relationships
- **Soft Deletes**: Data preservation with soft delete support

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh

### Languages
- `GET /languages` - Get all active languages
- `POST /languages` - Create new language (Admin)
- `PATCH /languages/:id` - Update language (Admin)
- `DELETE /languages/:id` - Delete language (Admin)

### Recipes
- `POST /recipes/search` - Advanced recipe search
- `POST /recipes/by-ingredients` - Recipe matching by ingredients
- `GET /recipes/popular` - Popular recipes
- `GET /recipes/featured` - Featured recipes
- `GET /recipes/:id` - Get single recipe
- `POST /recipes/:id/ratings` - Rate a recipe

### Categories
- `GET /categories` - Get categories with translations
- `GET /categories/:id/recipes` - Get recipes by category

### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/ingredients` - Get user's ingredients
- `POST /user/ingredients` - Add ingredient to user's list
- `GET /user/favorites` - Get user's favorite recipes
- `POST /user/favorites` - Add to favorites

### Subscriptions
- `GET /subscription-plans` - Get available plans
- `POST /subscriptions/purchase` - Purchase subscription
- `GET /user/subscriptions/status` - Check premium status

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API rate limiting protection
- **CORS Configuration**: Proper cross-origin setup
- **SQL Injection Protection**: TypeORM query protection

## 🌍 Multi-language Support

The application supports unlimited languages with:

- **Translation Tables**: Separate translation entities for all content
- **Language Headers**: Frontend sends language preference
- **Search Vectors**: Full-text search for each language
- **Fallback System**: Graceful handling of missing translations

## 📈 Performance Optimizations

- **Database Indexing**: Optimized indexes on critical fields
- **Query Optimization**: Efficient database queries
- **Pagination**: Proper pagination for all list endpoints
- **Caching Strategy**: Redis caching for frequently accessed data

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 API Documentation

Access the Swagger documentation at: `http://localhost:3001/api/docs`

## 🚀 Deployment

### Docker Deployment

```bash
# Build image
docker build -t mycheff-backend .

# Run with docker-compose
docker-compose up -d
```

### Environment Variables

See `.env.example` for all available configuration options.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.
