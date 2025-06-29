# MyCheff API Reference

Complete REST API documentation for MyCheff backend services.

## Base Information

- **Base URL**: `http://localhost:3001/api/v1` (Development)
- **Production URL**: `https://api.your-domain.com/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer tokens

## Authentication

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "isActive": true,
      "createdAt": "2024-12-28T10:00:00Z"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  },
  "message": "User registered successfully"
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  },
  "message": "Login successful"
}
```

### Logout User
```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Get All Users (Admin)
```http
GET /auth/users
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "isActive": true,
      "createdAt": "2024-12-28T10:00:00Z"
    }
  ]
}
```

## Recipes

### Get All Recipes
```http
GET /recipes?page=1&limit=10&lang=tr
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `lang` (optional): Language code (default: tr)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Köfte Tarifi",
      "description": "Geleneksel Türk köftesi",
      "cookingTime": 30,
      "difficulty": "Easy",
      "servings": 4,
      "imageUrl": "/uploads/recipe.jpg",
      "ingredients": ["500g kıyma", "1 soğan", "2 yumurta"],
      "instructions": ["Malzemeleri karıştırın", "Şekil verin"],
      "categoryId": "category-uuid",
      "isActive": true,
      "createdAt": "2024-12-28T10:00:00Z",
      "updatedAt": "2024-12-28T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get Featured Recipes
```http
GET /recipes/featured?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Featured Recipe",
      "description": "Special featured recipe",
      "cookingTime": 25,
      "difficulty": "Medium",
      "servings": 2,
      "imageUrl": "/uploads/featured.jpg",
      "rating": 4.8,
      "reviewCount": 124,
      "isFeatured": true
    }
  ],
  "message": "Featured recipes retrieved successfully"
}
```

### Search Recipes
```http
GET /recipes/search?q=köfte&page=1&limit=10&lang=tr
```

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number
- `limit` (optional): Items per page
- `lang` (optional): Language code

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Köfte Tarifi",
      "description": "Search result recipe",
      "cookingTime": 30,
      "difficulty": "Easy"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

### Get Recipe by ID
```http
GET /recipes/:id?lang=tr
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Köfte Tarifi",
    "description": "Detailed recipe description",
    "cookingTime": 30,
    "difficulty": "Easy",
    "servings": 4,
    "imageUrl": "/uploads/recipe.jpg",
    "ingredients": [
      {
        "id": "ingredient-uuid",
        "name": "Kıyma",
        "quantity": 500,
        "unit": "g"
      }
    ],
    "instructions": [
      {
        "step": 1,
        "description": "Malzemeleri hazırlayın",
        "estimatedTime": 5
      }
    ],
    "categories": [
      {
        "id": "category-uuid",
        "name": "Ana Yemek"
      }
    ],
    "nutritionInfo": {
      "calories": 250,
      "protein": 20,
      "carbs": 15,
      "fat": 12
    }
  }
}
```

### Create Recipe (Admin)
```http
POST /recipes
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "title": "Yeni Tarif",
  "description": "Tarif açıklaması",
  "cookingTime": 30,
  "difficulty": "Easy",
  "servings": 4,
  "categoryId": "category-uuid",
  "ingredients": ["500g kıyma", "1 soğan"],
  "instructions": ["Adım 1", "Adım 2"],
  "imageUrl": "/uploads/new-recipe.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-recipe-uuid",
    "title": "Yeni Tarif",
    "createdAt": "2024-12-28T10:00:00Z"
  },
  "message": "Recipe created successfully"
}
```

### Update Recipe (Admin)
```http
PUT /recipes/:id
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "title": "Updated Recipe Title",
  "description": "Updated description",
  "cookingTime": 35
}
```

### Delete Recipe (Admin)
```http
DELETE /recipes/:id
Authorization: Bearer <admin-token>
```

## Categories

### Get All Categories
```http
GET /categories?lang=tr
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Ana Yemek",
      "slug": "ana-yemek",
      "icon": "utensils",
      "color": "#FF5722",
      "isActive": true,
      "recipeCount": 45,
      "createdAt": "2024-12-28T10:00:00Z"
    }
  ]
}
```

### Get Category by ID
```http
GET /categories/:id?lang=tr
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ana Yemek",
    "slug": "ana-yemek",
    "icon": "utensils",
    "color": "#FF5722",
    "isActive": true,
    "recipes": [
      {
        "id": "recipe-uuid",
        "title": "Köfte",
        "imageUrl": "/uploads/kofte.jpg"
      }
    ]
  }
}
```

### Get Category Recipes
```http
GET /categories/:id/recipes?page=1&limit=10&lang=tr
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "recipe-uuid",
      "title": "Category Recipe",
      "imageUrl": "/uploads/recipe.jpg",
      "cookingTime": 30
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

### Create Category (Admin)
```http
POST /categories
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Yeni Kategori",
  "slug": "yeni-kategori",
  "icon": "coffee",
  "color": "#2196F3",
  "isActive": true
}
```

### Update Category (Admin)
```http
PATCH /categories/:id
Authorization: Bearer <admin-token>
```

### Delete Category (Admin)
```http
DELETE /categories/:id
Authorization: Bearer <admin-token>
```

### Activate Category (Admin)
```http
PATCH /categories/:id/activate
Authorization: Bearer <admin-token>
```

### Deactivate Category (Admin)
```http
PATCH /categories/:id/deactivate
Authorization: Bearer <admin-token>
```

## User Profile

### Get User Profile
```http
GET /user/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "profileImage": "/uploads/profile.jpg",
    "bio": "Food enthusiast",
    "cookingSkillLevel": 3,
    "dietaryRestrictions": ["vegetarian"],
    "preferredLanguage": "tr",
    "createdAt": "2024-12-28T10:00:00Z"
  }
}
```

### Update User Profile
```http
PATCH /user/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "bio": "Updated bio",
  "cookingSkillLevel": 4,
  "dietaryRestrictions": ["vegetarian", "gluten-free"]
}
```

### Change Password
```http
POST /user/change-password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

## User Favorites

### Get User Favorites
```http
GET /user/favorites?page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "favorite-uuid",
      "recipe": {
        "id": "recipe-uuid",
        "title": "Favorite Recipe",
        "imageUrl": "/uploads/recipe.jpg",
        "cookingTime": 30
      },
      "addedAt": "2024-12-28T10:00:00Z"
    }
  ]
}
```

### Add to Favorites
```http
POST /user/favorites
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "recipeId": "recipe-uuid"
}
```

### Remove from Favorites
```http
DELETE /user/favorites/:recipeId
Authorization: Bearer <token>
```

### Check if Recipe is Favorited
```http
GET /user/favorites/:recipeId/check
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorite": true
  }
}
```

## Ingredients

### Get All Ingredients
```http
GET /ingredients?page=1&limit=10&lang=tr
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ingredient-uuid",
      "name": "Domates",
      "defaultUnit": "adet",
      "category": "Sebze",
      "imageUrl": "/uploads/domates.jpg",
      "isActive": true
    }
  ]
}
```

### Search Ingredients
```http
GET /ingredients/search?q=domates&lang=tr
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ingredient-uuid",
      "name": "Domates",
      "defaultUnit": "adet"
    }
  ]
}
```

### Get Ingredient by ID
```http
GET /ingredients/:id?lang=tr
```

## Languages

### Get All Languages
```http
GET /languages
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "tr",
      "name": "Turkish",
      "nativeName": "Türkçe",
      "isActive": true,
      "isDefault": true
    },
    {
      "code": "en",
      "name": "English",
      "nativeName": "English",
      "isActive": true,
      "isDefault": false
    }
  ]
}
```

### Get Language by Code
```http
GET /languages/:code
```

## Subscriptions

### Get Subscription Plans
```http
GET /subscriptions/plans?lang=tr
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "plan-uuid",
      "name": "Premium Plan",
      "description": "Premium features access",
      "price": 29.99,
      "currency": "TRY",
      "duration": 30,
      "features": [
        "Unlimited recipes",
        "Advanced search",
        "Meal planning"
      ],
      "isActive": true
    }
  ]
}
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-12-28T10:00:00Z"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Authentication Errors
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### Validation Errors
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email must be valid"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

## Rate Limiting

- **Rate Limit**: 100 requests per minute per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Pagination

All paginated endpoints return:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## API Versioning

- Current version: `v1`
- Version specified in URL: `/api/v1/`
- Backward compatibility maintained for minor updates

---

**Last Updated**: December 2024  
**API Version**: 1.0.0 