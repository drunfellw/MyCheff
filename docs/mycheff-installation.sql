-- =====================================================
-- MyCheff Database Complete Installation Script
-- Version: 1.0 Final
-- Date: 2025
-- =====================================================
-- Bu script MyCheff veritabanını sıfırdan kurar
-- Tüm tablolar, fonksiyonlar, trigger'lar, view'lar ve indeksler dahildir
-- =====================================================

-- 1. HAZIRLIK VE SCHEMA OLUŞTURMA
-- =====================================================
-- Mevcut schema'yı temizle (DİKKAT: Tüm veriler silinir!)
DROP SCHEMA IF EXISTS mycheff CASCADE;

-- Schema oluştur
CREATE SCHEMA mycheff;
SET search_path TO mycheff;

-- Extension'ları kur (database seviyesinde)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. TEMEL TABLOLAR
-- =====================================================

-- 2.1 Dil tablosu - Sistem tarafından desteklenen diller
CREATE TABLE mycheff.languages (
    code VARCHAR(5) PRIMARY KEY,                           -- ISO dil kodu (tr, en, es, fr)
    name VARCHAR(50) NOT NULL,                            -- Dilin adı
    is_active BOOLEAN DEFAULT TRUE,                       -- Dil aktif mi?
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.2 Kullanıcılar tablosu - Sistem kullanıcıları
CREATE TABLE mycheff.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,                 -- Kullanıcı adı
    email VARCHAR(100) NOT NULL UNIQUE,                  -- E-posta adresi
    password_hash VARCHAR(255) NOT NULL,                  -- Şifrelenmiş parola
    preferred_language VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code) DEFAULT 'tr',
    profile_image VARCHAR(255),                           -- Profil fotoğrafı URL'i
    bio TEXT,                                            -- Kullanıcı biyografisi
    cooking_skill_level SMALLINT CHECK (cooking_skill_level BETWEEN 1 AND 5),
    dietary_restrictions JSONB,                          -- Diyet kısıtlamaları (vegan, glutensiz vb.)
    allergies TEXT[],                                    -- Alerjiler dizisi
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    fcm_token VARCHAR(255),                              -- Firebase Cloud Messaging token
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ABONELİK SİSTEMİ TABLOLARI
-- =====================================================

-- 3.1 Abonelik Planları
CREATE TABLE mycheff.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,                           -- Plan adı (internal)
    duration_months INTEGER NOT NULL,                    -- Plan süresi (1, 6, 12 ay)
    price DECIMAL(10, 2) NOT NULL,                      -- Plan ücreti
    description TEXT,
    features JSONB,                                      -- Plan özellikleri {"premium_recipes": true, "ad_free": true}
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,                        -- Görüntüleme sırası
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3.2 Abonelik planı çevirileri
CREATE TABLE mycheff.subscription_plan_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES mycheff.subscription_plans(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    name VARCHAR(50) NOT NULL,                           -- Plan adı (kullanıcıya gösterilen)
    description TEXT,                                    -- Plan açıklaması (kullanıcıya gösterilen)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (plan_id, language_code)
);

-- 3.3 Kullanıcı Abonelikleri
CREATE TABLE mycheff.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES mycheff.subscription_plans(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,         -- Abonelik bitiş tarihi
    payment_reference VARCHAR(100),                      -- Ödeme sistemi referans numarası
    payment_status VARCHAR(20) DEFAULT 'completed',      -- completed, failed, refunded, pending
    payment_method VARCHAR(50),                          -- credit_card, debit_card, apple_pay, google_pay
    is_auto_renew BOOLEAN DEFAULT FALSE,                -- Otomatik yenileme aktif mi?
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. KATEGORİ VE MALZEME TABLOLARI
-- =====================================================

-- 4.1 Kategoriler tablosu
CREATE TABLE mycheff.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon VARCHAR(50),                                    -- Kategori ikonu (opsiyonel)
    color VARCHAR(7),                                    -- Kategori rengi HEX formatında (#FF0000)
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.2 Kategori çevirileri
CREATE TABLE mycheff.category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES mycheff.categories(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    name VARCHAR(50) NOT NULL,                           -- Kategori adı (Kahvaltı, Breakfast vb.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (category_id, language_code)
);

-- 4.3 Ölçü birimleri tablosu
CREATE TABLE mycheff.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) NOT NULL UNIQUE,                   -- g, kg, ml, l, tsp, tbsp, cup, piece
    system VARCHAR(10) NOT NULL CHECK (system IN ('metric', 'imperial', 'other')),
    base_unit_code VARCHAR(10),                         -- Temel birim (kg için g gibi)
    conversion_factor DECIMAL(10, 6),                   -- Dönüşüm faktörü
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.4 Ölçü birimi çevirileri
CREATE TABLE mycheff.unit_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES mycheff.units(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    name VARCHAR(50) NOT NULL,                          -- gram, kilogram vb.
    short_name VARCHAR(10) NOT NULL,                   -- g, kg vb.
    plural_name VARCHAR(50),                            -- grams, kilograms vb.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (unit_id, language_code)
);

-- 4.5 Malzeme kategorileri (hiyerarşik)
CREATE TABLE mycheff.ingredient_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES mycheff.ingredient_categories(id),  -- Üst kategori
    icon VARCHAR(50),
    color VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.6 Malzeme kategori çevirileri
CREATE TABLE mycheff.ingredient_category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES mycheff.ingredient_categories(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    name VARCHAR(50) NOT NULL,                          -- Sebzeler, Vegetables vb.
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (category_id, language_code)
);

-- 4.7 Malzemeler tablosu
CREATE TABLE mycheff.ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    default_unit VARCHAR(20) NOT NULL,                  -- Varsayılan ölçü birimi
    slug VARCHAR(50) UNIQUE,                            -- URL-friendly isim
    image VARCHAR(255),                                 -- Malzeme görseli URL'i
    nutritional_info JSONB,                             -- Besin değerleri {"calories": 52, "protein": 0.3, ...}
    is_active BOOLEAN DEFAULT TRUE,
    category_id UUID REFERENCES mycheff.ingredient_categories(id),
    unit_id UUID REFERENCES mycheff.units(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4.8 Malzeme çevirileri
CREATE TABLE mycheff.ingredient_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    name VARCHAR(100) NOT NULL,                         -- Domates, Tomato vb.
    aliases TEXT[],                                     -- Alternatif isimler ["kırmızı domates", "cherry domates"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ingredient_id, language_code)
);

-- 5. TARİF TABLOLARI
-- =====================================================

-- 5.1 Tarifler ana tablosu
CREATE TABLE mycheff.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_premium BOOLEAN DEFAULT FALSE,                   -- Premium tarif mi?
    is_featured BOOLEAN DEFAULT FALSE,                  -- Öne çıkan tarif mi?
    cooking_time_minutes INTEGER NOT NULL,              -- Pişirme süresi (dakika)
    prep_time_minutes INTEGER,                          -- Hazırlık süresi (dakika)
    author_id UUID REFERENCES mycheff.users(id),       -- Tarifi ekleyen kullanıcı
    difficulty_level SMALLINT CHECK (difficulty_level BETWEEN 1 AND 5),
    serving_size SMALLINT DEFAULT 4,                   -- Kaç kişilik
    is_published BOOLEAN DEFAULT TRUE,                 -- Yayında mı?
    view_count INTEGER DEFAULT 0,                      -- Görüntülenme sayısı
    average_rating DECIMAL(2, 1) DEFAULT 0,            -- Ortalama puan (0.0 - 5.0)
    rating_count INTEGER DEFAULT 0,                    -- Değerlendirme sayısı
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5.2 Tarif çevirileri
CREATE TABLE mycheff.recipe_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
    title VARCHAR(100) NOT NULL,                        -- Tarif başlığı
    description TEXT,                                   -- Tarif açıklaması
    preparation_steps JSONB NOT NULL,                  -- Hazırlama adımları [{"step": 1, "description": "..."}, ...]
    tips TEXT[],                                        -- İpuçları dizisi
    search_vector TSVECTOR,                            -- Tam metin arama vektörü
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (recipe_id, language_code)
);

-- 5.3 Tarif detayları
CREATE TABLE mycheff.recipe_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    nutritional_data JSONB,                            -- {"calories": 250, "protein": 15, "carbs": 30, "fat": 10}
    attributes JSONB,                                  -- {"is_vegan": true, "is_gluten_free": false, ...}
    serving_size VARCHAR(30),                          -- "1 porsiyon", "100g" vb.
    estimated_cost DECIMAL(10, 2),                     -- Tahmini maliyet
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (recipe_id)
);

-- 5.4 Tarif kategorileri (many-to-many)
CREATE TABLE mycheff.recipe_categories (
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES mycheff.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, category_id)
);

-- 5.5 Tarif malzemeleri
CREATE TABLE mycheff.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2),                           -- Miktar
    unit VARCHAR(30),                                  -- Birim
    is_required BOOLEAN NOT NULL DEFAULT TRUE,        -- Zorunlu mu yoksa opsiyonel mi?
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (recipe_id, ingredient_id)
);

-- 5.6 Tarif medya (fotoğraf ve videolar)
CREATE TABLE mycheff.recipe_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
    url VARCHAR(255) NOT NULL,                         -- Medya dosyası URL'i
    is_primary BOOLEAN DEFAULT FALSE,                  -- Ana görsel mi?
    display_order INTEGER DEFAULT 0,                   -- Görüntüleme sırası
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. KULLANICI ETKİLEŞİM TABLOLARI
-- =====================================================

-- 6.1 Kullanıcı malzemeleri (evdeki malzemeler)
CREATE TABLE mycheff.user_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2),
    unit VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, ingredient_id)
);

-- 6.2 Favori tarifler
CREATE TABLE mycheff.favorite_recipes (
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id)
);

-- 6.3 Tarif değerlendirmeleri
CREATE TABLE mycheff.recipe_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,                                  -- Kullanıcı yorumu
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, recipe_id)
);

-- 6.4 Tarif koleksiyonları
CREATE TABLE mycheff.recipe_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,                        -- Koleksiyon adı
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,                  -- Herkese açık mı?
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6.5 Koleksiyon tarifleri
CREATE TABLE mycheff.collection_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL REFERENCES mycheff.recipe_collections(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (collection_id, recipe_id)
);

-- 7. EK ÖZELLİK TABLOLARI
-- =====================================================

-- 7.1 Kalori takibi
CREATE TABLE mycheff.calorie_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES mycheff.recipes(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    calories INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7.2 Kullanıcı aktiviteleri (log)
CREATE TABLE mycheff.user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,                -- view_recipe, search, cook_recipe vb.
    recipe_id UUID REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
    metadata JSONB,                                    -- Ek bilgiler
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7.3 Push bildirimleri
CREATE TABLE mycheff.push_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES mycheff.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    data JSONB,                                        -- Ek bildirim verileri
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7.4 Uygulama ayarları
CREATE TABLE mycheff.app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(50) NOT NULL UNIQUE,                  -- Ayar anahtarı
    value JSONB NOT NULL,                              -- Ayar değeri (JSON)
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,                  -- Kullanıcılara görünür mü?
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. FONKSIYONLAR
-- =====================================================

-- 8.1 Updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION mycheff.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8.2 Arama vektörü güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION mycheff.update_recipe_translation_search_vector()
RETURNS TRIGGER AS $$
DECLARE
    lang_config TEXT;
BEGIN
    -- Dil konfigürasyonunu belirle
    CASE NEW.language_code
        WHEN 'tr' THEN lang_config := 'turkish';
        WHEN 'en' THEN lang_config := 'english';
        WHEN 'es' THEN lang_config := 'spanish';
        WHEN 'fr' THEN lang_config := 'french';
        ELSE lang_config := 'simple';
    END CASE;
    
    -- Tarif çeviri arama vektörü oluştur
    NEW.search_vector = setweight(to_tsvector(lang_config::regconfig, COALESCE(NEW.title, '')), 'A') ||
                      setweight(to_tsvector(lang_config::regconfig, COALESCE(NEW.description, '')), 'B');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8.3 Malzeme bazlı tarif eşleştirme fonksiyonu
CREATE OR REPLACE FUNCTION mycheff.match_recipes_by_ingredients(
    p_user_id UUID,
    p_language_code VARCHAR DEFAULT 'tr',
    p_min_match_percent INTEGER DEFAULT 50,
    p_max_missing_ingredients INTEGER DEFAULT 5,
    p_include_premium BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    recipe_id UUID,
    title VARCHAR,
    match_percent INTEGER,
    missing_ingredients_count INTEGER,
    missing_ingredients TEXT[],
    cooking_time_minutes INTEGER,
    difficulty_level SMALLINT,
    is_premium BOOLEAN,
    primary_image_url VARCHAR
) AS $$
DECLARE
    v_has_premium BOOLEAN;
BEGIN
    -- Kullanıcının premium durumunu kontrol et
    SELECT EXISTS (
        SELECT 1 FROM mycheff.user_subscriptions
        WHERE user_id = p_user_id
        AND end_date > CURRENT_TIMESTAMP
        AND payment_status = 'completed'
    ) INTO v_has_premium;

    -- Kullanıcının malzemelerini geçici tabloya al
    CREATE TEMPORARY TABLE temp_user_ingredients AS
    SELECT ingredient_id FROM mycheff.user_ingredients WHERE user_id = p_user_id;
    
    -- Geçici tablo için indeks
    CREATE INDEX idx_temp_user_ingredients ON temp_user_ingredients(ingredient_id);

    RETURN QUERY
    WITH recipe_ingredient_counts AS (
        SELECT 
            r.id,
            COUNT(DISTINCT ri.ingredient_id) AS total_ingredients_needed,
            COUNT(DISTINCT ri.ingredient_id) FILTER (WHERE ri.is_required = true) AS required_ingredients_count
        FROM 
            mycheff.recipes r
        JOIN mycheff.recipe_ingredients ri ON r.id = ri.recipe_id
        GROUP BY r.id
    ),
    recipe_matches AS (
        SELECT 
            r.id AS recipe_id,
            rt.title,
            r.cooking_time_minutes,
            r.difficulty_level,
            r.is_premium,
            ric.total_ingredients_needed,
            ric.required_ingredients_count,
            COUNT(DISTINCT tui.ingredient_id) AS matching_ingredients,
            ric.total_ingredients_needed - COUNT(DISTINCT tui.ingredient_id) AS missing_ingredients_count,
            CASE
                WHEN ric.total_ingredients_needed = 0 THEN 0
                ELSE CAST(
                    (COUNT(DISTINCT tui.ingredient_id) * 100.0 / ric.total_ingredients_needed) +
                    (COUNT(DISTINCT tui.ingredient_id) FILTER (WHERE ri.is_required = true) * 20.0 / 
                        NULLIF(ric.required_ingredients_count, 0))
                    AS INTEGER)
            END AS match_percent
        FROM 
            mycheff.recipes r
        JOIN mycheff.recipe_translations rt ON r.id = rt.recipe_id AND rt.language_code = p_language_code
        JOIN mycheff.recipe_ingredients ri ON r.id = ri.recipe_id
        JOIN recipe_ingredient_counts ric ON r.id = ric.id
        LEFT JOIN temp_user_ingredients tui ON ri.ingredient_id = tui.ingredient_id
        WHERE 
            (NOT r.is_premium OR r.is_premium = v_has_premium OR p_include_premium = TRUE)
        GROUP BY 
            r.id, rt.title, r.cooking_time_minutes, r.difficulty_level, r.is_premium,
            ric.total_ingredients_needed, ric.required_ingredients_count
    ),
    missing_ingredients_list AS (
        SELECT 
            r.id AS recipe_id,
            ARRAY_AGG(it.name) AS missing
        FROM 
            mycheff.recipes r
        JOIN mycheff.recipe_ingredients ri ON r.id = ri.recipe_id
        JOIN mycheff.ingredient_translations it ON ri.ingredient_id = it.ingredient_id AND it.language_code = p_language_code
        WHERE 
            ri.ingredient_id NOT IN (SELECT ingredient_id FROM temp_user_ingredients)
        GROUP BY 
            r.id
    ),
    primary_images AS (
        SELECT 
            rm.recipe_id,
            MIN(rm.url) AS primary_image_url
        FROM 
            mycheff.recipe_media rm
        WHERE 
            rm.is_primary = true
            OR rm.recipe_id IN (
                SELECT recipe_id 
                FROM recipe_matches 
                WHERE match_percent >= p_min_match_percent 
                AND missing_ingredients_count <= p_max_missing_ingredients
            )
        GROUP BY 
            rm.recipe_id
    )
    SELECT 
        rm.recipe_id,
        rm.title,
        rm.match_percent,
        rm.missing_ingredients_count,
        COALESCE(mil.missing, ARRAY[]::TEXT[]) AS missing_ingredients,
        rm.cooking_time_minutes,
        rm.difficulty_level,
        rm.is_premium,
        COALESCE(pi.primary_image_url, '') AS primary_image_url
    FROM 
        recipe_matches rm
    LEFT JOIN missing_ingredients_list mil ON rm.recipe_id = mil.recipe_id
    LEFT JOIN primary_images pi ON rm.recipe_id = pi.recipe_id
    WHERE 
        rm.match_percent >= p_min_match_percent
        AND rm.missing_ingredients_count <= p_max_missing_ingredients
    ORDER BY 
        rm.match_percent DESC, rm.missing_ingredients_count ASC, rm.title;
        
    -- Geçici tabloyu temizle
    DROP TABLE temp_user_ingredients;
END;
$$ LANGUAGE plpgsql;

-- 8.4 Tarif arama fonksiyonu
CREATE OR REPLACE FUNCTION mycheff.search_recipes(
    p_query TEXT,
    p_user_id UUID,
    p_language_code VARCHAR DEFAULT 'tr',
    p_attributes JSONB DEFAULT NULL,
    p_max_cooking_time INTEGER DEFAULT NULL,
    p_categories UUID[] DEFAULT NULL,
    p_difficulty_level_max SMALLINT DEFAULT NULL,
    p_include_premium BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    recipe_id UUID,
    title VARCHAR,
    description TEXT,
    cooking_time_minutes INTEGER,
    difficulty_level SMALLINT,
    is_premium BOOLEAN,
    primary_image_url VARCHAR,
    category_names TEXT[],
    match_rank REAL
) AS $$
DECLARE
    v_has_premium BOOLEAN;
    lang_config TEXT;
BEGIN
    -- Dil konfigürasyonunu belirle
    CASE p_language_code
        WHEN 'tr' THEN lang_config := 'turkish';
        WHEN 'en' THEN lang_config := 'english';
        WHEN 'es' THEN lang_config := 'spanish';
        WHEN 'fr' THEN lang_config := 'french';
        ELSE lang_config := 'simple';
    END CASE;

    -- Kullanıcının premium durumunu kontrol et
    SELECT EXISTS (
        SELECT 1 FROM mycheff.user_subscriptions
        WHERE user_id = p_user_id
        AND end_date > CURRENT_TIMESTAMP
        AND payment_status = 'completed'
    ) INTO v_has_premium;

    RETURN QUERY
    SELECT 
        r.id AS recipe_id,
        rt.title,
        rt.description,
        r.cooking_time_minutes,
        r.difficulty_level,
        r.is_premium,
        (
            SELECT rm.url
            FROM mycheff.recipe_media rm
            WHERE rm.recipe_id = r.id AND rm.is_primary = true
            LIMIT 1
        ) AS primary_image_url,
        ARRAY(
            SELECT ct.name 
            FROM mycheff.recipe_categories rc
            JOIN mycheff.category_translations ct ON rc.category_id = ct.category_id
            WHERE rc.recipe_id = r.id AND ct.language_code = p_language_code
        ) AS category_names,
        ts_rank_cd(rt.search_vector, 
            CASE WHEN p_query IS NULL THEN to_tsquery(lang_config::regconfig, '')
                 ELSE to_tsquery(lang_config::regconfig, regexp_replace(p_query, '(\w+)', '\1:*', 'g'))
            END
        ) AS match_rank
    FROM 
        mycheff.recipes r
    JOIN mycheff.recipe_translations rt ON r.id = rt.recipe_id AND rt.language_code = p_language_code
    LEFT JOIN mycheff.recipe_details rd ON r.id = rd.recipe_id
    WHERE 
        (p_query IS NULL OR rt.search_vector @@ to_tsquery(lang_config::regconfig, regexp_replace(p_query, '(\w+)', '\1:*', 'g')))
        AND (p_max_cooking_time IS NULL OR r.cooking_time_minutes <= p_max_cooking_time)
        AND (p_difficulty_level_max IS NULL OR r.difficulty_level <= p_difficulty_level_max)
        AND (NOT r.is_premium OR r.is_premium = v_has_premium OR p_include_premium = TRUE)
        AND (p_attributes IS NULL OR rd.attributes @> p_attributes)
        AND (p_categories IS NULL OR EXISTS (
            SELECT 1 FROM mycheff.recipe_categories rc 
            WHERE rc.recipe_id = r.id AND rc.category_id = ANY(p_categories)
        ))
    ORDER BY 
        match_rank DESC, 
        r.is_featured DESC,
        r.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 9. TRIGGER'LAR
-- =====================================================

-- Updated_at trigger'ları - tüm tablolar için
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON mycheff.users FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_recipes_modtime BEFORE UPDATE ON mycheff.recipes FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON mycheff.categories FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_ingredients_modtime BEFORE UPDATE ON mycheff.ingredients FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_recipe_translations_modtime BEFORE UPDATE ON mycheff.recipe_translations FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_recipe_ingredients_modtime BEFORE UPDATE ON mycheff.recipe_ingredients FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_user_ingredients_modtime BEFORE UPDATE ON mycheff.user_ingredients FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_subscription_plans_modtime BEFORE UPDATE ON mycheff.subscription_plans FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_user_subscriptions_modtime BEFORE UPDATE ON mycheff.user_subscriptions FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_recipe_collections_modtime BEFORE UPDATE ON mycheff.recipe_collections FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_collection_recipes_modtime BEFORE UPDATE ON mycheff.collection_recipes FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_ingredient_categories_modtime BEFORE UPDATE ON mycheff.ingredient_categories FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_app_settings_modtime BEFORE UPDATE ON mycheff.app_settings FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_units_modtime BEFORE UPDATE ON mycheff.units FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_category_translations_modtime BEFORE UPDATE ON mycheff.category_translations FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_ingredient_translations_modtime BEFORE UPDATE ON mycheff.ingredient_translations FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_recipe_details_modtime BEFORE UPDATE ON mycheff.recipe_details FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_recipe_media_modtime BEFORE UPDATE ON mycheff.recipe_media FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_recipe_ratings_modtime BEFORE UPDATE ON mycheff.recipe_ratings FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
CREATE TRIGGER update_subscription_plan_translations_modtime BEFORE UPDATE ON mycheff.subscription_plan_translations FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();

-- Arama vektörü trigger'ı
CREATE TRIGGER update_recipe_translations_search_vector BEFORE INSERT OR UPDATE ON mycheff.recipe_translations FOR EACH ROW EXECUTE FUNCTION mycheff.update_recipe_translation_search_vector();

-- 10. VIEW'LAR
-- =====================================================

-- 10.1 Aktif premium kullanıcılar view'ı
CREATE VIEW mycheff.active_premium_users AS
SELECT DISTINCT 
    u.id, 
    u.username, 
    u.email,
    us.end_date as subscription_end_date,
    sp.name as plan_name
FROM mycheff.users u
JOIN mycheff.user_subscriptions us ON u.id = us.user_id
JOIN mycheff.subscription_plans sp ON us.plan_id = sp.id
WHERE us.end_date > CURRENT_TIMESTAMP
AND us.payment_status = 'completed';

-- 10.2 Popüler tarifler materialized view'ı
CREATE MATERIALIZED VIEW mycheff.popular_recipes AS
SELECT 
    r.id,
    rt.title,
    rt.language_code,
    r.is_premium,
    r.is_featured,
    COALESCE(r.average_rating, 0) as avg_rating,
    COALESCE(r.rating_count, 0) as rating_count,
    COUNT(DISTINCT fr.user_id) as favorite_count,
    r.view_count,
    (
        SELECT rm.url
        FROM mycheff.recipe_media rm
        WHERE rm.recipe_id = r.id AND rm.is_primary = true
        LIMIT 1
    ) AS primary_image_url
FROM 
    mycheff.recipes r
JOIN mycheff.recipe_translations rt ON r.id = rt.recipe_id
LEFT JOIN mycheff.favorite_recipes fr ON r.id = fr.recipe_id
WHERE r.is_published = true
GROUP BY 
    r.id, rt.title, rt.language_code, r.is_premium, r.is_featured, 
    r.average_rating, r.rating_count, r.view_count;

-- 11. İNDEKSLER
-- =====================================================

-- Users indeksleri
CREATE INDEX idx_users_username_gin ON mycheff.users USING gin (username gin_trgm_ops);
CREATE INDEX idx_users_email ON mycheff.users(email);
CREATE INDEX idx_users_preferred_language ON mycheff.users(preferred_language);
CREATE INDEX idx_users_active ON mycheff.users(is_active) WHERE is_active = true;

-- Recipe indeksleri
CREATE INDEX idx_recipes_cooking_time ON mycheff.recipes(cooking_time_minutes);
CREATE INDEX idx_recipes_premium ON mycheff.recipes(is_premium) WHERE is_premium = true;
CREATE INDEX idx_recipes_difficulty ON mycheff.recipes(difficulty_level);
CREATE INDEX idx_recipes_featured ON mycheff.recipes(is_featured) WHERE is_featured = true;
CREATE INDEX idx_recipes_published ON mycheff.recipes(is_published) WHERE is_published = true;
CREATE INDEX idx_recipes_author ON mycheff.recipes(author_id);

-- Recipe translations indeksleri
CREATE INDEX idx_recipe_translations_title_trgm ON mycheff.recipe_translations USING gin (title gin_trgm_ops);
CREATE INDEX idx_recipe_translations_search ON mycheff.recipe_translations USING GIN(search_vector);
CREATE INDEX idx_recipe_translations_recipe_lang ON mycheff.recipe_translations(recipe_id, language_code);

-- Category translations indeksleri
CREATE INDEX idx_category_translations_name_trgm ON mycheff.category_translations USING gin (name gin_trgm_ops);

-- Ingredient translations indeksleri
CREATE INDEX idx_ingredient_translations_name_trgm ON mycheff.ingredient_translations USING gin (name gin_trgm_ops);
CREATE INDEX idx_ingredient_translations_aliases ON mycheff.ingredient_translations USING gin (aliases);

-- Ingredients indeksleri
CREATE INDEX idx_ingredients_active ON mycheff.ingredients(is_active) WHERE is_active = true;
CREATE INDEX idx_ingredients_category ON mycheff.ingredients(category_id);

-- Recipe details indeksleri
CREATE INDEX idx_recipe_details_jsonb ON mycheff.recipe_details USING GIN(attributes jsonb_path_ops);
CREATE INDEX idx_recipe_details_vegan ON mycheff.recipe_details (((attributes->>'is_vegan')::boolean)) WHERE (attributes->>'is_vegan')::boolean = true;
CREATE INDEX idx_recipe_details_gluten_free ON mycheff.recipe_details (((attributes->>'is_gluten_free')::boolean)) WHERE (attributes->>'is_gluten_free')::boolean = true;

-- Recipe categories indeksleri
CREATE INDEX idx_recipe_categories_category ON mycheff.recipe_categories(category_id);
CREATE INDEX idx_recipe_categories_recipe ON mycheff.recipe_categories(recipe_id);

-- Recipe ingredients indeksleri
CREATE INDEX idx_recipe_ingredients_ingredient ON mycheff.recipe_ingredients(ingredient_id);
CREATE INDEX idx_recipe_ingredients_recipe ON mycheff.recipe_ingredients(recipe_id);

-- Recipe media indeksleri
CREATE INDEX idx_recipe_media_recipe_order ON mycheff.recipe_media(recipe_id, display_order);
CREATE INDEX idx_recipe_media_primary ON mycheff.recipe_media(recipe_id) WHERE is_primary = true;

-- User ingredients indeksleri
CREATE INDEX idx_user_ingredients_user_id ON mycheff.user_ingredients(user_id);
CREATE INDEX idx_user_ingredients_ingredient_id ON mycheff.user_ingredients(ingredient_id);

-- Favorite recipes indeksleri
CREATE INDEX idx_favorite_recipes_user_id ON mycheff.favorite_recipes(user_id);
CREATE INDEX idx_favorite_recipes_recipe_id ON mycheff.favorite_recipes(recipe_id);

-- Recipe ratings indeksleri
CREATE INDEX idx_recipe_ratings_recipe ON mycheff.recipe_ratings(recipe_id);
CREATE INDEX idx_recipe_ratings_user ON mycheff.recipe_ratings(user_id);

-- User subscriptions indeksleri
CREATE INDEX idx_user_subscriptions_user_id ON mycheff.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_end_date ON mycheff.user_subscriptions(end_date);
CREATE INDEX idx_active_subscriptions ON mycheff.user_subscriptions(user_id, end_date);

-- Calorie entries indeksleri
CREATE INDEX idx_calorie_entries_user_date ON mycheff.calorie_entries(user_id, date);
CREATE INDEX idx_calorie_entries_recipe ON mycheff.calorie_entries(recipe_id);

-- User activities indeksleri
CREATE INDEX idx_user_activities_user ON mycheff.user_activities(user_id);
CREATE INDEX idx_user_activities_type ON mycheff.user_activities(activity_type);
CREATE INDEX idx_user_activities_recipe ON mycheff.user_activities(recipe_id);
CREATE INDEX idx_user_activities_created ON mycheff.user_activities(created_at);

-- Push notifications indeksleri
CREATE INDEX idx_push_notifications_user ON mycheff.push_notifications(user_id);
CREATE INDEX idx_push_notifications_status ON mycheff.push_notifications(status);

-- Recipe collections indeksleri
CREATE INDEX idx_recipe_collections_user ON mycheff.recipe_collections(user_id);
CREATE INDEX idx_collection_recipes_collection ON mycheff.collection_recipes(collection_id);
CREATE INDEX idx_collection_recipes_recipe ON mycheff.collection_recipes(recipe_id);

-- Ingredient categories indeksleri
CREATE INDEX idx_ingredient_categories_parent ON mycheff.ingredient_categories(parent_id);

-- App settings indeksleri
CREATE INDEX idx_app_settings_key ON mycheff.app_settings(key);

-- Materialized view indeksi
CREATE UNIQUE INDEX idx_popular_recipes_id_lang ON mycheff.popular_recipes(id, language_code);

-- 12. İZİNLER (Uygulama kullanıcısı için)
-- =====================================================
-- NOT: Aşağıdaki satırları, uygulama için özel bir PostgreSQL kullanıcısı oluşturduysanız uncomment edin
-- ve 'your_app_user' yerine kendi kullanıcı adınızı yazın

-- GRANT USAGE ON SCHEMA mycheff TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA mycheff TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA mycheff TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA mycheff TO your_app_user;

-- 13. NOTLAR VE BAKIM
-- =====================================================
-- Materialized view'ı düzenli olarak yenileyin:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mycheff.popular_recipes;

-- Vacuum ve analyze işlemleri için:
-- VACUUM ANALYZE mycheff.recipes;
-- VACUUM ANALYZE mycheff.recipe_translations;
-- VACUUM ANALYZE mycheff.recipe_ingredients;

-- Installation tamamlandı!
-- =====================================================