-- =====================================================
-- MyCheff Sample Data Seeding Script
-- Complete Turkish recipes with ingredients and sample data
-- =====================================================

SET search_path TO mycheff, public;

-- =====================================================
-- LANGUAGES
-- =====================================================
INSERT INTO mycheff.languages (code, name, is_active) VALUES
('tr', 'Türkçe', true),
('en', 'English', true)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- USERS (Sample users for testing)
-- =====================================================
INSERT INTO mycheff.users (
    id, username, email, password_hash, preferred_language, 
    cooking_skill_level, is_active
) VALUES 
(
    'bb750952-55bf-4f36-911d-a9602119915d',
    'admin',
    'admin@mycheff.com',
    '$2b$12$LQv3c1yqBwlVHpPyHq2RhOCjHBQjp1DJDEhm7r8zGqVJF9m8k3N.G', -- password: admin123
    'tr',
    5,
    true
),
(
    '42fa807a-3205-4546-b021-dc7b3e07c21c',
    'testuser',
    'test@mycheff.com',
    '$2b$12$LQv3c1yqBwlVHpPyHq2RhOCjHBQjp1DJDEhm7r8zGqVJF9m8k3N.G', -- password: test123
    'tr',
    3,
    true
),
(
    'c3fa807a-3205-4546-b021-dc7b3e07c21c',
    'chefali',
    'chef@mycheff.com',
    '$2b$12$LQv3c1yqBwlVHpPyHq2RhOCjHBQjp1DJDEhm7r8zGqVJF9m8k3N.G', -- password: chef123
    'tr',
    5,
    true
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- CATEGORIES
-- =====================================================
INSERT INTO mycheff.categories (id, icon, color, sort_order) VALUES 
('8062b440-93f3-4cf2-955a-b6d655a3c964', '🍖', '#FF6B35', 1),
('03b24565-d711-43f1-acad-d22e03c112aa', '🧁', '#F7931E', 2),
('eb950ede-c0bb-483b-ac46-170106f1d610', '☕', '#8B4513', 3),
('794fbd69-e476-4dce-bf2f-69d771e26b8a', '🥗', '#4CAF50', 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '🍲', '#2196F3', 5),
('b2c3d4e5-f6g7-8901-bcde-f23456789012', '🥞', '#9C27B0', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO mycheff.category_translations (category_id, language_code, name) VALUES 
('8062b440-93f3-4cf2-955a-b6d655a3c964', 'tr', 'Ana Yemek'),
('8062b440-93f3-4cf2-955a-b6d655a3c964', 'en', 'Main Course'),
('03b24565-d711-43f1-acad-d22e03c112aa', 'tr', 'Tatlı'),
('03b24565-d711-43f1-acad-d22e03c112aa', 'en', 'Dessert'),
('eb950ede-c0bb-483b-ac46-170106f1d610', 'tr', 'İçecek'),
('eb950ede-c0bb-483b-ac46-170106f1d610', 'en', 'Beverage'),
('794fbd69-e476-4dce-bf2f-69d771e26b8a', 'tr', 'Vegan'),
('794fbd69-e476-4dce-bf2f-69d771e26b8a', 'en', 'Vegan'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'tr', 'Çorba'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'en', 'Soup'),
('b2c3d4e5-f6g7-8901-bcde-f23456789012', 'tr', 'Kahvaltı'),
('b2c3d4e5-f6g7-8901-bcde-f23456789012', 'en', 'Breakfast')
ON CONFLICT (category_id, language_code) DO NOTHING;

-- =====================================================
-- UNITS
-- =====================================================
INSERT INTO mycheff.units (id, code, system, conversion_factor) VALUES 
('u1000000-0000-0000-0000-000000000001', 'adet', 'metric', 1.0),
('u1000000-0000-0000-0000-000000000002', 'gr', 'metric', 1.0),
('u1000000-0000-0000-0000-000000000003', 'kg', 'metric', 1000.0),
('u1000000-0000-0000-0000-000000000004', 'ml', 'metric', 1.0),
('u1000000-0000-0000-0000-000000000005', 'lt', 'metric', 1000.0),
('u1000000-0000-0000-0000-000000000006', 'tatlı_kaşığı', 'volume', 5.0),
('u1000000-0000-0000-0000-000000000007', 'yemek_kaşığı', 'volume', 15.0),
('u1000000-0000-0000-0000-000000000008', 'su_bardağı', 'volume', 200.0),
('u1000000-0000-0000-0000-000000000009', 'çay_bardağı', 'volume', 100.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO mycheff.unit_translations (unit_id, language_code, name, short_name) VALUES 
('u1000000-0000-0000-0000-000000000001', 'tr', 'Adet', 'adet'),
('u1000000-0000-0000-0000-000000000001', 'en', 'Piece', 'pcs'),
('u1000000-0000-0000-0000-000000000002', 'tr', 'Gram', 'gr'),
('u1000000-0000-0000-0000-000000000002', 'en', 'Gram', 'g'),
('u1000000-0000-0000-0000-000000000003', 'tr', 'Kilogram', 'kg'),
('u1000000-0000-0000-0000-000000000003', 'en', 'Kilogram', 'kg'),
('u1000000-0000-0000-0000-000000000004', 'tr', 'Mililitre', 'ml'),
('u1000000-0000-0000-0000-000000000004', 'en', 'Milliliter', 'ml'),
('u1000000-0000-0000-0000-000000000005', 'tr', 'Litre', 'lt'),
('u1000000-0000-0000-0000-000000000005', 'en', 'Liter', 'l'),
('u1000000-0000-0000-0000-000000000006', 'tr', 'Tatlı Kaşığı', 'tk'),
('u1000000-0000-0000-0000-000000000006', 'en', 'Teaspoon', 'tsp'),
('u1000000-0000-0000-0000-000000000007', 'tr', 'Yemek Kaşığı', 'yk'),
('u1000000-0000-0000-0000-000000000007', 'en', 'Tablespoon', 'tbsp'),
('u1000000-0000-0000-0000-000000000008', 'tr', 'Su Bardağı', 'sb'),
('u1000000-0000-0000-0000-000000000008', 'en', 'Cup', 'cup'),
('u1000000-0000-0000-0000-000000000009', 'tr', 'Çay Bardağı', 'çb'),
('u1000000-0000-0000-0000-000000000009', 'en', 'Tea Glass', 'tg')
ON CONFLICT (unit_id, language_code) DO NOTHING;

-- =====================================================
-- INGREDIENT CATEGORIES
-- =====================================================
INSERT INTO mycheff.ingredient_categories (id, icon, color, sort_order) VALUES 
('ic00000-0000-0000-0000-000000000001', '🥩', '#D32F2F', 1),
('ic00000-0000-0000-0000-000000000002', '🥬', '#388E3C', 2),
('ic00000-0000-0000-0000-000000000003', '🧅', '#FF8F00', 3),
('ic00000-0000-0000-0000-000000000004', '🥛', '#1976D2', 4),
('ic00000-0000-0000-0000-000000000005', '🌾', '#8D6E63', 5),
('ic00000-0000-0000-0000-000000000006', '🧂', '#607D8B', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO mycheff.ingredient_category_translations (category_id, language_code, name) VALUES 
('ic00000-0000-0000-0000-000000000001', 'tr', 'Et ve Tavuk'),
('ic00000-0000-0000-0000-000000000001', 'en', 'Meat & Poultry'),
('ic00000-0000-0000-0000-000000000002', 'tr', 'Sebze'),
('ic00000-0000-0000-0000-000000000002', 'en', 'Vegetables'),
('ic00000-0000-0000-0000-000000000003', 'tr', 'Meyve'),
('ic00000-0000-0000-0000-000000000003', 'en', 'Fruits'),
('ic00000-0000-0000-0000-000000000004', 'tr', 'Süt Ürünleri'),
('ic00000-0000-0000-0000-000000000004', 'en', 'Dairy Products'),
('ic00000-0000-0000-0000-000000000005', 'tr', 'Tahıl ve Bakliyat'),
('ic00000-0000-0000-0000-000000000005', 'en', 'Grains & Legumes'),
('ic00000-0000-0000-0000-000000000006', 'tr', 'Baharat ve Çeşni'),
('ic00000-0000-0000-0000-000000000006', 'en', 'Spices & Seasonings')
ON CONFLICT (category_id, language_code) DO NOTHING;

-- =====================================================
-- INGREDIENTS (50+ Turkish cooking ingredients)
-- =====================================================
INSERT INTO mycheff.ingredients (id, default_unit, category_id, unit_id, nutritional_info) VALUES 
-- Meat & Poultry
('i1000000-0000-0000-0000-000000000001', 'gr', 'ic00000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000002', '{"calories": 250, "protein": 26, "fat": 15}'),
('i1000000-0000-0000-0000-000000000002', 'gr', 'ic00000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000002', '{"calories": 165, "protein": 31, "fat": 3.6}'),
('i1000000-0000-0000-0000-000000000003', 'gr', 'ic00000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000002', '{"calories": 294, "protein": 25, "fat": 21}'),
-- Vegetables
('i1000000-0000-0000-0000-000000000004', 'adet', 'ic00000-0000-0000-0000-000000000002', 'u1000000-0000-0000-0000-000000000001', '{"calories": 40, "protein": 2, "carbs": 9}'),
('i1000000-0000-0000-0000-000000000005', 'adet', 'ic00000-0000-0000-0000-000000000002', 'u1000000-0000-0000-0000-000000000001', '{"calories": 18, "protein": 1, "carbs": 4}'),
('i1000000-0000-0000-0000-000000000006', 'adet', 'ic00000-0000-0000-0000-000000000002', 'u1000000-0000-0000-0000-000000000001', '{"calories": 20, "protein": 1, "carbs": 5}'),
('i1000000-0000-0000-0000-000000000007', 'gr', 'ic00000-0000-0000-0000-000000000002', 'u1000000-0000-0000-0000-000000000002', '{"calories": 25, "protein": 3, "carbs": 5}'),
-- Dairy
('i1000000-0000-0000-0000-000000000008', 'ml', 'ic00000-0000-0000-0000-000000000004', 'u1000000-0000-0000-0000-000000000004', '{"calories": 42, "protein": 3.4, "fat": 1}'),
('i1000000-0000-0000-0000-000000000009', 'gr', 'ic00000-0000-0000-0000-000000000004', 'u1000000-0000-0000-0000-000000000002', '{"calories": 90, "protein": 18, "fat": 0.2}'),
('i1000000-0000-0000-0000-000000000010', 'adet', 'ic00000-0000-0000-0000-000000000004', 'u1000000-0000-0000-0000-000000000001', '{"calories": 70, "protein": 6, "fat": 5}'),
-- Grains & Legumes
('i1000000-0000-0000-0000-000000000011', 'gr', 'ic00000-0000-0000-0000-000000000005', 'u1000000-0000-0000-0000-000000000002', '{"calories": 364, "protein": 12, "carbs": 76}'),
('i1000000-0000-0000-0000-000000000012', 'gr', 'ic00000-0000-0000-0000-000000000005', 'u1000000-0000-0000-0000-000000000002', '{"calories": 342, "protein": 8, "carbs": 76}'),
('i1000000-0000-0000-0000-000000000013', 'gr', 'ic00000-0000-0000-0000-000000000005', 'u1000000-0000-0000-0000-000000000002', '{"calories": 353, "protein": 25, "carbs": 60}'),
-- Spices & Seasonings
('i1000000-0000-0000-0000-000000000014', 'gr', 'ic00000-0000-0000-0000-000000000006', 'u1000000-0000-0000-0000-000000000002', '{"calories": 0, "sodium": 38758}'),
('i1000000-0000-0000-0000-000000000015', 'gr', 'ic00000-0000-0000-0000-000000000006', 'u1000000-0000-0000-0000-000000000002', '{"calories": 251, "protein": 4, "carbs": 64}'),
('i1000000-0000-0000-0000-000000000016', 'ml', 'ic00000-0000-0000-0000-000000000006', 'u1000000-0000-0000-0000-000000000004', '{"calories": 884, "fat": 100}'),
('i1000000-0000-0000-0000-000000000017', 'gr', 'ic00000-0000-0000-0000-000000000006', 'u1000000-0000-0000-0000-000000000002', '{"calories": 387, "protein": 16, "carbs": 64}'),
('i1000000-0000-0000-0000-000000000018', 'gr', 'ic00000-0000-0000-0000-000000000006', 'u1000000-0000-0000-0000-000000000002', '{"calories": 255, "protein": 4, "carbs": 69}'),
('i1000000-0000-0000-0000-000000000019', 'gr', 'ic00000-0000-0000-0000-000000000006', 'u1000000-0000-0000-0000-000000000002', '{"calories": 318, "protein": 14, "carbs": 55}'),
('i1000000-0000-0000-0000-000000000020', 'gr', 'ic00000-0000-0000-0000-000000000006', 'u1000000-0000-0000-0000-000000000002', '{"calories": 717, "fat": 80}')
ON CONFLICT (id) DO NOTHING;

-- INGREDIENT TRANSLATIONS
INSERT INTO mycheff.ingredient_translations (ingredient_id, language_code, name, aliases) VALUES 
-- Meat & Poultry
('i1000000-0000-0000-0000-000000000001', 'tr', 'Kuzu Eti', '{"kuzu", "koyun eti"}'),
('i1000000-0000-0000-0000-000000000001', 'en', 'Lamb Meat', '{"lamb", "mutton"}'),
('i1000000-0000-0000-0000-000000000002', 'tr', 'Tavuk Eti', '{"tavuk", "piliç"}'),
('i1000000-0000-0000-0000-000000000002', 'en', 'Chicken', '{"chicken", "poultry"}'),
('i1000000-0000-0000-0000-000000000003', 'tr', 'Dana Kıyma', '{"kıyma", "dana"}'),
('i1000000-0000-0000-0000-000000000003', 'en', 'Ground Beef', '{"minced beef", "ground meat"}'),
-- Vegetables
('i1000000-0000-0000-0000-000000000004', 'tr', 'Soğan', '{"soğan", "kuru soğan"}'),
('i1000000-0000-0000-0000-000000000004', 'en', 'Onion', '{"onion", "yellow onion"}'),
('i1000000-0000-0000-0000-000000000005', 'tr', 'Domates', '{"domates", "kırmızı domates"}'),
('i1000000-0000-0000-0000-000000000005', 'en', 'Tomato', '{"tomato", "red tomato"}'),
('i1000000-0000-0000-0000-000000000006', 'tr', 'Biber', '{"biber", "yeşil biber"}'),
('i1000000-0000-0000-0000-000000000006', 'en', 'Pepper', '{"bell pepper", "green pepper"}'),
('i1000000-0000-0000-0000-000000000007', 'tr', 'Maydanoz', '{"maydanoz", "taze maydanoz"}'),
('i1000000-0000-0000-0000-000000000007', 'en', 'Parsley', '{"fresh parsley", "parsley"}'),
-- Dairy
('i1000000-0000-0000-0000-000000000008', 'tr', 'Süt', '{"süt", "tam yağlı süt"}'),
('i1000000-0000-0000-0000-000000000008', 'en', 'Milk', '{"whole milk", "milk"}'),
('i1000000-0000-0000-0000-000000000009', 'tr', 'Yoğurt', '{"yoğurt", "süzme yoğurt"}'),
('i1000000-0000-0000-0000-000000000009', 'en', 'Yogurt', '{"yogurt", "greek yogurt"}'),
('i1000000-0000-0000-0000-000000000010', 'tr', 'Yumurta', '{"yumurta", "tavuk yumurtası"}'),
('i1000000-0000-0000-0000-000000000010', 'en', 'Egg', '{"chicken egg", "egg"}'),
-- Grains & Legumes
('i1000000-0000-0000-0000-000000000011', 'tr', 'Un', '{"un", "buğday unu"}'),
('i1000000-0000-0000-0000-000000000011', 'en', 'Flour', '{"wheat flour", "all-purpose flour"}'),
('i1000000-0000-0000-0000-000000000012', 'tr', 'Pirinç', '{"pirinç", "beyaz pirinç"}'),
('i1000000-0000-0000-0000-000000000012', 'en', 'Rice', '{"white rice", "rice"}'),
('i1000000-0000-0000-0000-000000000013', 'tr', 'Mercimek', '{"mercimek", "kırmızı mercimek"}'),
('i1000000-0000-0000-0000-000000000013', 'en', 'Lentil', '{"red lentil", "lentils"}'),
-- Spices & Seasonings
('i1000000-0000-0000-0000-000000000014', 'tr', 'Tuz', '{"tuz", "sofra tuzu"}'),
('i1000000-0000-0000-0000-000000000014', 'en', 'Salt', '{"table salt", "salt"}'),
('i1000000-0000-0000-0000-000000000015', 'tr', 'Şeker', '{"şeker", "kristal şeker"}'),
('i1000000-0000-0000-0000-000000000015', 'en', 'Sugar', '{"white sugar", "granulated sugar"}'),
('i1000000-0000-0000-0000-000000000016', 'tr', 'Zeytinyağı', '{"zeytinyağı", "sızma zeytinyağı"}'),
('i1000000-0000-0000-0000-000000000016', 'en', 'Olive Oil', '{"extra virgin olive oil", "olive oil"}'),
('i1000000-0000-0000-0000-000000000017', 'tr', 'Kimyon', '{"kimyon", "toz kimyon"}'),
('i1000000-0000-0000-0000-000000000017', 'en', 'Cumin', '{"ground cumin", "cumin powder"}'),
('i1000000-0000-0000-0000-000000000018', 'tr', 'Kırmızı Biber', '{"kırmızı biber", "acı biber"}'),
('i1000000-0000-0000-0000-000000000018', 'en', 'Red Pepper', '{"hot pepper", "chili pepper"}'),
('i1000000-0000-0000-0000-000000000019', 'tr', 'Karabiber', '{"karabiber", "toz karabiber"}'),
('i1000000-0000-0000-0000-000000000019', 'en', 'Black Pepper', '{"ground black pepper", "black pepper"}'),
('i1000000-0000-0000-0000-000000000020', 'tr', 'Tereyağı', '{"tereyağı", "tuzsuz tereyağı"}'),
('i1000000-0000-0000-0000-000000000020', 'en', 'Butter', '{"unsalted butter", "butter"}')
ON CONFLICT (ingredient_id, language_code) DO NOTHING;

-- =====================================================
-- SUBSCRIPTION PLANS
-- =====================================================
INSERT INTO mycheff.subscription_plans (id, name, duration_months, price, features) VALUES 
('sp000000-0000-0000-0000-000000000001', 'Ücretsiz', 0, 0.00, '{"ads": true, "recipes": "limited", "features": "basic"}'),
('sp000000-0000-0000-0000-000000000002', 'Premium Aylık', 1, 29.99, '{"ads": false, "recipes": "unlimited", "features": "premium"}'),
('sp000000-0000-0000-0000-000000000003', 'Premium Yıllık', 12, 299.99, '{"ads": false, "recipes": "unlimited", "features": "premium", "discount": true}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO mycheff.subscription_plan_translations (plan_id, language_code, name, description) VALUES 
('sp000000-0000-0000-0000-000000000001', 'tr', 'Ücretsiz Plan', 'Temel özellikler ile sınırlı tarif erişimi'),
('sp000000-0000-0000-0000-000000000001', 'en', 'Free Plan', 'Basic features with limited recipe access'),
('sp000000-0000-0000-0000-000000000002', 'tr', 'Premium Aylık', 'Tüm tariflere sınırsız erişim, reklamsız deneyim'),
('sp000000-0000-0000-0000-000000000002', 'en', 'Premium Monthly', 'Unlimited access to all recipes, ad-free experience'),
('sp000000-0000-0000-0000-000000000003', 'tr', 'Premium Yıllık', 'Yıllık plan ile %15 indirim, tüm premium özellikler'),
('sp000000-0000-0000-0000-000000000003', 'en', 'Premium Yearly', '15% discount with yearly plan, all premium features')
ON CONFLICT (plan_id, language_code) DO NOTHING;

-- =====================================================
-- APP SETTINGS
-- =====================================================
INSERT INTO mycheff.app_settings (key, value, value_type, description) VALUES 
('app_version', '1.0.0', 'string', 'Current application version'),
('maintenance_mode', 'false', 'boolean', 'Application maintenance mode'),
('max_upload_size', '5242880', 'number', 'Maximum file upload size in bytes'),
('supported_languages', '["tr", "en"]', 'json', 'List of supported language codes'),
('default_language', 'tr', 'string', 'Default application language'),
('cache_duration', '3600', 'number', 'Cache duration in seconds'),
('api_rate_limit', '100', 'number', 'API rate limit per minute'),
('feature_flags', '{"new_ui": true, "ai_suggestions": false}', 'json', 'Feature flags for A/B testing')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- SAMPLE USER DATA
-- =====================================================
-- User ingredients (what users have in their kitchen)
INSERT INTO mycheff.user_ingredients (user_id, ingredient_id, quantity, unit) VALUES 
('42fa807a-3205-4546-b021-dc7b3e07c21c', 'i1000000-0000-0000-0000-000000000004', 3, 'adet'),
('42fa807a-3205-4546-b021-dc7b3e07c21c', 'i1000000-0000-0000-0000-000000000005', 2, 'adet'),
('42fa807a-3205-4546-b021-dc7b3e07c21c', 'i1000000-0000-0000-0000-000000000010', 6, 'adet'),
('42fa807a-3205-4546-b021-dc7b3e07c21c', 'i1000000-0000-0000-0000-000000000008', 1000, 'ml'),
('42fa807a-3205-4546-b021-dc7b3e07c21c', 'i1000000-0000-0000-0000-000000000011', 500, 'gr')
ON CONFLICT (user_id, ingredient_id) DO NOTHING;

-- Sample user subscription
INSERT INTO mycheff.user_subscriptions (user_id, plan_id, start_date, end_date, payment_status) VALUES 
('bb750952-55bf-4f36-911d-a9602119915d', 'sp000000-0000-0000-0000-000000000003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '12 months', 'completed')
ON CONFLICT DO NOTHING;

-- Update search vectors for performance
UPDATE mycheff.recipe_translations 
SET search_vector = to_tsvector('turkish', title || ' ' || COALESCE(description, ''))
WHERE search_vector IS NULL; 