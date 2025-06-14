-- =====================================================
-- Basit Temizleme - Manuel İnceleme İçin
-- =====================================================

-- 1. Önce hangi fonksiyonlar var görelim
SELECT 
    'DROP FUNCTION IF EXISTS mycheff.' || proname || '(' || pg_get_function_identity_arguments(oid) || ') CASCADE;' AS drop_statement,
    proname AS function_name
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'mycheff'
AND proname NOT IN (
    'update_modified_column',
    'update_recipe_translation_search_vector',
    'match_recipes_by_ingredients', 
    'search_recipes'
)
ORDER BY proname;

-- 2. Mevcut fonksiyon sayısı
SELECT 
    'Toplam fonksiyon sayısı: ' || COUNT(*) AS info
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'mycheff';

-- 3. Korunacak fonksiyonlar
SELECT 
    'Korunacak: ' || proname AS info
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'mycheff'
AND proname IN (
    'update_modified_column',
    'update_recipe_translation_search_vector',
    'match_recipes_by_ingredients', 
    'search_recipes'
)
ORDER BY proname; 