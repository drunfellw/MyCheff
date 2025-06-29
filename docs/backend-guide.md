# MyCheff Backend Development Guide

Complete guide for developing and maintaining the MyCheff NestJS API backend.

## 🔧 Tech Stack

- **NestJS**: 10.x - Progressive Node.js framework
- **TypeScript**: 5.x - Type safety and modern JavaScript
- **PostgreSQL**: 14+ - Primary database
- **TypeORM**: 0.3.x - Object-relational mapping
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Swagger**: API documentation
- **class-validator**: Request validation
- **class-transformer**: Object transformation

## 🏗️ Project Structure

```
mycheff-backend/
├── src/
│   ├── modules/                 # Feature modules
│   │   ├── auth/               # Authentication module
│   │   │   ├── controllers/    # Auth controllers
│   │   │   ├── services/       # Auth business logic
│   │   │   ├── strategies/     # JWT strategies
│   │   │   ├── guards/         # Auth guards
│   │   │   └── dto/           # Data transfer objects
│   │   ├── users/             # User management
│   │   ├── recipes/           # Recipe management
│   │   ├── categories/        # Category management
│   │   ├── ingredients/       # Ingredient management
│   │   └── subscriptions/     # Premium subscriptions
│   ├── entities/              # Database entities
│   │   ├── user.entity.ts
│   │   ├── recipe.entity.ts
│   │   ├── category.entity.ts
│   │   └── ingredient.entity.ts
│   ├── common/                # Shared utilities
│   │   ├── decorators/        # Custom decorators
│   │   ├── filters/           # Exception filters
│   │   ├── guards/            # Global guards
│   │   ├── interceptors/      # Global interceptors
│   │   └── pipes/             # Validation pipes
│   ├── config/                # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   ├── migrations/            # Database migrations
│   └── main.ts               # Application entry point
├── test/                      # E2E tests
├── env.production.example     # Environment template
├── package.json
└── tsconfig.json
```

## 🗄️ Database Architecture

### Core Entities

#### User Entity (`src/entities/user.entity.ts`)
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'profile_image', nullable: true })
  profileImage?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ name: 'cooking_skill_level', default: 1 })
  cookingSkillLevel: number;

  @Column({ type: 'json', nullable: true })
  dietaryRestrictions?: string[];

  @Column({ type: 'json', nullable: true })
  allergies?: string[];

  @Column({ name: 'preferred_language_code', default: 'tr' })
  preferredLanguageCode: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_premium', default: false })
  isPremium: boolean;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt?: Date;

  @Column({ name: 'fcm_token', nullable: true })
  fcmToken?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => UserFavorite, favorite => favorite.user)
  favorites: UserFavorite[];

  @OneToMany(() => UserIngredient, ingredient => ingredient.user)
  ingredients: UserIngredient[];

  @OneToMany(() => UserSubscription, subscription => subscription.user)
  subscriptions: UserSubscription[];
}
```

#### Recipe Entity (`src/entities/recipe.entity.ts`)
```typescript
@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'cooking_time', type: 'integer' })
  cookingTime: number;

  @Column({ name: 'prep_time', type: 'integer', default: 0 })
  prepTime: number;

  @Column({
    type: 'enum',
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  })
  difficulty: 'Easy' | 'Medium' | 'Hard';

  @Column({ type: 'integer', default: 1 })
  servings: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @Column({ type: 'json', nullable: true })
  ingredients?: string[];

  @Column({ type: 'json', nullable: true })
  instructions?: string[];

  @Column({ type: 'json', nullable: true })
  tips?: string[];

  @Column({ name: 'is_premium', default: false })
  isPremium: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'average_rating', type: 'decimal', precision: 3, scale: 2, nullable: true })
  averageRating?: number;

  @Column({ name: 'rating_count', default: 0 })
  ratingCount: number;

  @Column({ type: 'json', nullable: true })
  nutritionalData?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToMany(() => Category, category => category.recipes)
  @JoinTable({
    name: 'recipe_categories',
    joinColumn: { name: 'recipe_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: Category[];

  @OneToMany(() => UserFavorite, favorite => favorite.recipe)
  favorites: UserFavorite[];
}
```

#### Category Entity (`src/entities/category.entity.ts`)
```typescript
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => CategoryTranslation, translation => translation.category, {
    cascade: true,
    eager: true
  })
  translations: CategoryTranslation[];

  @ManyToMany(() => Recipe, recipe => recipe.categories)
  recipes: Recipe[];
}
```

### Database Relationships

```
User ──┬── UserFavorites ──── Recipe
       ├── UserIngredients ── Ingredient  
       └── UserSubscriptions ── SubscriptionPlan

Recipe ──┬── RecipeCategories ── Category
         ├── RecipeIngredients ── Ingredient
         └── RecipeInstructions

Category ── CategoryTranslations ── Language

Ingredient ── IngredientTranslations ── Language
```

## 🏛️ Module Architecture

### Authentication Module (`src/modules/auth/`)

#### Auth Controller
```typescript
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const result = await this.authService.register(registerDto);
      return {
        success: true,
        data: result,
        message: 'User registered successfully'
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      data: result,
      message: 'Login successful'
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Request() req): Promise<{ success: boolean; message: string }> {
    await this.authService.logout(req.user.id);
    return {
      success: true,
      message: 'Logout successful'
    };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async getUsers(): Promise<{ success: boolean; data: User[] }> {
    const users = await this.authService.getAllUsers();
    return {
      success: true,
      data: users
    };
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  async deleteUser(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    await this.authService.deleteUser(id);
    return {
      success: true,
      message: 'User deleted successfully'
    };
  }
}
```

#### Auth Service
```typescript
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: registerDto.email },
        { username: registerDto.username }
      ]
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    return {
      user: this.sanitizeUser(savedUser),
      ...tokens
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Find user
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  async logout(userId: string): Promise<void> {
    // Invalidate refresh tokens (implement token blacklist if needed)
    // For now, just update user's last logout time
    await this.userRepository.update(userId, {
      lastLoginAt: new Date()
    });
  }

  private async generateTokens(user: User): Promise<{ token: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username
    };

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '24h' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' })
    ]);

    return { token, refreshToken };
  }

  private sanitizeUser(user: User): Partial<User> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'fullName', 'isActive', 'createdAt'],
      order: { createdAt: 'DESC' }
    });
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
```

### JWT Strategy (`src/modules/auth/strategies/jwt.strategy.ts`)
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}
```

### DTO Classes (`src/modules/auth/dto/`)

#### Register DTO
```typescript
export class RegisterDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;
}
```

#### Login DTO
```typescript
export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### Recipe Module (`src/modules/recipes/`)

#### Recipe Controller
```typescript
@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  getTest(): { message: string } {
    return { message: 'Recipes controller is working!' };
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured recipes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Featured recipes retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: { type: 'array', items: { $ref: '#/components/schemas/Recipe' } },
        message: { type: 'string' }
      }
    }
  })
  async getFeaturedRecipes(
    @Query('page') page: string = '1', 
    @Query('limit') limit: string = '10'
  ): Promise<ApiResponse<Recipe[]>> {
    try {
      const recipes = await this.recipesService.getFeaturedRecipes(
        parseInt(page), 
        parseInt(limit)
      );
      return {
        success: true,
        data: recipes,
        message: 'Featured recipes retrieved successfully'
      };
    } catch (error) {
      throw new HttpException('Failed to retrieve featured recipes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search recipes' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  async searchRecipes(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('lang') languageCode: string = 'tr'
  ): Promise<PaginatedResponse<Recipe>> {
    if (!query) {
      throw new BadRequestException('Search query is required');
    }

    return await this.recipesService.searchRecipes(
      query,
      parseInt(page),
      parseInt(limit),
      languageCode
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recipe by ID' })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  async getRecipeById(
    @Param('id') id: string,
    @Query('lang') languageCode: string = 'tr'
  ): Promise<ApiResponse<Recipe>> {
    const recipe = await this.recipesService.getRecipeById(id, languageCode);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return {
      success: true,
      data: recipe,
      message: 'Recipe retrieved successfully'
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Create new recipe (Admin only)' })
  @ApiResponse({ status: 201, description: 'Recipe created successfully' })
  async createRecipe(@Body() createRecipeDto: CreateRecipeDto): Promise<ApiResponse<Recipe>> {
    const recipe = await this.recipesService.createRecipe(createRecipeDto);
    return {
      success: true,
      data: recipe,
      message: 'Recipe created successfully'
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update recipe (Admin only)' })
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto
  ): Promise<ApiResponse<Recipe>> {
    const recipe = await this.recipesService.updateRecipe(id, updateRecipeDto);
    return {
      success: true,
      data: recipe,
      message: 'Recipe updated successfully'
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete recipe (Admin only)' })
  async deleteRecipe(@Param('id') id: string): Promise<{ success: boolean; message: string }> {
    await this.recipesService.deleteRecipe(id);
    return {
      success: true,
      message: 'Recipe deleted successfully'
    };
  }
}
```

#### Recipe Service
```typescript
@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getFeaturedRecipes(page: number = 1, limit: number = 10): Promise<Recipe[]> {
    const skip = (page - 1) * limit;

    return await this.recipeRepository.find({
      where: { 
        isActive: true,
        isFeatured: true 
      },
      relations: ['categories'],
      order: { 
        averageRating: 'DESC',
        createdAt: 'DESC' 
      },
      skip,
      take: limit,
    });
  }

  async searchRecipes(
    query: string,
    page: number = 1,
    limit: number = 10,
    languageCode: string = 'tr'
  ): Promise<PaginatedResponse<Recipe>> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.categories', 'category')
      .leftJoinAndSelect('category.translations', 'translation')
      .where('recipe.isActive = :isActive', { isActive: true })
      .andWhere(
        '(LOWER(recipe.title) LIKE LOWER(:query) OR LOWER(recipe.description) LIKE LOWER(:query))',
        { query: `%${query}%` }
      )
      .orderBy('recipe.averageRating', 'DESC')
      .addOrderBy('recipe.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [recipes, total] = await queryBuilder.getManyAndCount();

    return {
      data: recipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1
      }
    };
  }

  async getRecipeById(id: string, languageCode: string = 'tr'): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id, isActive: true },
      relations: ['categories', 'categories.translations']
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    // Increment view count
    await this.recipeRepository.increment({ id }, 'viewCount', 1);

    return recipe;
  }

  async createRecipe(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = this.recipeRepository.create(createRecipeDto);

    if (createRecipeDto.categoryIds) {
      const categories = await this.categoryRepository.findByIds(createRecipeDto.categoryIds);
      recipe.categories = categories;
    }

    return await this.recipeRepository.save(recipe);
  }

  async updateRecipe(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const recipe = await this.getRecipeById(id);

    Object.assign(recipe, updateRecipeDto);

    if (updateRecipeDto.categoryIds) {
      const categories = await this.categoryRepository.findByIds(updateRecipeDto.categoryIds);
      recipe.categories = categories;
    }

    return await this.recipeRepository.save(recipe);
  }

  async deleteRecipe(id: string): Promise<void> {
    const result = await this.recipeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Recipe not found');
    }
  }
}
```

## 🔒 Security Implementation

### JWT Guard (`src/common/guards/jwt-auth.guard.ts`)
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
```

### Admin Guard (`src/common/guards/admin.guard.ts`)
```typescript
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user is admin (implement your admin logic)
    if (!user || !user.isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
```

### Password Validation Pipe (`src/common/pipes/password-validation.pipe.ts`)
```typescript
@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && value.password) {
      const password = value.password;
      
      // Password strength validation
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (password.length < minLength) {
        throw new BadRequestException('Password must be at least 8 characters long');
      }

      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        throw new BadRequestException(
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        );
      }
    }

    return value;
  }
}
```

## 📊 Database Configuration

### TypeORM Configuration (`src/config/database.config.ts`)
```typescript
export const databaseConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'mycheff',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};
```

### Migration Example (`src/migrations/`)
```typescript
export class CreateUserTable1640000000000 implements MigrationInterface {
  name = 'CreateUserTable1640000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'full_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

## 🧪 Testing

### Unit Testing
```typescript
// src/modules/auth/auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(registerDto as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(registerDto as any);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(userRepository.findOne).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(registerDto as any);

      await expect(service.register(registerDto)).rejects.toThrow(
        'User with this email or username already exists'
      );
    });
  });
});
```

### E2E Testing
```typescript
// test/auth.e2e-spec.ts
describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    const registerDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
      fullName: 'Test User',
    };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('user');
        expect(res.body.data).toHaveProperty('token');
      });
  });

  it('/auth/login (POST)', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
      });
  });
});
```

## 🚀 Performance Optimization

### Caching with Redis
```typescript
// src/common/decorators/cache.decorator.ts
export const CacheResult = (ttl: number = 300) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
      
      // Check cache first
      const cached = await this.cacheManager?.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Execute method
      const result = await method.apply(this, args);

      // Cache result
      if (this.cacheManager) {
        await this.cacheManager.set(cacheKey, result, ttl);
      }

      return result;
    };
  };
};
```

### Database Query Optimization
```typescript
// Optimized recipe search with indexing
async searchRecipesOptimized(query: string): Promise<Recipe[]> {
  return await this.recipeRepository
    .createQueryBuilder('recipe')
    .leftJoinAndSelect('recipe.categories', 'category')
    .where('recipe.search_vector @@ to_tsquery(:query)', { query })
    .orWhere('LOWER(recipe.title) LIKE LOWER(:likeQuery)', { likeQuery: `%${query}%` })
    .orderBy('ts_rank(recipe.search_vector, to_tsquery(:query))', 'DESC')
    .addOrderBy('recipe.averageRating', 'DESC')
    .limit(20)
    .getMany();
}
```

### Pagination Helper
```typescript
// src/common/helpers/pagination.helper.ts
export class PaginationHelper {
  static paginate<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }
}
```

## 📋 Best Practices

### Error Handling
```typescript
// src/common/filters/http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      success: false,
      error: {
        code: exception.name,
        message: exception.message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    response.status(status).json(errorResponse);
  }
}
```

### Request Logging
```typescript
// src/common/interceptors/logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        console.log(`${method} ${url} ${response.statusCode} - ${delay}ms`);
      }),
    );
  }
}
```

### Data Transformation
```typescript
// src/common/interceptors/transform.interceptor.ts
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

## 🔧 Development Commands

```bash
# Development
npm run start:dev

# Debug mode
npm run start:debug

# Production build
npm run build
npm run start:prod

# Testing
npm run test
npm run test:watch
npm run test:e2e

# Database
npm run migration:generate -- --name=MigrationName
npm run migration:run
npm run migration:revert

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

## 📦 Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=mycheff_prod

# JWT
JWT_SECRET=your-super-secure-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://your-domain.com

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

---

**Last Updated**: December 2024  
**NestJS Version**: 10.x  
**TypeORM Version**: 0.3.x 