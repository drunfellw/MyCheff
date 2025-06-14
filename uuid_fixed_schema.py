import psycopg2

def create_uuid_complete_schema():
    """
    UUID tabanlı, tam performans optimizasyonlu MyCheff database schema
    
    FARKLILIKLARI:
    - UUID kullanımı (Integer yerine)
    - Gelişmiş trigram indeksleri
    - Full-text search optimizasyonları
    - Eksik fonksiyonların eklenmesi
    - Performans için özel indeksler
    """
    
    try:
        print("🔥 UUID TABANLI MYCHEFF SCHEMA OLUŞTURULUYOR!")
        print("🚀 Güvenlik + Performans + Ölçeklenebilirlik")
        print("="*70)
        
        conn = psycopg2.connect(
            host='localhost',
            database='postgres', 
            user='postgres',
            password='123',
            port='5432'
        )
        
        cursor = conn.cursor()
        
        # 0. KAPSAMLI TEMİZLİK
        print("🧹 Eski schema ve verileri temizleniyor...")
        cursor.execute("DROP SCHEMA IF EXISTS mycheff CASCADE;")
        cursor.execute("CREATE SCHEMA mycheff;")
        conn.commit()
        
        # 1. EXTENSIONS (Public schema'da)
        print("📦 PostgreSQL Extensions kuruluyor...")
        extensions = [
            'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
            'CREATE EXTENSION IF NOT EXISTS "pg_trgm";',
            'CREATE EXTENSION IF NOT EXISTS "unaccent";',
            'CREATE EXTENSION IF NOT EXISTS "btree_gin";'
        ]
        
        for ext in extensions:
            try:
                cursor.execute(ext)
                conn.commit()
            except Exception as e:
                print(f"⚠️  Extension uyarısı: {e}")
                conn.rollback()
        
        print("✅ Extensions kuruldu")
        
        # 2. CUSTOM FUNCTIONS
        print("⚙️  Custom functions oluşturuluyor...")
        
        # Update trigger function
        cursor.execute("""
            CREATE OR REPLACE FUNCTION mycheff.update_modified_column()
            RETURNS TRIGGER AS $func$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $func$ LANGUAGE plpgsql;
        """)
        
        # Recipe search function (EKSIK OLAN!)
        cursor.execute("""
            CREATE OR REPLACE FUNCTION mycheff.search_recipes(
                search_term TEXT,
                language_code VARCHAR(5) DEFAULT 'tr',
                difficulty_filter SMALLINT DEFAULT NULL,
                cooking_time_max INTEGER DEFAULT NULL,
                premium_only BOOLEAN DEFAULT FALSE
            )
            RETURNS TABLE(
                recipe_id UUID,
                title VARCHAR(100),
                description TEXT,
                cooking_time_minutes INTEGER,
                difficulty_level SMALLINT,
                average_rating DECIMAL(3,2),
                is_premium BOOLEAN,
                rank REAL
            ) AS $$
            BEGIN
                RETURN QUERY
                SELECT 
                    r.id,
                    rt.title,
                    rt.description,
                    r.cooking_time_minutes,
                    r.difficulty_level,
                    r.average_rating,
                    r.is_premium,
                    ts_rank(rt.search_vector, plainto_tsquery('turkish', search_term)) as rank
                FROM mycheff.recipes r
                JOIN mycheff.recipe_translations rt ON r.id = rt.recipe_id
                WHERE rt.language_code = search_recipes.language_code
                AND r.is_published = true
                AND (difficulty_filter IS NULL OR r.difficulty_level = difficulty_filter)
                AND (cooking_time_max IS NULL OR r.cooking_time_minutes <= cooking_time_max)
                AND (NOT premium_only OR r.is_premium = premium_only)
                AND (rt.search_vector @@ plainto_tsquery('turkish', search_term)
                     OR rt.title ILIKE '%' || search_term || '%'
                     OR rt.description ILIKE '%' || search_term || '%')
                ORDER BY rank DESC, r.average_rating DESC;
            END;
            $$ LANGUAGE plpgsql;
        """)
        
        # Ingredient matching function (EKSIK OLAN!)
        cursor.execute("""
            CREATE OR REPLACE FUNCTION mycheff.match_recipes_by_ingredients(
                user_ingredient_ids UUID[],
                language_code VARCHAR(5) DEFAULT 'tr',
                min_match_percentage DECIMAL DEFAULT 0.5
            )
            RETURNS TABLE(
                recipe_id UUID,
                title VARCHAR(100),
                match_percentage DECIMAL,
                matched_ingredients INTEGER,
                total_ingredients INTEGER,
                missing_ingredients TEXT[]
            ) AS $$
            BEGIN
                RETURN QUERY
                WITH recipe_ingredients AS (
                    SELECT 
                        ri.recipe_id,
                        array_agg(ri.ingredient_id) as ingredient_ids,
                        count(*) as total_count
                    FROM mycheff.recipe_ingredients ri
                    WHERE ri.is_required = true
                    GROUP BY ri.recipe_id
                ),
                recipe_matches AS (
                    SELECT 
                        ri.recipe_id,
                        ri.total_count,
                        (
                            SELECT count(*)
                            FROM unnest(ri.ingredient_ids) AS ing_id
                            WHERE ing_id = ANY(user_ingredient_ids)
                        ) as matched_count,
                        (
                            SELECT array_agg(DISTINCT it.name)
                            FROM unnest(ri.ingredient_ids) AS missing_id
                            JOIN mycheff.ingredient_translations it ON missing_id = it.ingredient_id
                            WHERE missing_id != ALL(user_ingredient_ids)
                            AND it.language_code = match_recipes_by_ingredients.language_code
                        ) as missing_ingredients_names
                    FROM recipe_ingredients ri
                )
                SELECT 
                    rm.recipe_id,
                    rt.title,
                    ROUND((rm.matched_count::DECIMAL / rm.total_count) * 100, 2) as match_percentage,
                    rm.matched_count,
                    rm.total_count,
                    COALESCE(rm.missing_ingredients_names, ARRAY[]::TEXT[]) as missing_ingredients
                FROM recipe_matches rm
                JOIN mycheff.recipe_translations rt ON rm.recipe_id = rt.recipe_id
                WHERE rt.language_code = match_recipes_by_ingredients.language_code
                AND (rm.matched_count::DECIMAL / rm.total_count) >= min_match_percentage
                ORDER BY match_percentage DESC, rm.matched_count DESC;
            END;
            $$ LANGUAGE plpgsql;
        """)
        
        conn.commit()
        print("✅ Custom functions oluşturuldu")
        
        # 3. CORE TABLES
        print("🌍 Core tables oluşturuluyor...")
        
        # Languages
        cursor.execute("""
            CREATE TABLE mycheff.languages (
                code VARCHAR(5) PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Users (UUID ile)
        cursor.execute("""
            CREATE TABLE mycheff.users (
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
        """)
        
        conn.commit()
        print("✅ Core tables oluşturuldu")
        
        # 4. SUBSCRIPTION SYSTEM (UUID ile)
        print("💳 Subscription system...")
        
        cursor.execute("""
            CREATE TABLE mycheff.subscription_plans (
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
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.subscription_plan_translations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                plan_id UUID NOT NULL REFERENCES mycheff.subscription_plans(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (plan_id, language_code)
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.user_subscriptions (
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
        """)
        
        conn.commit()
        print("✅ Subscription system oluşturuldu")
        
        # 5. UNITS SYSTEM (UUID ile)
        print("📏 Units system...")
        
        cursor.execute("""
            CREATE TABLE mycheff.units (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                code VARCHAR(10) NOT NULL UNIQUE,
                system VARCHAR(10) NOT NULL,
                base_unit_code VARCHAR(10),
                conversion_factor DECIMAL(10,6),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.unit_translations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                unit_id UUID NOT NULL REFERENCES mycheff.units(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(50) NOT NULL,
                short_name VARCHAR(10) NOT NULL,
                plural_name VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (unit_id, language_code)
            );
        """)
        
        conn.commit()
        print("✅ Units system oluşturuldu")
        
        # 6. CATEGORIES SYSTEM (UUID ile)
        print("📂 Categories system...")
        
        cursor.execute("""
            CREATE TABLE mycheff.categories (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                icon VARCHAR(50),
                color VARCHAR(7),
                sort_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.category_translations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                category_id UUID NOT NULL REFERENCES mycheff.categories(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (category_id, language_code)
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.ingredient_categories (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                parent_id UUID REFERENCES mycheff.ingredient_categories(id),
                icon VARCHAR(50),
                color VARCHAR(7),
                sort_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.ingredient_category_translations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                category_id UUID NOT NULL REFERENCES mycheff.ingredient_categories(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (category_id, language_code)
            );
        """)
        
        conn.commit()
        print("✅ Categories system oluşturuldu")
        
        # 7. INGREDIENTS SYSTEM (UUID ile)
        print("🥬 Ingredients system...")
        
        cursor.execute("""
            CREATE TABLE mycheff.ingredients (
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
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.ingredient_translations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                ingredient_id UUID NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(100) NOT NULL,
                aliases TEXT[],
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (ingredient_id, language_code)
            );
        """)
        
        conn.commit()
        print("✅ Ingredients system oluşturuldu")
        
        # 8. RECIPES SYSTEM (UUID ile)
        print("🍽️ Recipes system...")
        
        cursor.execute("""
            CREATE TABLE mycheff.recipes (
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
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.recipe_translations (
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
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.recipe_details (
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
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.recipe_categories (
                recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                category_id UUID NOT NULL REFERENCES mycheff.categories(id) ON DELETE CASCADE,
                PRIMARY KEY (recipe_id, category_id)
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.recipe_ingredients (
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
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.recipe_media (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
                url VARCHAR(255) NOT NULL,
                is_primary BOOLEAN DEFAULT FALSE,
                display_order INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        conn.commit()
        print("✅ Recipes system oluşturuldu")
        
        # 9. USER INTERACTION SYSTEM (UUID ile)
        print("👥 User interaction system...")
        
        cursor.execute("""
            CREATE TABLE mycheff.user_ingredients (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                ingredient_id UUID NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
                quantity DECIMAL(10, 2),
                unit VARCHAR(30),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, ingredient_id)
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.favorite_recipes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, recipe_id)
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.recipe_ratings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                review_text TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, recipe_id)
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.recipe_collections (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                is_public BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.collection_recipes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                collection_id UUID NOT NULL REFERENCES mycheff.recipe_collections(id) ON DELETE CASCADE,
                recipe_id UUID NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (collection_id, recipe_id)
            );
        """)
        
        conn.commit()
        print("✅ User interaction system oluşturuldu")
        
        # 10. ADDITIONAL FEATURES (UUID ile)
        print("🔔 Additional features...")
        
        cursor.execute("""
            CREATE TABLE mycheff.user_activities (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                activity_type VARCHAR(50) NOT NULL,
                recipe_id UUID REFERENCES mycheff.recipes(id),
                metadata JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.push_notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES mycheff.users(id) ON DELETE CASCADE,
                title VARCHAR(100) NOT NULL,
                body TEXT NOT NULL,
                data JSONB,
                status VARCHAR(20) DEFAULT 'pending',
                sent_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.calorie_entries (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                recipe_id UUID REFERENCES mycheff.recipes(id),
                date DATE NOT NULL,
                meal_type VARCHAR(20) NOT NULL,
                calories INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, recipe_id, date, meal_type)
            );
        """)
        
        cursor.execute("""
            CREATE TABLE mycheff.app_settings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                key VARCHAR(50) NOT NULL UNIQUE,
                value JSONB NOT NULL,
                description TEXT,
                is_public BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        conn.commit()
        print("✅ Additional features oluşturuldu")
        
        # 11. ADVANCED INDEXES
        print("\n🔍 GELIŞMIŞ İNDEKSLER oluşturuluyor...")
        
        # Trigram ve GIN indeksleri
        advanced_indexes = [
            # User search indexes
            "CREATE INDEX idx_users_username_gin ON mycheff.users USING gin (username gin_trgm_ops);",
            "CREATE INDEX idx_users_email ON mycheff.users(email);",
            "CREATE INDEX idx_users_active ON mycheff.users(is_active) WHERE is_active = true;",
            "CREATE INDEX idx_users_last_login ON mycheff.users(last_login_at DESC) WHERE is_active = true;",
            
            # Subscription indexes
            "CREATE INDEX idx_user_subscriptions_user_id ON mycheff.user_subscriptions(user_id);",
            "CREATE INDEX idx_user_subscriptions_end_date ON mycheff.user_subscriptions(end_date);",
            "CREATE INDEX idx_user_subscriptions_user_end_date ON mycheff.user_subscriptions(user_id, end_date);",
            
            # Category search indexes
            "CREATE INDEX idx_category_translations_name_trgm ON mycheff.category_translations USING gin (name gin_trgm_ops);",
            "CREATE INDEX idx_categories_sort_order ON mycheff.categories(sort_order, is_active);",
            
            # Ingredient category search indexes
            "CREATE INDEX idx_ingredient_category_translations_name_trgm ON mycheff.ingredient_category_translations USING gin (name gin_trgm_ops);",
            "CREATE INDEX idx_ingredient_categories_sort_order ON mycheff.ingredient_categories(sort_order, is_active);",
            
            # Ingredient search indexes (KRİTİK!)
            "CREATE INDEX idx_ingredient_translations_name_trgm ON mycheff.ingredient_translations USING gin (name gin_trgm_ops);",
            "CREATE INDEX idx_ingredient_translations_aliases ON mycheff.ingredient_translations USING gin (aliases);",
            "CREATE INDEX idx_ingredients_category ON mycheff.ingredients(category_id);",
            "CREATE INDEX idx_ingredients_unit ON mycheff.ingredients(unit_id);",
            "CREATE INDEX idx_ingredients_active ON mycheff.ingredients(is_active) WHERE is_active = true;",
            
            # Recipe search indexes (KRİTİK!)
            "CREATE INDEX idx_recipes_cooking_time ON mycheff.recipes(cooking_time_minutes);",
            "CREATE INDEX idx_recipes_premium ON mycheff.recipes(is_premium) WHERE is_premium = true;",
            "CREATE INDEX idx_recipes_difficulty ON mycheff.recipes(difficulty_level);",
            "CREATE INDEX idx_recipes_featured ON mycheff.recipes(is_featured) WHERE is_featured = true;",
            "CREATE INDEX idx_recipes_published ON mycheff.recipes(is_published) WHERE is_published = true;",
            "CREATE INDEX idx_recipes_rating ON mycheff.recipes(average_rating DESC, rating_count DESC);",
            "CREATE INDEX idx_recipes_author ON mycheff.recipes(author_id) WHERE is_published = true;",
            
            # Recipe translation search (KRİTİK!)
            "CREATE INDEX idx_recipe_translations_title_trgm ON mycheff.recipe_translations USING gin (title gin_trgm_ops);",
            "CREATE INDEX idx_recipe_translations_search ON mycheff.recipe_translations USING GIN(search_vector);",
            
            # Recipe details
            "CREATE INDEX idx_recipe_details_jsonb ON mycheff.recipe_details USING GIN(attributes jsonb_path_ops);",
            
            # Recipe relationships
            "CREATE INDEX idx_recipe_categories_category ON mycheff.recipe_categories(category_id);",
            "CREATE INDEX idx_recipe_ingredients_ingredient ON mycheff.recipe_ingredients(ingredient_id);",
            "CREATE INDEX idx_recipe_ingredients_recipe ON mycheff.recipe_ingredients(recipe_id);",
            "CREATE INDEX idx_recipe_ingredients_required ON mycheff.recipe_ingredients(recipe_id, is_required);",
            "CREATE INDEX idx_recipe_media_recipe_order ON mycheff.recipe_media(recipe_id, display_order);",
            
            # User data indexes
            "CREATE INDEX idx_user_ingredients_user_id ON mycheff.user_ingredients(user_id);",
            "CREATE INDEX idx_user_ingredients_ingredient_id ON mycheff.user_ingredients(ingredient_id);",
            "CREATE INDEX idx_favorite_recipes_user_id ON mycheff.favorite_recipes(user_id);",
            "CREATE INDEX idx_favorite_recipes_recipe_id ON mycheff.favorite_recipes(recipe_id);",
            "CREATE INDEX idx_recipe_ratings_recipe ON mycheff.recipe_ratings(recipe_id);",
            "CREATE INDEX idx_recipe_ratings_user ON mycheff.recipe_ratings(user_id);",
            "CREATE INDEX idx_recipe_ratings_rating ON mycheff.recipe_ratings(rating, created_at);",
            
            # Activity tracking
            "CREATE INDEX idx_user_activities_user_type ON mycheff.user_activities(user_id, activity_type);",
            "CREATE INDEX idx_user_activities_recipe ON mycheff.user_activities(recipe_id) WHERE recipe_id IS NOT NULL;",
            "CREATE INDEX idx_user_activities_created_at ON mycheff.user_activities(created_at);",
            
            # Collections
            "CREATE INDEX idx_recipe_collections_user ON mycheff.recipe_collections(user_id);",
            "CREATE INDEX idx_recipe_collections_public ON mycheff.recipe_collections(is_public) WHERE is_public = true;",
            "CREATE INDEX idx_collection_recipes_collection ON mycheff.collection_recipes(collection_id);",
            
            # Notifications
            "CREATE INDEX idx_push_notifications_user ON mycheff.push_notifications(user_id);",
            "CREATE INDEX idx_push_notifications_status ON mycheff.push_notifications(status);",
            "CREATE INDEX idx_push_notifications_sent ON mycheff.push_notifications(sent_at) WHERE sent_at IS NOT NULL;",
            
            # Calorie tracking
            "CREATE INDEX idx_calorie_entries_user_date ON mycheff.calorie_entries(user_id, date);",
            "CREATE INDEX idx_calorie_entries_date ON mycheff.calorie_entries(date DESC);",
        ]
        
        created_count = 0
        for idx in advanced_indexes:
            try:
                cursor.execute(idx)
                conn.commit()
                created_count += 1
            except Exception as e:
                print(f"⚠️  Index hatası: {e}")
                conn.rollback()
        
        print(f"✅ {created_count}/{len(advanced_indexes)} gelişmiş indeks oluşturuldu!")
        
        # 12. TRIGGERS
        print("\n⚡ TRİGGER'LAR oluşturuluyor...")
        
        triggers = [
            "CREATE TRIGGER update_users_modtime BEFORE UPDATE ON mycheff.users FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_subscription_plans_modtime BEFORE UPDATE ON mycheff.subscription_plans FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_user_subscriptions_modtime BEFORE UPDATE ON mycheff.user_subscriptions FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_subscription_plan_translations_modtime BEFORE UPDATE ON mycheff.subscription_plan_translations FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_units_modtime BEFORE UPDATE ON mycheff.units FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON mycheff.categories FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_category_translations_modtime BEFORE UPDATE ON mycheff.category_translations FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_ingredient_categories_modtime BEFORE UPDATE ON mycheff.ingredient_categories FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_ingredients_modtime BEFORE UPDATE ON mycheff.ingredients FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_ingredient_translations_modtime BEFORE UPDATE ON mycheff.ingredient_translations FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipes_modtime BEFORE UPDATE ON mycheff.recipes FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_translations_modtime BEFORE UPDATE ON mycheff.recipe_translations FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_details_modtime BEFORE UPDATE ON mycheff.recipe_details FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_ingredients_modtime BEFORE UPDATE ON mycheff.recipe_ingredients FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_media_modtime BEFORE UPDATE ON mycheff.recipe_media FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_user_ingredients_modtime BEFORE UPDATE ON mycheff.user_ingredients FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_ratings_modtime BEFORE UPDATE ON mycheff.recipe_ratings FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_collections_modtime BEFORE UPDATE ON mycheff.recipe_collections FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_collection_recipes_modtime BEFORE UPDATE ON mycheff.collection_recipes FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_app_settings_modtime BEFORE UPDATE ON mycheff.app_settings FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
        ]
        
        trigger_count = 0
        for trigger in triggers:
            try:
                cursor.execute(trigger)
                conn.commit()
                trigger_count += 1
            except Exception as e:
                print(f"⚠️  Trigger hatası: {e}")
                conn.rollback()
        
        print(f"✅ {trigger_count}/{len(triggers)} trigger oluşturuldu!")
        
        # 13. VIEWS
        print("\n👁️ VIEW'LAR oluşturuluyor...")
        
        cursor.execute("""
            CREATE OR REPLACE VIEW mycheff.active_premium_users AS
            SELECT DISTINCT u.id, u.username, u.email, u.preferred_language, us.end_date
            FROM mycheff.users u
            JOIN mycheff.user_subscriptions us ON u.id = us.user_id
            JOIN mycheff.subscription_plans sp ON us.plan_id = sp.id
            WHERE us.end_date > CURRENT_TIMESTAMP
            AND us.payment_status = 'completed'
            AND u.is_active = true
            AND sp.price > 0;
        """)
        
        cursor.execute("""
            CREATE OR REPLACE VIEW mycheff.popular_recipes AS
            SELECT 
                r.id,
                rt.title,
                r.average_rating,
                r.rating_count,
                r.view_count,
                r.cooking_time_minutes,
                r.difficulty_level,
                r.is_premium,
                r.created_at
            FROM mycheff.recipes r
            JOIN mycheff.recipe_translations rt ON r.id = rt.recipe_id
            WHERE r.is_published = true 
            AND rt.language_code = 'tr'
            AND r.average_rating >= 4.0
            AND r.rating_count >= 5
            ORDER BY (r.average_rating * LOG(r.rating_count + 1) + r.view_count * 0.1) DESC;
        """)
        
        conn.commit()
        print("✅ View'lar oluşturuldu!")
        
        # 14. SEED DATA
        print("\n💾 TEMEL VERİLER ekleniyor...")
        
        # Languages (daha fazla dil)
        cursor.execute("""
            INSERT INTO mycheff.languages (code, name) VALUES 
            ('tr', 'Türkçe'),
            ('en', 'English'),
            ('es', 'Español'),
            ('fr', 'Français'),
            ('de', 'Deutsch'),
            ('ar', 'العربية');
        """)
        
        # Units with UUIDs
        cursor.execute("""
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
            ('çay_k', 'metric', 'ml', 5.0),
            ('yemek_k', 'metric', 'ml', 15.0);
        """)
        
        # Subscription plans
        cursor.execute("""
            INSERT INTO mycheff.subscription_plans (name, price, duration_months, features) VALUES
            ('Ücretsiz', 0.00, 0, '{"max_recipes": 10, "premium_recipes": false, "shopping_lists": 1}'),
            ('Premium Aylık', 29.99, 1, '{"max_recipes": -1, "premium_recipes": true, "shopping_lists": 10}'),
            ('Premium Yıllık', 199.99, 12, '{"max_recipes": -1, "premium_recipes": true, "shopping_lists": 10, "discount": true}');
        """)
        
        # Recipe categories
        cursor.execute("""
            INSERT INTO mycheff.categories (icon, color, sort_order) VALUES
            ('🍲', '#FF6B6B', 1),
            ('🥗', '#4ECDC4', 2),
            ('🍝', '#45B7D1', 3),
            ('🍰', '#FFA07A', 4),
            ('🍞', '#98D8C8', 5),
            ('🥘', '#F7DC6F', 6),
            ('🍜', '#BB8FCE', 7),
            ('🥙', '#85C1E9', 8);
        """)
        
        # Category translations
        cursor.execute("""
            INSERT INTO mycheff.category_translations (category_id, language_code, name)
            SELECT c.id, 'tr', 
                CASE c.sort_order
                    WHEN 1 THEN 'Ana Yemekler'
                    WHEN 2 THEN 'Salatalar'
                    WHEN 3 THEN 'Makarnalar'
                    WHEN 4 THEN 'Tatlılar'
                    WHEN 5 THEN 'Ekmek & Börek'
                    WHEN 6 THEN 'Çorbalar'
                    WHEN 7 THEN 'Çin Mutfağı'
                    WHEN 8 THEN 'Fast Food'
                END
            FROM mycheff.categories c;
        """)
        
        cursor.execute("""
            INSERT INTO mycheff.category_translations (category_id, language_code, name)
            SELECT c.id, 'en', 
                CASE c.sort_order
                    WHEN 1 THEN 'Main Dishes'
                    WHEN 2 THEN 'Salads'
                    WHEN 3 THEN 'Pasta'
                    WHEN 4 THEN 'Desserts'
                    WHEN 5 THEN 'Bread & Pastry'
                    WHEN 6 THEN 'Soups'
                    WHEN 7 THEN 'Asian Cuisine'
                    WHEN 8 THEN 'Fast Food'
                END
            FROM mycheff.categories c;
        """)
        
        conn.commit()
        print("✅ Temel veriler eklendi!")
        
        # 15. FINAL CHECKS
        print("\n" + "="*70)
        print("🔍 FİNAL KONTROLLER - UUID SCHEMA")
        print("="*70)
        
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'mycheff' 
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        table_names = [t[0] for t in tables]
        
        print(f"📊 Toplam tablo sayısı: {len(table_names)}")
        
        # Veri kontrolleri
        cursor.execute("SELECT COUNT(*) FROM mycheff.languages;")
        lang_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.units;")
        unit_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.subscription_plans;")
        plan_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.categories;")
        cat_count = cursor.fetchone()[0]
        
        # Function check
        cursor.execute("""
            SELECT COUNT(*) FROM information_schema.routines 
            WHERE specific_schema = 'mycheff' 
            AND routine_type = 'FUNCTION';
        """)
        func_count = cursor.fetchone()[0]
        
        print(f"\n📈 VERİ VE COMPONENT KONTROLLERI:")
        print(f"   🌍 Diller: {lang_count}")
        print(f"   📏 Birimler: {unit_count}")
        print(f"   💳 Abonelik planları: {plan_count}")
        print(f"   📂 Kategoriler: {cat_count}")
        print(f"   ⚙️  Custom functions: {func_count}")
        print(f"   🔍 Gelişmiş indeksler: {created_count}")
        print(f"   ⚡ Trigger'lar: {trigger_count}")
        
        conn.close()
        
        print("\n" + "🎉"*35)
        print("✅ UUID TABANLI SCHEMA BAŞARIYLA OLUŞTURULDU!")
        print("🔐 GÜVENLİK: UUID'ler tahmin edilemez")
        print("⚡ PERFORMANS: Trigram + GIN indeksleri")
        print("🔍 ARAMA: Full-text search fonksiyonları")
        print("📊 ANALİTİK: Gelişmiş query optimizasyonları")
        print("🎉"*35)
        
        return True
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        if 'conn' in locals():
            try:
                conn.rollback()
                conn.close()
            except:
                pass
        return False

if __name__ == "__main__":
    success = create_uuid_complete_schema()
    if success:
        print("\n🎯 SONRAKİ ADIMLAR:")
        print("1. ✅ UUID tabanlı schema hazır")
        print("2. 🔄 CSV verilerini UUID'lerle import et")
        print("3. 🧪 Custom fonksiyonları test et")
        print("4. 🚀 Production'a deploy")
    else:
        print("\n❌ Schema oluşturulamadı!") 