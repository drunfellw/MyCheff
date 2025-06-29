# MyCheff - Complete Project Documentation

🍳 **MyCheff** is a comprehensive food and recipe application with mobile frontend, REST API backend, and admin panel.

## 📚 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Development Guide](#development-guide)
- [Production Deployment](#production-deployment)
- [API Documentation](#api-documentation)
- [Frontend Guide](#frontend-guide)
- [Backend Guide](#backend-guide)
- [Admin Panel Guide](#admin-panel-guide)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

## 🎯 Project Overview

MyCheff is a modern food application ecosystem consisting of:

### Components
- **Mobile App (React Native/Expo)**: iOS/Android app for end users
- **REST API (NestJS)**: Backend server with PostgreSQL database
- **Admin Panel (React)**: Web interface for content management
- **Database (PostgreSQL)**: Centralized data storage

### Key Features
- **User Authentication**: JWT-based secure authentication
- **Recipe Management**: Browse, search, favorite recipes
- **Category System**: Organized recipe categories
- **Multi-language Support**: Turkish/English interface
- **Real-time Search**: Fast recipe search functionality
- **Responsive Design**: Works on all device sizes
- **Admin Dashboard**: Complete content management

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Admin Panel   │    │   Public Web    │
│  (React Native) │    │    (React)      │    │    (Future)     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴───────────┐
                    │     REST API Server     │
                    │       (NestJS)          │
                    └─────────────┬───────────┘
                                  │
                       ┌──────────┴──────────┐
                       │   PostgreSQL DB     │
                       │  (with TypeORM)     │
                       └─────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Expo CLI (for mobile development)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd MyCheff
```

### 2. Database Setup
```bash
# Create database
createdb mycheff

# Run setup scripts
cd database
psql -d mycheff -f mycheff-installation.sql
```

### 3. Backend Setup
```bash
cd mycheff-backend
npm install
cp env.production.example .env
# Edit .env with your database credentials
npm run start:dev
```

### 4. Frontend Setup
```bash
cd mycheff-frontend
npm install
cp env.production.example .env
# Edit .env with your API URL
npm start
```

### 5. Admin Panel Setup
```bash
cd admin-panel
npm install
npm start
```

## 🛠️ Development Guide

### Project Structure
```
MyCheff/
├── mycheff-backend/          # NestJS API server
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   ├── entities/         # Database entities
│   │   ├── services/         # Business logic
│   │   └── controllers/      # API endpoints
│   ├── env.production.example
│   └── package.json
├── mycheff-frontend/         # React Native mobile app
│   ├── src/
│   │   ├── screens/          # App screens
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API clients
│   │   ├── providers/        # Context providers
│   │   └── constants/        # Design system
│   ├── env.production.example
│   └── package.json
├── admin-panel/              # React admin interface
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Admin pages
│   │   └── services/         # API services
│   └── package.json
├── docs/                     # Documentation
├── database/                 # Database scripts
└── docker-compose.yml        # Docker configuration
```

### Development Workflow

1. **Feature Development**:
   - Create feature branch from `main`
   - Implement backend endpoints first
   - Add frontend integration
   - Update admin panel if needed
   - Test thoroughly

2. **Code Standards**:
   - Use TypeScript for type safety
   - Follow ESLint/Prettier rules
   - Write unit tests for critical functions
   - Document complex business logic

3. **Database Changes**:
   - Create migration files
   - Update entity definitions
   - Test data integrity
   - Update documentation

## 🌐 Production Deployment

### Environment Configuration

#### Backend (.env.production)
```bash
NODE_ENV=production
PORT=3001
DB_HOST=your-db-host
DB_PASSWORD=secure-password
JWT_SECRET=super-secure-secret-32-chars-min
CORS_ORIGIN=https://your-domain.com
```

#### Frontend (.env.production)
```bash
EXPO_PUBLIC_API_URL=https://api.your-domain.com/api/v1
EXPO_PUBLIC_ENVIRONMENT=production
```

### Deployment Steps

1. **Database Preparation**:
   ```bash
   # Create production database
   createdb mycheff_prod
   psql -d mycheff_prod -f database/mycheff-installation.sql
   ```

2. **Backend Deployment**:
   ```bash
   cd mycheff-backend
   npm run build
   npm run start:prod
   ```

3. **Frontend Build**:
   ```bash
   cd mycheff-frontend
   expo build:android
   expo build:ios
   ```

4. **Admin Panel Deployment**:
   ```bash
   cd admin-panel
   npm run build
   # Deploy build/ to your web server
   ```

### Security Checklist
- [ ] Change all default passwords
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable CORS only for your domains
- [ ] Set up rate limiting
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable error monitoring

## 📡 API Documentation

### Base URL
- Development: `http://localhost:3001/api/v1`
- Production: `https://api.your-domain.com/api/v1`

### Authentication Endpoints
```
POST /auth/register        # User registration
POST /auth/login          # User login
POST /auth/logout         # User logout
GET  /auth/users          # Get all users (admin)
DELETE /auth/users/:id    # Delete user (admin)
```

### Recipe Endpoints
```
GET    /recipes           # Get all recipes
GET    /recipes/featured  # Get featured recipes
GET    /recipes/search    # Search recipes
GET    /recipes/:id       # Get recipe by ID
POST   /recipes           # Create recipe (admin)
PUT    /recipes/:id       # Update recipe (admin)
DELETE /recipes/:id       # Delete recipe (admin)
```

### Category Endpoints
```
GET    /categories        # Get all categories
GET    /categories/:id    # Get category by ID
POST   /categories        # Create category (admin)
PATCH  /categories/:id    # Update category (admin)
DELETE /categories/:id    # Delete category (admin)
```

### User Profile Endpoints
```
GET    /user/profile      # Get user profile
PATCH  /user/profile      # Update user profile
POST   /user/change-password  # Change password
GET    /user/favorites    # Get user favorites
POST   /user/favorites    # Add to favorites
DELETE /user/favorites/:recipeId  # Remove from favorites
```

## 📱 Frontend Guide

### Key Technologies
- **React Native**: Mobile app framework
- **Expo**: Development platform
- **TypeScript**: Type safety
- **React Navigation**: Navigation
- **React Query**: Data fetching
- **AsyncStorage**: Local storage

### Screen Structure
```
src/screens/
├── WelcomeScreen.tsx      # App intro/welcome
├── LoginScreen.tsx        # User authentication
├── RegisterScreen.tsx     # User registration
├── HomeScreen.tsx         # Main recipe feed
├── SearchScreen.tsx       # Recipe search
├── RecipeDetailScreen.tsx # Recipe details
├── ProfileScreen.tsx      # User profile
├── FavoritesScreen.tsx    # User favorites
└── CookingStepsScreen.tsx # Cooking instructions
```

### State Management
- **AuthProvider**: User authentication state
- **React Query**: Server state management
- **Local State**: Component-specific state

### Styling System
```typescript
// Design tokens in constants/
export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#FFFFFF',
  text: '#2C3E50'
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};
```

## 🔧 Backend Guide

### Key Technologies
- **NestJS**: Node.js framework
- **TypeORM**: Database ORM
- **PostgreSQL**: Database
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **Swagger**: API documentation

### Module Structure
```
src/modules/
├── auth/                  # Authentication module
├── users/                 # User management
├── recipes/               # Recipe management
├── categories/            # Category management
├── ingredients/           # Ingredient management
└── subscriptions/         # Premium subscriptions
```

### Entity Relationships
```
User ──┬── UserFavorites ──── Recipe
       ├── UserIngredients ── Ingredient
       └── UserSubscriptions ── SubscriptionPlan

Recipe ──┬── RecipeCategories ── Category
         ├── RecipeIngredients ── Ingredient
         ├── RecipeInstructions
         └── RecipeMedia

Category ── CategoryTranslations ── Language
```

### Service Layer Pattern
```typescript
@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>
  ) {}

  async findAll(page: number, limit: number): Promise<Recipe[]> {
    return await this.recipeRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['categories', 'ingredients']
    });
  }
}
```

## 🎛️ Admin Panel Guide

### Key Features
- **Dashboard**: Overview statistics
- **Recipe Management**: CRUD operations
- **Category Management**: Category organization
- **User Management**: User administration
- **Language Management**: Multi-language support

### Component Structure
```
src/
├── components/
│   ├── Layout/           # Page layout components
│   ├── Forms/            # Form components
│   ├── Tables/           # Data table components
│   └── Charts/           # Dashboard charts
├── pages/
│   ├── Dashboard/        # Main dashboard
│   ├── Recipes/          # Recipe management
│   ├── Categories/       # Category management
│   └── Users/            # User management
└── services/
    └── api.ts            # API client
```

### Authentication Flow
1. Admin login with credentials
2. JWT token stored in localStorage
3. Token sent with all API requests
4. Auto-logout on token expiration

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts and profiles
- **recipes**: Recipe information and content
- **categories**: Recipe categorization
- **ingredients**: Recipe ingredients
- **languages**: Multi-language support

### Relationship Tables
- **user_favorites**: User recipe favorites
- **recipe_categories**: Recipe-category relationships
- **recipe_ingredients**: Recipe ingredient lists
- **recipe_instructions**: Cooking instructions
- **category_translations**: Multi-language category names

### Key Indexes
```sql
-- Performance indexes
CREATE INDEX idx_recipes_is_active ON recipes(is_active);
CREATE INDEX idx_recipes_category ON recipe_categories(category_id);
CREATE INDEX idx_user_favorites ON user_favorites(user_id, recipe_id);
CREATE INDEX idx_recipe_search ON recipes USING gin(to_tsvector('turkish', title));
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Standards
- Use TypeScript for all new code
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### Pull Request Process
1. Update README if needed
2. Add/update tests
3. Ensure CI passes
4. Get code review approval
5. Merge to main branch

## 📞 Support

For questions or issues:
- Create GitHub issue
- Check documentation
- Review API responses
- Test with development environment

---

## 📄 License

This project is proprietary. All rights reserved.

## 🏷️ Version

**Current Version**: 1.0.0  
**Last Updated**: December 2024  
**Documentation Version**: 1.0.0 