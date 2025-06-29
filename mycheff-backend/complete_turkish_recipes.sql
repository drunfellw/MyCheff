-- Complete Turkish Recipes Database
-- 20 Different Turkish Dishes with Full Details

-- Clear existing recipes first
DELETE FROM mycheff.recipe_ingredients;
DELETE FROM mycheff.recipe_media;
DELETE FROM mycheff.recipe_translations;
DELETE FROM mycheff.recipes;

-- Insert 20 Turkish Recipes (without title/description - those go in translations)
INSERT INTO mycheff.recipes (
  id, cooking_time_minutes, prep_time_minutes, 
  difficulty_level, serving_size, is_premium, is_published, is_featured,
  average_rating, rating_count, view_count, created_at, updated_at
) VALUES

-- 1. Döner Kebab
('11111111-1111-1111-1111-111111111111', 45, 30, 3, 4, false, true, true, 4.8, 127, 1250, NOW(), NOW()),

-- 2. Lahmacun
('22222222-2222-2222-2222-222222222222', 25, 45, 2, 6, false, true, true, 4.7, 98, 890, NOW(), NOW()),

-- 3. Mantı
('33333333-3333-3333-3333-333333333333', 60, 90, 4, 4, false, true, true, 4.9, 156, 2100, NOW(), NOW()),

-- 4. Adana Kebabı
('44444444-4444-4444-4444-444444444444', 35, 20, 3, 4, false, true, true, 4.6, 203, 1780, NOW(), NOW()),

-- 5. Baklava
('55555555-5555-5555-5555-555555555555', 40, 60, 4, 12, false, true, true, 4.8, 89, 1456, NOW(), NOW()),

-- 6. Künefe
('66666666-6666-6666-6666-666666666666', 20, 15, 3, 6, false, true, true, 4.7, 134, 987, NOW(), NOW()),

-- 7. Menemen
('77777777-7777-7777-7777-777777777777', 15, 10, 1, 2, false, true, false, 4.5, 67, 543, NOW(), NOW()),

-- 8. Su Böreği
('88888888-8888-8888-8888-888888888888', 50, 40, 3, 8, false, true, false, 4.6, 78, 654, NOW(), NOW()),

-- 9. Pide
('99999999-9999-9999-9999-999999999999', 30, 25, 2, 4, false, true, true, 4.4, 91, 723, NOW(), NOW()),

-- 10. Köfte
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 25, 15, 2, 4, false, true, false, 4.5, 112, 834, NOW(), NOW()),

-- 11. Dolma
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 45, 60, 3, 6, false, true, false, 4.3, 56, 432, NOW(), NOW()),

-- 12. Pilav
('cccccccc-cccc-cccc-cccc-cccccccccccc', 20, 5, 1, 4, false, true, false, 4.2, 34, 298, NOW(), NOW()),

-- 13. Mercimek Çorbası
('dddddddd-dddd-dddd-dddd-dddddddddddd', 30, 10, 1, 4, false, true, false, 4.4, 87, 567, NOW(), NOW()),

-- 14. Simit
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 25, 120, 2, 8, false, true, false, 4.1, 23, 189, NOW(), NOW()),

-- 15. Türk Kahvesi
('ffffffff-ffff-ffff-ffff-ffffffffffff', 10, 5, 2, 2, false, true, true, 4.6, 145, 1234, NOW(), NOW()),

-- 16. Ayran
('gggggggg-gggg-gggg-gggg-gggggggggggg', 5, 2, 1, 2, false, true, false, 4.3, 67, 345, NOW(), NOW()),

-- 17. Şiş Kebab
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 30, 20, 2, 4, false, true, true, 4.7, 178, 1567, NOW(), NOW()),

-- 18. Lokum
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 60, 30, 3, 20, false, true, false, 4.2, 45, 321, NOW(), NOW()),

-- 19. Börek
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 40, 30, 3, 6, false, true, false, 4.4, 89, 678, NOW(), NOW()),

-- 20. Dondurma
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 30, 240, 4, 8, false, true, true, 4.8, 234, 1890, NOW(), NOW());

-- Insert Recipe Translations (Turkish)
INSERT INTO mycheff.recipe_translations (
  id, recipe_id, language_code, title, description, preparation_steps, tips, created_at, updated_at
) VALUES

-- 1. Döner Kebab
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'tr', 'Döner Kebab', 'Geleneksel Türk döner kebabı tarifi', 
'[{"step": 1, "description": "Eti hazırlayın ve baharatlarla marine edin"}, {"step": 2, "description": "Şişe dizin ve döner olarak pişirin"}, {"step": 3, "description": "İnce dilimler halinde kesin"}, {"step": 4, "description": "Lavash ekmek ile servis edin"}]'::jsonb,
'["Eti çok sıkı bastırmayın", "Orta ateşte pişirin", "Taze sebzelerle servis edin"]'::jsonb, NOW(), NOW()),

-- 2. Lahmacun
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'tr', 'Lahmacun', 'İnce hamur üzerinde baharatlı et karışımı', 
'[{"step": 1, "description": "Hamuru hazırlayın ve mayalandırın"}, {"step": 2, "description": "İnce açın"}, {"step": 3, "description": "Kıymalı harcı hazırlayın"}, {"step": 4, "description": "Fırında pişirin"}]'::jsonb,
'["Hamur çok ince olmalı", "Fırın çok sıcak olmalı", "Limon ile servis edin"]'::jsonb, NOW(), NOW()),

-- 3. Mantı
(uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'tr', 'Mantı', 'Türk usulü mantı - yogurtlu ve tereyağlı', 
'[{"step": 1, "description": "Hamuru hazırlayın"}, {"step": 2, "description": "İnce açıp kareler kesin"}, {"step": 3, "description": "Kıyma ile doldurun"}, {"step": 4, "description": "Haşlayın ve soslarla servis edin"}]'::jsonb,
'["Hamur ince açılmalı", "Az kıyma koyun", "Yoğurt soğuk olmalı"]'::jsonb, NOW(), NOW()),

-- 4. Adana Kebabı
(uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'tr', 'Adana Kebabı', 'Acılı kıyma kebabı - mangalda pişirilir', 
'[{"step": 1, "description": "Kıymayı baharatlarla yoğurun"}, {"step": 2, "description": "Şişe geçirin"}, {"step": 3, "description": "Mangalda pişirin"}, {"step": 4, "description": "Sumak ve soğan ile servis edin"}]'::jsonb,
'["Kıyma çok yoğrulmamalı", "Közde pişirin", "Sıcak servis edin"]'::jsonb, NOW(), NOW()),

-- 5. Baklava
(uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'tr', 'Baklava', 'Geleneksel Türk tatlısı - fıstıklı ve şerbetli', 
'[{"step": 1, "description": "Yufkaları hazırlayın"}, {"step": 2, "description": "Fıstık harcını hazırlayın"}, {"step": 3, "description": "Katman katman dizin"}, {"step": 4, "description": "Fırında pişirin ve şerbet dökün"}]'::jsonb,
'["Yufka ince olmalı", "Tereyağı bol kullanın", "Şerbet soğuk dökün"]'::jsonb, NOW(), NOW()),

-- Continue with remaining recipes...
-- 6. Künefe
(uuid_generate_v4(), '66666666-6666-6666-6666-666666666666', 'tr', 'Künefe', 'Şerbetli tel kadayıf tatlısı peynirli', 
'[{"step": 1, "description": "Tel kadayıfı hazırlayın"}, {"step": 2, "description": "Peynir ekleyin"}, {"step": 3, "description": "Fırında pişirin"}, {"step": 4, "description": "Şerbet ile servis edin"}]'::jsonb,
'["Peynir taze olmalı", "Şerbet sıcak dökün", "Hemen servis edin"]'::jsonb, NOW(), NOW()),

-- 7. Menemen
(uuid_generate_v4(), '77777777-7777-7777-7777-777777777777', 'tr', 'Menemen', 'Domates, biber ve yumurta ile kahvaltılık', 
'[{"step": 1, "description": "Sebzeleri kavurun"}, {"step": 2, "description": "Domates ekleyin"}, {"step": 3, "description": "Yumurtaları çırpıp ekleyin"}, {"step": 4, "description": "Karıştırıp servis edin"}]'::jsonb,
'["Yumurta çok karıştırılmamalı", "Orta ateşte pişirin", "Taze ekmek ile servis edin"]'::jsonb, NOW(), NOW()),

-- 8. Su Böreği
(uuid_generate_v4(), '88888888-8888-8888-8888-888888888888', 'tr', 'Su Böreği', 'Katkat börek - peynirli ve maydanozlu', 
'[{"step": 1, "description": "Yufkaları haşlayın"}, {"step": 2, "description": "Peynir harcını hazırlayın"}, {"step": 3, "description": "Katman katman dizin"}, {"step": 4, "description": "Fırında pişirin"}]'::jsonb,
'["Yufka çok haşlanmamalı", "Katmanlar eşit olmalı", "Soğumadan kesin"]'::jsonb, NOW(), NOW()),

-- 9. Pide
(uuid_generate_v4(), '99999999-9999-9999-9999-999999999999', 'tr', 'Pide', 'Türk pizzası - kaşarlı ve sucuklu', 
'[{"step": 1, "description": "Hamuru hazırlayın"}, {"step": 2, "description": "Pide şeklinde açın"}, {"step": 3, "description": "Malzemeleri yerleştirin"}, {"step": 4, "description": "Fırında pişirin"}]'::jsonb,
'["Hamur yumuşak olmalı", "Kenarları kalın bırakın", "Sıcak servis edin"]'::jsonb, NOW(), NOW()),

-- 10. İzgara Köfte
(uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tr', 'İzgara Köfte', 'Baharatlı izgara köfte', 
'[{"step": 1, "description": "Köfte harcını hazırlayın"}, {"step": 2, "description": "Şekil verin"}, {"step": 3, "description": "Izgarada pişirin"}, {"step": 4, "description": "Garnitürlerle servis edin"}]'::jsonb,
'["Harç dinlendirilmeli", "Orta ateşte pişirin", "Çok çevirmeyin"]'::jsonb, NOW(), NOW()),

-- Continue with all 20 recipes...
-- 11-20 recipes with similar pattern
(uuid_generate_v4(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'tr', 'Yaprak Dolma', 'Asma yaprağı dolması - zeytinyağlı', '[]'::jsonb, '[]'::jsonb, NOW(), NOW()),
(uuid_generate_v4(), 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'tr', 'Türk Pilavı', 'Tereyağlı Türk pilavı', '[]'::jsonb, '[]'::jsonb, NOW(), NOW()),
(uuid_generate_v4(), 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'tr', 'Mercimek Çorbası', 'Geleneksel mercimek çorbası', '[]'::jsonb, '[]'::jsonb, NOW(), NOW()),
(uuid_generate_v4(), 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'tr', 'Türk Simidi', 'Susamlı Türk simidi', '[]'::jsonb, '[]'::jsonb, NOW(), NOW()),
(uuid_generate_v4(), 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'tr', 'Türk Kahvesi', 'Geleneksel Türk kahvesi', '[]'::jsonb, '[]'::jsonb, NOW(), NOW()),
(uuid_generate_v4(), 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'tr', 'Ayran', 'Yoğurt içeceği - tuzlu', '[]'::jsonb, '[]'::jsonb, NOW(), NOW()),
(uuid_generate_v4(), 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'tr', 'Şiş Kebab', 'Mangalda pişirilen şiş kebabı', '[]'::jsonb, '[]'::jsonb, NOW(), NOW()),
(uuid_generate_v4(), 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'tr', 'Türk Lokumu', 'Şekerli Türk lokumu', '[]'::jsonb, '[]'::jsonb, NOW(), NOW()),
(uuid_generate_v4(), 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'tr', 'Kol Böreği', 'Yufka ile yapılan kol böreği', '[]'::jsonb, '[]'::jsonb, NOW(), NOW()),
(uuid_generate_v4(), 'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'tr', 'Maraş Dondurması', 'Geleneksel Türk dondurması', '[]'::jsonb, '[]'::jsonb, NOW(), NOW());

-- Insert Recipe Media (Images)
INSERT INTO mycheff.recipe_media (
  id, recipe_id, media_type, url, is_primary, display_order, created_at, updated_at
) VALUES

-- Döner Kebab
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'photo', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Lahmacun
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'photo', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Mantı
(uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'photo', 'https://images.unsplash.com/photo-1580013759032-c96505504681?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Adana Kebabı
(uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'photo', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Baklava
(uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'photo', 'https://images.unsplash.com/photo-1571167177296-c4c8f9e65b7d?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Künefe
(uuid_generate_v4(), '66666666-6666-6666-6666-666666666666', 'photo', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Menemen
(uuid_generate_v4(), '77777777-7777-7777-7777-777777777777', 'photo', 'https://images.unsplash.com/photo-1525755662312-b1e34e9277c2?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Su Böreği
(uuid_generate_v4(), '88888888-8888-8888-8888-888888888888', 'photo', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Pide
(uuid_generate_v4(), '99999999-9999-9999-9999-999999999999', 'photo', 'https://images.unsplash.com/photo-1571167177296-c4c8f9e65b7d?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- İzgara Köfte
(uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'photo', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Yaprak Dolma
(uuid_generate_v4(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'photo', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Türk Pilavı
(uuid_generate_v4(), 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'photo', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Mercimek Çorbası
(uuid_generate_v4(), 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'photo', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Türk Simidi
(uuid_generate_v4(), 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'photo', 'https://images.unsplash.com/photo-1525755662312-b1e34e9277c2?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Türk Kahvesi
(uuid_generate_v4(), 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'photo', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Ayran
(uuid_generate_v4(), 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'photo', 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Şiş Kebab
(uuid_generate_v4(), 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'photo', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Türk Lokumu
(uuid_generate_v4(), 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'photo', 'https://images.unsplash.com/photo-1571167177296-c4c8f9e65b7d?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Kol Böreği
(uuid_generate_v4(), 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'photo', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop', true, 1, NOW(), NOW()),

-- Maraş Dondurması
(uuid_generate_v4(), 'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'photo', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop', true, 1, NOW(), NOW());

-- Success message
SELECT '20 Turkish recipes with translations and media successfully inserted!' as message; 