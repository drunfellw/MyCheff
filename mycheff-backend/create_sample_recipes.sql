-- Insert sample Turkish recipes with images
-- First, let's ensure we have a default user and categories

DO $$
DECLARE
    admin_user_id UUID;
    turkish_lang_code VARCHAR(2) := 'tr';
    category_ana_yemek UUID;
    category_et_yemekleri UUID;
    category_sebze_yemekleri UUID;
    category_hamur_isi UUID;
    category_kahvalti UUID;
    category_tatli UUID;
    category_garnitur UUID;
BEGIN
    -- Get or create admin user
    SELECT id INTO admin_user_id FROM mycheff.users WHERE email = 'admin@mycheff.com' LIMIT 1;
    
    IF admin_user_id IS NULL THEN
        INSERT INTO mycheff.users (id, username, email, password_hash, preferred_language, full_name, is_active)
        VALUES (gen_random_uuid(), 'admin', 'admin@mycheff.com', '$2b$10$dummy.hash.for.admin.user', 'tr', 'Admin User', true)
        RETURNING id INTO admin_user_id;
    END IF;

    -- Get category IDs (assuming they exist from previous setup)
    SELECT id INTO category_ana_yemek FROM mycheff.categories c
    JOIN mycheff.category_translations ct ON c.id = ct.category_id
    WHERE ct.name = 'Ana Yemek' AND ct.language_code = 'tr' LIMIT 1;

    SELECT id INTO category_et_yemekleri FROM mycheff.categories c
    JOIN mycheff.category_translations ct ON c.id = ct.category_id
    WHERE ct.name = 'Et Yemekleri' AND ct.language_code = 'tr' LIMIT 1;

    SELECT id INTO category_sebze_yemekleri FROM mycheff.categories c
    JOIN mycheff.category_translations ct ON c.id = ct.category_id
    WHERE ct.name = 'Sebze Yemekleri' AND ct.language_code = 'tr' LIMIT 1;

    -- If categories don't exist, create them
    IF category_ana_yemek IS NULL THEN
        INSERT INTO mycheff.categories (id, icon, color, sort_order, is_active)
        VALUES (gen_random_uuid(), '🍽️', '#FF6B35', 1, true)
        RETURNING id INTO category_ana_yemek;
        
        INSERT INTO mycheff.category_translations (category_id, language_code, name)
        VALUES (category_ana_yemek, 'tr', 'Ana Yemek');
    END IF;

    -- Insert recipes
    
    -- 1. Döner Kebab
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes, 
        difficulty_level, serving_size, is_premium, is_published, is_active,
        image_url, nutritional_data, attributes
    ) VALUES (
        gen_random_uuid(), admin_user_id, category_ana_yemek, 45, 30, 3, 4, false, true, true,
        '/uploads/recipes/doner-kebab.jpg',
        '{"calories": 320, "protein": 25, "carbohydrates": 15, "fat": 18}'::jsonb,
        '{"isHalal": true, "spiceLevel": 2}'::jsonb
    );

    -- 2. Adana Kebabı
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes, 
        difficulty_level, serving_size, is_premium, is_published, is_active,
        image_url, nutritional_data, attributes
    ) VALUES (
        gen_random_uuid(), admin_user_id, category_ana_yemek, 25, 20, 2, 6, false, true, true,
        '/uploads/recipes/adana-kebab.jpg',
        '{"calories": 280, "protein": 22, "carbohydrates": 8, "fat": 16}'::jsonb,
        '{"isHalal": true, "spiceLevel": 4}'::jsonb
    );

    -- 3. İskender Kebab
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes, 
        difficulty_level, serving_size, is_premium, is_published, is_active,
        image_url, nutritional_data, attributes
    ) VALUES (
        gen_random_uuid(), admin_user_id, category_ana_yemek, 30, 15, 3, 4, false, true, true,
        '/uploads/recipes/iskender-kebab.jpg',
        '{"calories": 380, "protein": 28, "carbohydrates": 20, "fat": 22}'::jsonb,
        '{"isHalal": true, "spiceLevel": 2}'::jsonb
    );

    -- 4. Lahmacun
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes, 
        difficulty_level, serving_size, is_premium, is_published, is_active,
        image_url, nutritional_data, attributes
    ) VALUES (
        gen_random_uuid(), admin_user_id, category_ana_yemek, 15, 60, 4, 8, false, true, true,
        '/uploads/recipes/lahmacun.jpg',
        '{"calories": 220, "protein": 12, "carbohydrates": 28, "fat": 8}'::jsonb,
        '{"isHalal": true, "spiceLevel": 3}'::jsonb
    );

    -- 5. Karnıyarık
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes, 
        difficulty_level, serving_size, is_premium, is_published, is_active,
        image_url, nutritional_data, attributes
    ) VALUES (
        gen_random_uuid(), admin_user_id, category_ana_yemek, 45, 30, 3, 6, false, true, true,
        '/uploads/recipes/karniyarik.jpg',
        '{"calories": 180, "protein": 8, "carbohydrates": 15, "fat": 12}'::jsonb,
        '{"isVegetarian": false, "spiceLevel": 2}'::jsonb
    );

    -- 6. Menemen
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes, 
        difficulty_level, serving_size, is_premium, is_published, is_active,
        image_url, nutritional_data, attributes
    ) VALUES (
        gen_random_uuid(), admin_user_id, category_ana_yemek, 15, 10, 1, 2, false, true, true,
        '/uploads/recipes/menemen.jpg',
        '{"calories": 160, "protein": 12, "carbohydrates": 8, "fat": 10}'::jsonb,
        '{"isVegetarian": true, "spiceLevel": 1}'::jsonb
    );

    -- 7. Su Böreği
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes, 
        difficulty_level, serving_size, is_premium, is_published, is_active,
        image_url, nutritional_data, attributes
    ) VALUES (
        gen_random_uuid(), admin_user_id, category_ana_yemek, 60, 45, 4, 8, false, true, true,
        '/uploads/recipes/su-boregi.jpg',
        '{"calories": 320, "protein": 15, "carbohydrates": 35, "fat": 14}'::jsonb,
        '{"isVegetarian": true, "spiceLevel": 0}'::jsonb
    );

    -- 8. Mantı
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes, 
        difficulty_level, serving_size, is_premium, is_published, is_active,
        image_url, nutritional_data, attributes
    ) VALUES (
        gen_random_uuid(), admin_user_id, category_ana_yemek, 30, 90, 5, 4, false, true, true,
        '/uploads/recipes/manti.jpg',
        '{"calories": 420, "protein": 18, "carbohydrates": 45, "fat": 18}'::jsonb,
        '{"isHalal": true, "spiceLevel": 1}'::jsonb
    );

    -- 9. Baklava
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes, 
        difficulty_level, serving_size, is_premium, is_published, is_active,
        image_url, nutritional_data, attributes
    ) VALUES (
        gen_random_uuid(), admin_user_id, category_ana_yemek, 45, 60, 4, 12, false, true, true,
        '/uploads/recipes/baklava.jpg',
        '{"calories": 480, "protein": 8, "carbohydrates": 55, "fat": 24}'::jsonb,
        '{"isVegetarian": true, "spiceLevel": 0}'::jsonb
    );

    -- 10. Bulgur Pilavı
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes, 
        difficulty_level, serving_size, is_premium, is_published, is_active,
        image_url, nutritional_data, attributes
    ) VALUES (
        gen_random_uuid(), admin_user_id, category_ana_yemek, 30, 10, 2, 6, false, true, true,
        '/uploads/recipes/pilav.jpg',
        '{"calories": 180, "protein": 6, "carbohydrates": 35, "fat": 2}'::jsonb,
        '{"isVegan": true, "spiceLevel": 0}'::jsonb
    );

    RAISE NOTICE 'Successfully inserted 10 sample Turkish recipes with images!';

END $$; 