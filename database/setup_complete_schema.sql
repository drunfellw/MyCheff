-- =====================================================
-- MyCheff Database Setup Script
-- Run this after database creation for complete setup
-- =====================================================

-- First drop schema if exists (for fresh install)
-- DROP SCHEMA IF EXISTS mycheff CASCADE;

-- Create schema
CREATE SCHEMA IF NOT EXISTS mycheff;

-- Extensions (in public schema)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Set search path for this session
SET search_path TO mycheff, public;

-- =====================================================
-- FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION mycheff.update_modified_column()
RETURNS TRIGGER AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Languages
CREATE TABLE IF NOT EXISTS mycheff.languages (
    code VARCHAR(5) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS mycheff.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code) DEFAULT 'tr',
    profile_image VARCHAR(255),
    bio TEXT,
    cooking_skill_level SMALLINT DEFAULT 1 CHECK (cooking_skill_level BETWEEN 1 AND 5),
    dietary_restrictions JSONB,
    allergies TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    fcm_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Units
CREATE TABLE IF NOT EXISTS mycheff.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL UNIQUE,
    system VARCHAR(10) NOT NULL,
    base_unit_code VARCHAR(10),
    conversion_factor DECIMAL(10,6),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Unit Translations
CREATE TABLE IF NOT EXISTS mycheff.unit_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES mycheff.units(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    name VARCHAR(50) NOT NULL,
    short_name VARCHAR(10) NOT NULL,
    plural_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (unit_id, language_code)
);

-- Recipe Categories
CREATE TABLE IF NOT EXISTS mycheff.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icon VARCHAR(50),
    color VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Category Translations
CREATE TABLE IF NOT EXISTS mycheff.category_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES mycheff.categories(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (category_id, language_code)
);

-- Ingredient Categories
CREATE TABLE IF NOT EXISTS mycheff.ingredient_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES mycheff.ingredient_categories(id),
    icon VARCHAR(50),
    color VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ingredient Category Translations
CREATE TABLE IF NOT EXISTS mycheff.ingredient_category_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES mycheff.ingredient_categories(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (category_id, language_code)
);

-- Ingredients
CREATE TABLE IF NOT EXISTS mycheff.ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    default_unit VARCHAR(20) NOT NULL,
    slug VARCHAR(50),
    image VARCHAR(255),
    nutritional_info JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    category_id UUID REFERENCES mycheff.ingredient_categories(id),
    unit_id UUID REFERENCES mycheff.units(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ingredient Translations
CREATE TABLE IF NOT EXISTS mycheff.ingredient_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingredient_id UUID NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    name VARCHAR(100) NOT NULL,
    aliases TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ingredient_id, language_code)
);

-- Subscription Plans
CREATE TABLE IF NOT EXISTS mycheff.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    duration_months INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscription Plan Translations
CREATE TABLE IF NOT EXISTS mycheff.subscription_plan_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES mycheff.subscription_plans(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (plan_id, language_code)
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS mycheff.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES mycheff.subscription_plans(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_reference VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'completed',
    payment_method VARCHAR(50),
    is_auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- RECIPE TABLES
-- =====================================================

-- Recipes
CREATE TABLE IF NOT EXISTS mycheff.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_premium BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    cooking_time_minutes INTEGER NOT NULL,
    prep_time_minutes INTEGER,
    author_id UUID REFERENCES mycheff.users(id),
    difficulty_level SMALLINT CHECK (difficulty_level BETWEEN 1 AND 5),
    serving_size SMALLINT DEFAULT 4,
    is_published BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recipe Translations
CREATE TABLE IF NOT EXISTS mycheff.recipe_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    preparation_steps JSONB NOT NULL,
    tips TEXT[],
    search_vector TSVECTOR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (recipe_id, language_code)
);

-- Recipe Details
CREATE TABLE IF NOT EXISTS mycheff.recipe_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    nutritional_data JSONB,
    attributes JSONB,
    serving_size VARCHAR(30),
    estimated_cost DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (recipe_id)
);

-- Recipe Categories Junction
CREATE TABLE IF NOT EXISTS mycheff.recipe_categories (
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES mycheff.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, category_id)
);

-- Recipe Ingredients
CREATE TABLE IF NOT EXISTS mycheff.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2),
    unit VARCHAR(30),
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (recipe_id, ingredient_id)
);

-- Recipe Media
CREATE TABLE IF NOT EXISTS mycheff.recipe_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
    url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USER INTERACTION TABLES
-- =====================================================

-- User Ingredients
CREATE TABLE IF NOT EXISTS mycheff.user_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2),
    unit VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, ingredient_id)
);

-- Favorite Recipes
CREATE TABLE IF NOT EXISTS mycheff.favorite_recipes (
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id)
);

-- Recipe Ratings
CREATE TABLE IF NOT EXISTS mycheff.recipe_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, recipe_id)
);

-- Recipe Collections
CREATE TABLE IF NOT EXISTS mycheff.recipe_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    cover_image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Collection Recipes
CREATE TABLE IF NOT EXISTS mycheff.collection_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES mycheff.recipe_collections(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (collection_id, recipe_id)
);

-- =====================================================
-- SYSTEM TABLES
-- =====================================================

-- User Activities
CREATE TABLE IF NOT EXISTS mycheff.user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    recipe_id UUID REFERENCES mycheff.recipes(id) ON DELETE SET NULL,
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Push Notifications
CREATE TABLE IF NOT EXISTS mycheff.push_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES mycheff.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    notification_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Calorie Entries
CREATE TABLE IF NOT EXISTS mycheff.calorie_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES mycheff.recipes(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    calories DECIMAL(8,2) NOT NULL,
    serving_multiplier DECIMAL(4,2) DEFAULT 1,
    nutritional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- App Settings
CREATE TABLE IF NOT EXISTS mycheff.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    value_type VARCHAR(20) DEFAULT 'string',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_username_gin ON mycheff.users USING gin (username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_email ON mycheff.users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON mycheff.users(is_active) WHERE is_active = true;

-- Ingredient indexes
CREATE INDEX IF NOT EXISTS idx_ingredient_translations_name_trgm ON mycheff.ingredient_translations USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_ingredient_translations_aliases ON mycheff.ingredient_translations USING gin (aliases);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON mycheff.ingredients(category_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_unit ON mycheff.ingredients(unit_id);

-- Recipe indexes
CREATE INDEX IF NOT EXISTS idx_recipes_cooking_time ON mycheff.recipes(cooking_time_minutes);
CREATE INDEX IF NOT EXISTS idx_recipes_premium ON mycheff.recipes(is_premium) WHERE is_premium = true;
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON mycheff.recipes(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_recipes_featured ON mycheff.recipes(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_recipes_published ON mycheff.recipes(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON mycheff.recipes(average_rating DESC, rating_count DESC);

CREATE INDEX IF NOT EXISTS idx_recipe_translations_title_trgm ON mycheff.recipe_translations USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_recipe_translations_search ON mycheff.recipe_translations USING GIN(search_vector);

-- Relation indexes
CREATE INDEX IF NOT EXISTS idx_recipe_categories_category ON mycheff.recipe_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON mycheff.recipe_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON mycheff.recipe_ingredients(recipe_id);

-- User interaction indexes
CREATE INDEX IF NOT EXISTS idx_user_ingredients_user_id ON mycheff.user_ingredients(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ingredients_ingredient_id ON mycheff.user_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_favorite_recipes_user_id ON mycheff.favorite_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_recipe ON mycheff.recipe_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_user ON mycheff.recipe_ratings(user_id);

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================

DROP TRIGGER IF EXISTS update_users_modtime ON mycheff.users;
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON mycheff.users
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_units_modtime ON mycheff.units;
CREATE TRIGGER update_units_modtime
    BEFORE UPDATE ON mycheff.units
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_categories_modtime ON mycheff.categories;
CREATE TRIGGER update_categories_modtime
    BEFORE UPDATE ON mycheff.categories
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_category_translations_modtime ON mycheff.category_translations;
CREATE TRIGGER update_category_translations_modtime
    BEFORE UPDATE ON mycheff.category_translations
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_ingredient_categories_modtime ON mycheff.ingredient_categories;
CREATE TRIGGER update_ingredient_categories_modtime
    BEFORE UPDATE ON mycheff.ingredient_categories
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_ingredients_modtime ON mycheff.ingredients;
CREATE TRIGGER update_ingredients_modtime
    BEFORE UPDATE ON mycheff.ingredients
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_ingredient_translations_modtime ON mycheff.ingredient_translations;
CREATE TRIGGER update_ingredient_translations_modtime
    BEFORE UPDATE ON mycheff.ingredient_translations
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_subscription_plans_modtime ON mycheff.subscription_plans;
CREATE TRIGGER update_subscription_plans_modtime
    BEFORE UPDATE ON mycheff.subscription_plans
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_subscription_plan_translations_modtime ON mycheff.subscription_plan_translations;
CREATE TRIGGER update_subscription_plan_translations_modtime
    BEFORE UPDATE ON mycheff.subscription_plan_translations
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_modtime ON mycheff.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_modtime
    BEFORE UPDATE ON mycheff.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_recipes_modtime ON mycheff.recipes;
CREATE TRIGGER update_recipes_modtime
    BEFORE UPDATE ON mycheff.recipes
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_recipe_translations_modtime ON mycheff.recipe_translations;
CREATE TRIGGER update_recipe_translations_modtime
    BEFORE UPDATE ON mycheff.recipe_translations
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_recipe_details_modtime ON mycheff.recipe_details;
CREATE TRIGGER update_recipe_details_modtime
    BEFORE UPDATE ON mycheff.recipe_details
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_recipe_ingredients_modtime ON mycheff.recipe_ingredients;
CREATE TRIGGER update_recipe_ingredients_modtime
    BEFORE UPDATE ON mycheff.recipe_ingredients
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_recipe_media_modtime ON mycheff.recipe_media;
CREATE TRIGGER update_recipe_media_modtime
    BEFORE UPDATE ON mycheff.recipe_media
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_user_ingredients_modtime ON mycheff.user_ingredients;
CREATE TRIGGER update_user_ingredients_modtime
    BEFORE UPDATE ON mycheff.user_ingredients
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_recipe_ratings_modtime ON mycheff.recipe_ratings;
CREATE TRIGGER update_recipe_ratings_modtime
    BEFORE UPDATE ON mycheff.recipe_ratings
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_recipe_collections_modtime ON mycheff.recipe_collections;
CREATE TRIGGER update_recipe_collections_modtime
    BEFORE UPDATE ON mycheff.recipe_collections
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_collection_recipes_modtime ON mycheff.collection_recipes;
CREATE TRIGGER update_collection_recipes_modtime
    BEFORE UPDATE ON mycheff.collection_recipes
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

DROP TRIGGER IF EXISTS update_app_settings_modtime ON mycheff.app_settings;
CREATE TRIGGER update_app_settings_modtime
    BEFORE UPDATE ON mycheff.app_settings
    FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

-- =====================================================
-- VIEWS
-- =====================================================

CREATE OR REPLACE VIEW mycheff.active_premium_users AS
SELECT DISTINCT u.id, u.username, u.email, u.preferred_language
FROM mycheff.users u
JOIN mycheff.user_subscriptions us ON u.id = us.user_id
WHERE us.end_date > CURRENT_TIMESTAMP
AND us.payment_status = 'completed'
AND u.is_active = true;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Languages
INSERT INTO mycheff.languages (code, name) VALUES 
('tr', 'Türkçe'),
('en', 'English'),
('es', 'Español'),
('fr', 'Français'),
('de', 'Deutsch'),
('ar', 'العربية')
ON CONFLICT (code) DO NOTHING;

-- Units
INSERT INTO mycheff.units (code, system, base_unit_code, conversion_factor) VALUES
('gr', 'metric', 'gr', 1.0),
('kg', 'metric', 'gr', 1000.0),
('ml', 'metric', 'ml', 1.0),
('lt', 'metric', 'ml', 1000.0),
('adet', 'count', 'adet', 1.0),
('dilim', 'count', 'adet', 1.0),
('demet', 'count', 'adet', 1.0),
('salkım', 'count', 'adet', 1.0),
('diş', 'count', 'adet', 1.0),
('baş', 'count', 'adet', 1.0),
('bardak', 'metric', 'ml', 250.0),
('çay kaşığı', 'metric', 'ml', 5.0),
('yemek kaşığı', 'metric', 'ml', 15.0)
ON CONFLICT (code) DO NOTHING;

-- Unit translations
INSERT INTO mycheff.unit_translations (unit_id, language_code, name, short_name, plural_name)
SELECT u.id, 'tr', 
    CASE u.code
        WHEN 'gr' THEN 'gram'
        WHEN 'kg' THEN 'kilogram'
        WHEN 'ml' THEN 'mililitre'
        WHEN 'lt' THEN 'litre'
        WHEN 'adet' THEN 'adet'
        WHEN 'dilim' THEN 'dilim'
        WHEN 'demet' THEN 'demet'
        WHEN 'salkım' THEN 'salkım'
        WHEN 'diş' THEN 'diş'
        WHEN 'baş' THEN 'baş'
        WHEN 'bardak' THEN 'bardak'
        WHEN 'çay kaşığı' THEN 'çay kaşığı'
        WHEN 'yemek kaşığı' THEN 'yemek kaşığı'
    END,
    u.code,
    CASE u.code
        WHEN 'gr' THEN 'gram'
        WHEN 'kg' THEN 'kilogram'
        WHEN 'ml' THEN 'mililitre'
        WHEN 'lt' THEN 'litre'
        WHEN 'adet' THEN 'adet'
        WHEN 'dilim' THEN 'dilim'
        WHEN 'demet' THEN 'demet'
        WHEN 'salkım' THEN 'salkım'
        WHEN 'diş' THEN 'diş'
        WHEN 'baş' THEN 'baş'
        WHEN 'bardak' THEN 'bardak'
        WHEN 'çay kaşığı' THEN 'çay kaşığı'
        WHEN 'yemek kaşığı' THEN 'yemek kaşığı'
    END
FROM mycheff.units u
ON CONFLICT (unit_id, language_code) DO NOTHING;

-- Subscription plans
INSERT INTO mycheff.subscription_plans (name, duration_months, price, description, features, sort_order)
VALUES 
('Monthly Premium', 1, 29.99, 'Monthly premium membership', '{"premium_recipes": true, "ad_free": true, "unlimited_favorites": true}', 1),
('Yearly Premium', 12, 299.99, 'Yearly premium membership with discount', '{"premium_recipes": true, "ad_free": true, "unlimited_favorites": true, "priority_support": true}', 2),
('Free', 0, 0.00, 'Free basic membership', '{"basic_recipes": true, "limited_favorites": 10}', 0)
ON CONFLICT DO NOTHING;

-- Plan translations
INSERT INTO mycheff.subscription_plan_translations (plan_id, language_code, name, description)
SELECT sp.id, 'tr',
    CASE sp.name
        WHEN 'Monthly Premium' THEN 'Aylık Premium'
        WHEN 'Yearly Premium' THEN 'Yıllık Premium'
        WHEN 'Free' THEN 'Ücretsiz'
    END,
    CASE sp.name
        WHEN 'Monthly Premium' THEN 'Aylık premium üyelik'
        WHEN 'Yearly Premium' THEN 'İndirimli yıllık premium üyelik'
        WHEN 'Free' THEN 'Ücretsiz temel üyelik'
    END
FROM mycheff.subscription_plans sp
ON CONFLICT (plan_id, language_code) DO NOTHING;

-- Reset search path
RESET search_path;

-- =====================================================
-- FINAL MESSAGE (Database setup completed successfully)
-- ===================================================== 