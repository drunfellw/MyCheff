-- Remaining Turkish Recipes (13-20) to complete the full set

DO $$
DECLARE
    -- User IDs (from database)
    admin_user_id UUID := 'bb750952-55bf-4f36-911d-a9602119915d';
    test_user_id UUID := '42fa807a-3205-4546-b021-dc7b3e07c21c';
    
    -- Category IDs (from database)
    ana_yemek_id UUID := '8062b440-93f3-4cf2-955a-b6d655a3c964';
    tatli_id UUID := '03b24565-d711-43f1-acad-d22e03c112aa';
    icecek_id UUID := 'eb950ede-c0bb-483b-ac46-170106f1d610';
    vegan_id UUID := '794fbd69-e476-4dce-bf2f-69d771e26b8a';
    
    -- Recipe IDs for remaining recipes (13-20)
    remaining_recipe_ids UUID[] := ARRAY[
        gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
        gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), gen_random_uuid()
    ];
    
BEGIN
    RAISE NOTICE 'Starting to insert remaining 8 Turkish recipes (13-20)...';

    -- Recipe 13: Pide
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes,
        difficulty_level, serving_size, is_premium, is_published, is_active,
        view_count, average_rating, rating_count
    ) VALUES (
        remaining_recipe_ids[1], admin_user_id, ana_yemek_id, 25, 90, 3, 4, false, true, true,
        135, 4.4, 29
    );

    INSERT INTO mycheff.recipe_translations (
        id, recipe_id, language_code, title, description, preparation_steps, tips
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[1], 'tr', 'Karadeniz Pidesi',
        'Yumurtalı, peynirli geleneksel Karadeniz pidesi. Fırında pişen nefis lezzet.',
        '[
            {"step": 1, "title": "Hamuru Hazırlayın", "description": "Un, maya, su ve tuz ile hamur yoğurun."},
            {"step": 2, "title": "Mayalandırın", "description": "Hamuru 1 saat mayalandırın."},
            {"step": 3, "title": "Şekil Verin", "description": "Hamuru pide şeklinde açın, kenarlarını kaldırın."},
            {"step": 4, "title": "İç Harcı Ekleyin", "description": "Peynir ve yumurtayı içine koyun."},
            {"step": 5, "title": "Pişirin", "description": "220°C fırında 15-20 dakika pişirin."}
        ]'::jsonb,
        '["Hamur iyi mayalanmalı", "Kenarlar yüksek olmalı", "Sıcak servis edin"]'::jsonb
    );

    INSERT INTO mycheff.recipe_media (
        id, recipe_id, media_type, url, is_primary, display_order, alt_text, purpose
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[1], 'photo',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
        true, 1, 'Karadeniz Pidesi', 'primary'
    );

    INSERT INTO mycheff.recipe_details (
        id, recipe_id, nutritional_data, attributes, serving_size, estimated_cost
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[1],
        '{"calories": 380, "protein": 18, "carbohydrates": 45, "fat": 16, "fiber": 3}'::jsonb,
        '{"isVegetarian": true, "spiceLevel": 0, "glutenFree": false}'::jsonb,
        '4 kişilik', 22.00
    );

    -- Recipe 14: Simit
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes,
        difficulty_level, serving_size, is_premium, is_published, is_active,
        view_count, average_rating, rating_count
    ) VALUES (
        remaining_recipe_ids[2], test_user_id, ana_yemek_id, 30, 180, 4, 8, false, true, true,
        75, 4.2, 18
    );

    INSERT INTO mycheff.recipe_translations (
        id, recipe_id, language_code, title, description, preparation_steps, tips
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[2], 'tr', 'Ev Yapımı Simit',
        'Susamlı Türk simiti. Kahvaltının vazgeçilmez lezzeti evde yapım tarifi.',
        '[
            {"step": 1, "title": "Hamuru Hazırlayın", "description": "Un, maya, su, tuz ve şeker ile hamur yoğurun."},
            {"step": 2, "title": "Mayalandırın", "description": "Hamuru 2 saat mayalandırın."},
            {"step": 3, "title": "Şekil Verin", "description": "Hamuru uzun çubuklarhalinde açıp halka yapın."},
            {"step": 4, "title": "Kaynar Suda Geçirin", "description": "Hafifçe kaynar suda 30 saniye bekletin."},
            {"step": 5, "title": "Susam Sürün", "description": "Üzerine susam serpin."},
            {"step": 6, "title": "Pişirin", "description": "200°C fırında 20-25 dakika pişirin."}
        ]'::jsonb,
        '["Hamur elastik olmalı", "Su çok kaynamamalı", "Altın rengi olana kadar pişirin"]'::jsonb
    );

    INSERT INTO mycheff.recipe_media (
        id, recipe_id, media_type, url, is_primary, display_order, alt_text, purpose
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[2], 'photo',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
        true, 1, 'Ev Yapımı Simit', 'primary'
    );

    INSERT INTO mycheff.recipe_details (
        id, recipe_id, nutritional_data, attributes, serving_size, estimated_cost
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[2],
        '{"calories": 280, "protein": 9, "carbohydrates": 55, "fat": 4, "fiber": 3}'::jsonb,
        '{"isVegan": true, "spiceLevel": 0, "glutenFree": false}'::jsonb,
        '8 kişilik', 12.00
    );

    -- Recipe 15: Künefe
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes,
        difficulty_level, serving_size, is_premium, is_published, is_active,
        is_featured, view_count, average_rating, rating_count
    ) VALUES (
        remaining_recipe_ids[3], admin_user_id, tatli_id, 20, 30, 3, 6, false, true, true,
        true, 220, 4.7, 42
    );

    INSERT INTO mycheff.recipe_translations (
        id, recipe_id, language_code, title, description, preparation_steps, tips
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[3], 'tr', 'Künefe',
        'Tel kadayıflı, peynirli geleneksel Türk tatlısı. Sıcak servis edilen enfes lezzet.',
        '[
            {"step": 1, "title": "Kadayıfı Hazırlayın", "description": "Tel kadayıfı ince ince doğrayın."},
            {"step": 2, "title": "Tereyağı Ekleyin", "description": "Eritilmiş tereyağı ile karıştırın."},
            {"step": 3, "title": "Katman Yapın", "description": "Yarısını tepsiye serin, peynir koyun, kapatın."},
            {"step": 4, "title": "Pişirin", "description": "180°C fırında 15-20 dakika altın rengi olana kadar pişirin."},
            {"step": 5, "title": "Şerbet Dökün", "description": "Sıcak künefe üzerine soğuk şerbet dökün."}
        ]'::jsonb,
        '["Kadayıf çok ince doğranmalı", "Peynir tatlı olmalı", "Sıcak servis edin"]'::jsonb
    );

    INSERT INTO mycheff.recipe_media (
        id, recipe_id, media_type, url, is_primary, display_order, alt_text, purpose
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[3], 'photo',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        true, 1, 'Künefe', 'primary'
    );

    INSERT INTO mycheff.recipe_details (
        id, recipe_id, nutritional_data, attributes, serving_size, estimated_cost
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[3],
        '{"calories": 520, "protein": 12, "carbohydrates": 60, "fat": 28, "fiber": 2}'::jsonb,
        '{"isVegetarian": true, "spiceLevel": 0, "glutenFree": false}'::jsonb,
        '6 kişilik', 35.00
    );

    -- Recipe 16: Çorba (Mercimek)
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes,
        difficulty_level, serving_size, is_premium, is_published, is_active,
        view_count, average_rating, rating_count
    ) VALUES (
        remaining_recipe_ids[4], test_user_id, vegan_id, 30, 15, 1, 6, false, true, true,
        85, 4.3, 21
    );

    INSERT INTO mycheff.recipe_translations (
        id, recipe_id, language_code, title, description, preparation_steps, tips
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[4], 'tr', 'Mercimek Çorbası',
        'Kırmızı mercimekli geleneksel Türk çorbası. Sağlıklı ve doyurucu.',
        '[
            {"step": 1, "title": "Malzemeleri Hazırlayın", "description": "Mercimek, soğan, havuç ve patatesi temizleyin."},
            {"step": 2, "title": "Sebzeleri Kavurun", "description": "Soğanı tereyağında kavurun."},
            {"step": 3, "title": "Mercimek Ekleyin", "description": "Mercimek ve diğer sebzeleri ekleyin."},
            {"step": 4, "title": "Su Ekleyip Pişirin", "description": "Su ekleyip 25 dakika kaynatın."},
            {"step": 5, "title": "Blenderdan Geçirin", "description": "Pürüzsüz olana kadar blenderdan geçirin."}
        ]'::jsonb,
        '["Mercimekler yumuşak olmalı", "Kıvamını ayarlayın", "Limon ile servis edin"]'::jsonb
    );

    INSERT INTO mycheff.recipe_media (
        id, recipe_id, media_type, url, is_primary, display_order, alt_text, purpose
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[4], 'photo',
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
        true, 1, 'Mercimek Çorbası', 'primary'
    );

    INSERT INTO mycheff.recipe_details (
        id, recipe_id, nutritional_data, attributes, serving_size, estimated_cost
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[4],
        '{"calories": 180, "protein": 12, "carbohydrates": 28, "fat": 4, "fiber": 8}'::jsonb,
        '{"isVegan": true, "isVegetarian": true, "spiceLevel": 1, "glutenFree": true}'::jsonb,
        '6 kişilik', 15.00
    );

    -- Recipe 17: Ayran
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes,
        difficulty_level, serving_size, is_premium, is_published, is_active,
        view_count, average_rating, rating_count
    ) VALUES (
        remaining_recipe_ids[5], admin_user_id, icecek_id, 5, 5, 1, 4, false, true, true,
        65, 4.1, 16
    );

    INSERT INTO mycheff.recipe_translations (
        id, recipe_id, language_code, title, description, preparation_steps, tips
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[5], 'tr', 'Ev Yapımı Ayran',
        'Yoğurtlu geleneksel Türk içeceği. Serinletici ve sağlıklı.',
        '[
            {"step": 1, "title": "Yoğurdu Hazırlayın", "description": "Tam yağlı yoğurdu kaseye alın."},
            {"step": 2, "title": "Su Ekleyin", "description": "Soğuk su ekleyip karıştırın."},
            {"step": 3, "title": "Tuz Ekleyin", "description": "Bir tutam tuz ekleyin."},
            {"step": 4, "title": "Çırpın", "description": "Tel çırpıcı ile iyice çırpın."},
            {"step": 5, "title": "Soğuk Servis Edin", "description": "Buzdolabında soğutup servis edin."}
        ]'::jsonb,
        '["Yoğurt taze olmalı", "Su oranını ayarlayın", "Köpüklü çırpın"]'::jsonb
    );

    INSERT INTO mycheff.recipe_media (
        id, recipe_id, media_type, url, is_primary, display_order, alt_text, purpose
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[5], 'photo',
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
        true, 1, 'Ev Yapımı Ayran', 'primary'
    );

    INSERT INTO mycheff.recipe_details (
        id, recipe_id, nutritional_data, attributes, serving_size, estimated_cost
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[5],
        '{"calories": 80, "protein": 4, "carbohydrates": 6, "fat": 4, "fiber": 0}'::jsonb,
        '{"isVegetarian": true, "spiceLevel": 0, "glutenFree": true, "probiotics": true}'::jsonb,
        '4 kişilik', 8.00
    );

    -- Recipe 18: Dolma
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes,
        difficulty_level, serving_size, is_premium, is_published, is_active,
        view_count, average_rating, rating_count
    ) VALUES (
        remaining_recipe_ids[6], test_user_id, ana_yemek_id, 60, 45, 4, 8, false, true, true,
        105, 4.6, 33
    );

    INSERT INTO mycheff.recipe_translations (
        id, recipe_id, language_code, title, description, preparation_steps, tips
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[6], 'tr', 'Yaprak Dolması',
        'Asma yaprağı içinde pirinçli dolma. Geleneksel Türk mutfağının incisi.',
        '[
            {"step": 1, "title": "Yaprakları Hazırlayın", "description": "Asma yapraklarını kaynar suda haşlayın."},
            {"step": 2, "title": "İç Harcı Yapın", "description": "Pirinç, soğan, maydanoz ve baharatları karıştırın."},
            {"step": 3, "title": "Dolma Sarın", "description": "Her yaprağa harç koyup sıkıca sarın."},
            {"step": 4, "title": "Tencereye Dizin", "description": "Dolmaları tencereye yan yana dizin."},
            {"step": 5, "title": "Pişirin", "description": "Üzerini geçecek kadar su ekleyip 45 dakika pişirin."}
        ]'::jsonb,
        '["Yapraklar yumuşak olmalı", "Sıkı sarın", "Limon ile servis edin"]'::jsonb
    );

    INSERT INTO mycheff.recipe_media (
        id, recipe_id, media_type, url, is_primary, display_order, alt_text, purpose
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[6], 'photo',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        true, 1, 'Yaprak Dolması', 'primary'
    );

    INSERT INTO mycheff.recipe_details (
        id, recipe_id, nutritional_data, attributes, serving_size, estimated_cost
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[6],
        '{"calories": 150, "protein": 4, "carbohydrates": 32, "fat": 2, "fiber": 3}'::jsonb,
        '{"isVegan": true, "isVegetarian": true, "spiceLevel": 1, "glutenFree": true}'::jsonb,
        '8 kişilik', 25.00
    );

    -- Recipe 19: Lokma
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes,
        difficulty_level, serving_size, is_premium, is_published, is_active,
        is_featured, view_count, average_rating, rating_count
    ) VALUES (
        remaining_recipe_ids[7], admin_user_id, tatli_id, 20, 120, 3, 10, false, true, true,
        true, 190, 4.5, 38
    );

    INSERT INTO mycheff.recipe_translations (
        id, recipe_id, language_code, title, description, preparation_steps, tips
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[7], 'tr', 'Lokma Tatlısı',
        'Yağda kızartılıp şerbete batırılan geleneksel Türk tatlısı.',
        '[
            {"step": 1, "title": "Hamuru Hazırlayın", "description": "Un, maya, su ve tuz ile yumuşak hamur yoğurun."},
            {"step": 2, "title": "Mayalandırın", "description": "Hamuru 2 saat mayalandırın."},
            {"step": 3, "title": "Şerbet Hazırlayın", "description": "Şeker, su ve limon ile şerbet kaynatın."},
            {"step": 4, "title": "Kızartın", "description": "Hamurdan küçük toplar yapıp yağda kızartın."},
            {"step": 5, "title": "Şerbete Batırın", "description": "Sıcak lokmaları soğuk şerbete batırın."}
        ]'::jsonb,
        '["Hamur iyi mayalanmalı", "Yağ çok sıcak olmalı", "Hemen şerbete batırın"]'::jsonb
    );

    INSERT INTO mycheff.recipe_media (
        id, recipe_id, media_type, url, is_primary, display_order, alt_text, purpose
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[7], 'photo',
        'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=800&h=600&fit=crop',
        true, 1, 'Lokma Tatlısı', 'primary'
    );

    INSERT INTO mycheff.recipe_details (
        id, recipe_id, nutritional_data, attributes, serving_size, estimated_cost
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[7],
        '{"calories": 280, "protein": 4, "carbohydrates": 45, "fat": 10, "fiber": 1}'::jsonb,
        '{"isVegetarian": true, "spiceLevel": 0, "glutenFree": false}'::jsonb,
        '10 kişilik', 20.00
    );

    -- Recipe 20: Börek (Sigara)
    INSERT INTO mycheff.recipes (
        id, author_id, category_id, cooking_time_minutes, prep_time_minutes,
        difficulty_level, serving_size, is_premium, is_published, is_active,
        view_count, average_rating, rating_count
    ) VALUES (
        remaining_recipe_ids[8], test_user_id, ana_yemek_id, 25, 40, 3, 6, false, true, true,
        125, 4.4, 27
    );

    INSERT INTO mycheff.recipe_translations (
        id, recipe_id, language_code, title, description, preparation_steps, tips
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[8], 'tr', 'Sigara Böreği',
        'Peynirli sigara böreği. Çıtır çıtır, lezzetli Türk böreği.',
        '[
            {"step": 1, "title": "İç Harcı Hazırlayın", "description": "Beyaz peynir, maydanoz ve yumurtayı karıştırın."},
            {"step": 2, "title": "Yufkaları Kesin", "description": "Yufkaları üçgen şeklinde kesin."},
            {"step": 3, "title": "Harç Koyup Sarın", "description": "Her üçgene harç koyup sigara şeklinde sarın."},
            {"step": 4, "title": "Yumurta Sürün", "description": "Üzerine çırpılmış yumurta sürün."},
            {"step": 5, "title": "Kızartın", "description": "Sıcak yağda altın rengi olana kadar kızartın."}
        ]'::jsonb,
        '["Sıkı sarın", "Yağ çok sıcak olmalı", "Sıcak servis edin"]'::jsonb
    );

    INSERT INTO mycheff.recipe_media (
        id, recipe_id, media_type, url, is_primary, display_order, alt_text, purpose
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[8], 'photo',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
        true, 1, 'Sigara Böreği', 'primary'
    );

    INSERT INTO mycheff.recipe_details (
        id, recipe_id, nutritional_data, attributes, serving_size, estimated_cost
    ) VALUES (
        gen_random_uuid(), remaining_recipe_ids[8],
        '{"calories": 320, "protein": 14, "carbohydrates": 25, "fat": 20, "fiber": 2}'::jsonb,
        '{"isVegetarian": true, "spiceLevel": 0, "glutenFree": false}'::jsonb,
        '6 kişilik', 18.00
    );

    RAISE NOTICE 'Successfully inserted remaining 8 Turkish recipes (13-20)!';
    RAISE NOTICE 'Total: 20 complete Turkish recipes with full data now in database!';

END $$; 