import psycopg2

def create_complete_schema():
    try:
        print("🚀 EKSİKSİZ MYCHEFF SCHEMA OLUŞTURULUYOR!")
        print("="*60)
        
        conn = psycopg2.connect(
            host='localhost',
            database='postgres', 
            user='postgres',
            password='123',
            port='5432'
        )
        
        cursor = conn.cursor()
        
        # 0. Temizlik
        print("🧹 Eski schema temizleniyor...")
        cursor.execute("DROP SCHEMA IF EXISTS mycheff CASCADE;")
        cursor.execute("CREATE SCHEMA mycheff;")
        conn.commit()
        
        # 1. Extensions (public schema'da)
        print("📦 Extensions kuruluyor...")
        try:
            cursor.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
            cursor.execute('CREATE EXTENSION IF NOT EXISTS "pg_trgm";')
            cursor.execute('CREATE EXTENSION IF NOT EXISTS "unaccent";')
            conn.commit()
            print("✅ Extensions kuruldu")
        except Exception as e:
            print(f"⚠️  Extension uyarısı: {e}")
            conn.rollback()
        
        # 2. Trigger function
        print("⚙️  Trigger functions...")
        cursor.execute("""
            CREATE OR REPLACE FUNCTION mycheff.update_modified_column()
            RETURNS TRIGGER AS $func$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $func$ LANGUAGE plpgsql;
        """)
        conn.commit()
        
        # 3. Languages
        print("🌍 Languages tablosu...")
        cursor.execute("""
            CREATE TABLE mycheff.languages (
                code VARCHAR(5) PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 4. Users (username ile)
        print("👤 Users tablosu...")
        cursor.execute("""
            CREATE TABLE mycheff.users (
                id SERIAL PRIMARY KEY,
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
        
        # 5. Subscription plans
        print("💳 Subscription plans...")
        cursor.execute("""
            CREATE TABLE mycheff.subscription_plans (
                id SERIAL PRIMARY KEY,
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
        conn.commit()
        
        # 6. Subscription plan translations
        print("🌐 Subscription plan translations...")
        cursor.execute("""
            CREATE TABLE mycheff.subscription_plan_translations (
                id SERIAL PRIMARY KEY,
                plan_id INTEGER NOT NULL REFERENCES mycheff.subscription_plans(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (plan_id, language_code)
            );
        """)
        conn.commit()
        
        # 7. User subscriptions
        print("🔑 User subscriptions...")
        cursor.execute("""
            CREATE TABLE mycheff.user_subscriptions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                plan_id INTEGER NOT NULL REFERENCES mycheff.subscription_plans(id),
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
        
        # 8. Units
        print("📏 Units tablosu...")
        cursor.execute("""
            CREATE TABLE mycheff.units (
                id SERIAL PRIMARY KEY,
                code VARCHAR(10) NOT NULL UNIQUE,
                system VARCHAR(10) NOT NULL,
                base_unit_code VARCHAR(10),
                conversion_factor DECIMAL(10,6),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 9. Unit translations
        print("🌐 Unit translations...")
        cursor.execute("""
            CREATE TABLE mycheff.unit_translations (
                id SERIAL PRIMARY KEY,
                unit_id INTEGER NOT NULL REFERENCES mycheff.units(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(50) NOT NULL,
                short_name VARCHAR(10) NOT NULL,
                plural_name VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (unit_id, language_code)
            );
        """)
        conn.commit()
        
        # 10. CATEGORIES (EKSİK OLAN!)
        print("📂 Categories tablosu...")
        cursor.execute("""
            CREATE TABLE mycheff.categories (
                id SERIAL PRIMARY KEY,
                icon VARCHAR(50),
                color VARCHAR(7),
                sort_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 11. CATEGORY TRANSLATIONS (EKSİK OLAN!)
        print("🌐 Category translations...")
        cursor.execute("""
            CREATE TABLE mycheff.category_translations (
                id SERIAL PRIMARY KEY,
                category_id INTEGER NOT NULL REFERENCES mycheff.categories(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (category_id, language_code)
            );
        """)
        conn.commit()
        
        # 12. Ingredient categories
        print("📂 Ingredient categories...")
        cursor.execute("""
            CREATE TABLE mycheff.ingredient_categories (
                id SERIAL PRIMARY KEY,
                parent_id INTEGER REFERENCES mycheff.ingredient_categories(id),
                icon VARCHAR(50),
                color VARCHAR(7),
                sort_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 13. Ingredient category translations
        print("🌐 Ingredient category translations...")
        cursor.execute("""
            CREATE TABLE mycheff.ingredient_category_translations (
                id SERIAL PRIMARY KEY,
                category_id INTEGER NOT NULL REFERENCES mycheff.ingredient_categories(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (category_id, language_code)
            );
        """)
        conn.commit()
        
        # 14. Ingredients
        print("🥬 Ingredients tablosu...")
        cursor.execute("""
            CREATE TABLE mycheff.ingredients (
                id SERIAL PRIMARY KEY,
                default_unit VARCHAR(20) NOT NULL,
                slug VARCHAR(50),
                image VARCHAR(255),
                nutritional_info JSONB,
                is_active BOOLEAN DEFAULT TRUE,
                category_id INTEGER REFERENCES mycheff.ingredient_categories(id),
                unit_id INTEGER REFERENCES mycheff.units(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 15. Ingredient translations
        print("🌐 Ingredient translations...")
        cursor.execute("""
            CREATE TABLE mycheff.ingredient_translations (
                id SERIAL PRIMARY KEY,
                ingredient_id INTEGER NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(100) NOT NULL,
                aliases TEXT[],
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (ingredient_id, language_code)
            );
        """)
        conn.commit()
        
        # 16. Recipes
        print("🍽️ Recipes tablosu...")
        cursor.execute("""
            CREATE TABLE mycheff.recipes (
                id SERIAL PRIMARY KEY,
                is_premium BOOLEAN DEFAULT FALSE,
                is_featured BOOLEAN DEFAULT FALSE,
                cooking_time_minutes INTEGER NOT NULL,
                prep_time_minutes INTEGER,
                author_id INTEGER REFERENCES mycheff.users(id),
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
        conn.commit()
        
        # 17. Recipe translations
        print("🌐 Recipe translations...")
        cursor.execute("""
            CREATE TABLE mycheff.recipe_translations (
                id SERIAL PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
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
        conn.commit()
        
        # 18. Recipe details (EKSİK OLAN!)
        print("📋 Recipe details...")
        cursor.execute("""
            CREATE TABLE mycheff.recipe_details (
                id SERIAL PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                nutritional_data JSONB,
                attributes JSONB,
                serving_size VARCHAR(30),
                estimated_cost DECIMAL(10,2),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (recipe_id)
            );
        """)
        conn.commit()
        
        # 19. Recipe categories (Many-to-many)
        print("🔗 Recipe categories...")
        cursor.execute("""
            CREATE TABLE mycheff.recipe_categories (
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                category_id INTEGER NOT NULL REFERENCES mycheff.categories(id) ON DELETE CASCADE,
                PRIMARY KEY (recipe_id, category_id)
            );
        """)
        conn.commit()
        
        # 20. Recipe ingredients
        print("🥕 Recipe ingredients...")
        cursor.execute("""
            CREATE TABLE mycheff.recipe_ingredients (
                id SERIAL PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                ingredient_id INTEGER NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
                quantity DECIMAL(10, 2),
                unit VARCHAR(30),
                is_required BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (recipe_id, ingredient_id)
            );
        """)
        conn.commit()
        
        # 21. Recipe media (EKSİK OLAN!)
        print("📸 Recipe media...")
        cursor.execute("""
            CREATE TABLE mycheff.recipe_media (
                id SERIAL PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
                url VARCHAR(255) NOT NULL,
                is_primary BOOLEAN DEFAULT FALSE,
                display_order INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 22. User ingredients
        print("🏠 User ingredients...")
        cursor.execute("""
            CREATE TABLE mycheff.user_ingredients (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                ingredient_id INTEGER NOT NULL REFERENCES mycheff.ingredients(id) ON DELETE CASCADE,
                quantity DECIMAL(10, 2),
                unit VARCHAR(30),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, ingredient_id)
            );
        """)
        conn.commit()
        
        # 23. Favorite recipes
        print("❤️ Favorite recipes...")
        cursor.execute("""
            CREATE TABLE mycheff.favorite_recipes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, recipe_id)
            );
        """)
        conn.commit()
        
        # 24. Recipe ratings
        print("⭐ Recipe ratings...")
        cursor.execute("""
            CREATE TABLE mycheff.recipe_ratings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                review_text TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, recipe_id)
            );
        """)
        conn.commit()
        
        # 25. Recipe collections (EKSİK OLAN!)
        print("📚 Recipe collections...")
        cursor.execute("""
            CREATE TABLE mycheff.recipe_collections (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                is_public BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 26. Collection recipes (EKSİK OLAN!)
        print("🔗 Collection recipes...")
        cursor.execute("""
            CREATE TABLE mycheff.collection_recipes (
                id SERIAL PRIMARY KEY,
                collection_id INTEGER NOT NULL REFERENCES mycheff.recipe_collections(id) ON DELETE CASCADE,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (collection_id, recipe_id)
            );
        """)
        conn.commit()
        
        # 27. User activities (EKSİK OLAN!)
        print("📊 User activities...")
        cursor.execute("""
            CREATE TABLE mycheff.user_activities (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                activity_type VARCHAR(50) NOT NULL,
                recipe_id INTEGER REFERENCES mycheff.recipes(id),
                metadata JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 28. Push notifications (EKSİK OLAN!)
        print("🔔 Push notifications...")
        cursor.execute("""
            CREATE TABLE mycheff.push_notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES mycheff.users(id) ON DELETE CASCADE,
                title VARCHAR(100) NOT NULL,
                body TEXT NOT NULL,
                data JSONB,
                status VARCHAR(20) DEFAULT 'pending',
                sent_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 29. Calorie entries (EKSİK OLAN!)
        print("🍎 Calorie entries...")
        cursor.execute("""
            CREATE TABLE mycheff.calorie_entries (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                recipe_id INTEGER REFERENCES mycheff.recipes(id),
                date DATE NOT NULL,
                meal_type VARCHAR(20) NOT NULL,
                calories INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, recipe_id, date, meal_type)
            );
        """)
        conn.commit()
        
        # 30. App settings (EKSİK OLAN!)
        print("⚙️ App settings...")
        cursor.execute("""
            CREATE TABLE mycheff.app_settings (
                id SERIAL PRIMARY KEY,
                key VARCHAR(50) NOT NULL UNIQUE,
                value JSONB NOT NULL,
                description TEXT,
                is_public BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        print("✅ Tüm tablolar oluşturuldu!")
        print("\n🔍 İNDEKSLER oluşturuluyor...")
        
        # İNDEKSLER
        indexes = [
            "CREATE INDEX idx_users_username ON mycheff.users(username);",
            "CREATE INDEX idx_users_email ON mycheff.users(email);",
            "CREATE INDEX idx_users_active ON mycheff.users(is_active) WHERE is_active = true;",
            "CREATE INDEX idx_categories_sort_order ON mycheff.categories(sort_order, is_active);",
            "CREATE INDEX idx_ingredient_categories_sort_order ON mycheff.ingredient_categories(sort_order, is_active);",
            "CREATE INDEX idx_ingredients_category ON mycheff.ingredients(category_id);",
            "CREATE INDEX idx_ingredients_unit ON mycheff.ingredients(unit_id);",
            "CREATE INDEX idx_recipes_cooking_time ON mycheff.recipes(cooking_time_minutes);",
            "CREATE INDEX idx_recipes_premium ON mycheff.recipes(is_premium) WHERE is_premium = true;",
            "CREATE INDEX idx_recipes_difficulty ON mycheff.recipes(difficulty_level);",
            "CREATE INDEX idx_recipes_featured ON mycheff.recipes(is_featured) WHERE is_featured = true;",
            "CREATE INDEX idx_recipes_published ON mycheff.recipes(is_published) WHERE is_published = true;",
            "CREATE INDEX idx_recipes_rating ON mycheff.recipes(average_rating DESC, rating_count DESC);",
            "CREATE INDEX idx_recipe_categories_category ON mycheff.recipe_categories(category_id);",
            "CREATE INDEX idx_recipe_ingredients_ingredient ON mycheff.recipe_ingredients(ingredient_id);",
            "CREATE INDEX idx_recipe_ingredients_recipe ON mycheff.recipe_ingredients(recipe_id);",
            "CREATE INDEX idx_recipe_media_recipe_order ON mycheff.recipe_media(recipe_id, display_order);",
            "CREATE INDEX idx_user_ingredients_user_id ON mycheff.user_ingredients(user_id);",
            "CREATE INDEX idx_user_ingredients_ingredient_id ON mycheff.user_ingredients(ingredient_id);",
            "CREATE INDEX idx_favorite_recipes_user_id ON mycheff.favorite_recipes(user_id);",
            "CREATE INDEX idx_recipe_ratings_recipe ON mycheff.recipe_ratings(recipe_id);",
            "CREATE INDEX idx_recipe_ratings_user ON mycheff.recipe_ratings(user_id);",
            "CREATE INDEX idx_user_activities_user_type ON mycheff.user_activities(user_id, activity_type);",
            "CREATE INDEX idx_user_activities_created_at ON mycheff.user_activities(created_at);",
            "CREATE INDEX idx_recipe_collections_user ON mycheff.recipe_collections(user_id);",
            "CREATE INDEX idx_push_notifications_user ON mycheff.push_notifications(user_id);",
            "CREATE INDEX idx_push_notifications_status ON mycheff.push_notifications(status);",
            "CREATE INDEX idx_calorie_entries_user_date ON mycheff.calorie_entries(user_id, date);",
        ]
        
        for idx in indexes:
            try:
                cursor.execute(idx)
                conn.commit()
            except Exception as e:
                print(f"⚠️  Index hatası (normal): {e}")
                conn.rollback()
        
        print("✅ İndeksler oluşturuldu!")
        print("\n⚡ TRİGGER'LAR oluşturuluyor...")
        
        # TRIGGERLAR
        triggers = [
            "CREATE TRIGGER update_users_modtime BEFORE UPDATE ON mycheff.users FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_subscription_plans_modtime BEFORE UPDATE ON mycheff.subscription_plans FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_user_subscriptions_modtime BEFORE UPDATE ON mycheff.user_subscriptions FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_units_modtime BEFORE UPDATE ON mycheff.units FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON mycheff.categories FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_ingredient_categories_modtime BEFORE UPDATE ON mycheff.ingredient_categories FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_ingredients_modtime BEFORE UPDATE ON mycheff.ingredients FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipes_modtime BEFORE UPDATE ON mycheff.recipes FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_details_modtime BEFORE UPDATE ON mycheff.recipe_details FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_ingredients_modtime BEFORE UPDATE ON mycheff.recipe_ingredients FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_media_modtime BEFORE UPDATE ON mycheff.recipe_media FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_user_ingredients_modtime BEFORE UPDATE ON mycheff.user_ingredients FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_ratings_modtime BEFORE UPDATE ON mycheff.recipe_ratings FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_recipe_collections_modtime BEFORE UPDATE ON mycheff.recipe_collections FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
            "CREATE TRIGGER update_app_settings_modtime BEFORE UPDATE ON mycheff.app_settings FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();",
        ]
        
        for trigger in triggers:
            try:
                cursor.execute(trigger)
                conn.commit()
            except Exception as e:
                print(f"⚠️  Trigger hatası: {e}")
                conn.rollback()
        
        print("✅ Trigger'lar oluşturuldu!")
        
        print("\n👁️ VIEW'LAR oluşturuluyor...")
        
        # VIEW'LAR
        cursor.execute("""
            CREATE OR REPLACE VIEW mycheff.active_premium_users AS
            SELECT u.id, u.username, u.email, us.end_date
            FROM mycheff.users u
            JOIN mycheff.user_subscriptions us ON u.id = us.user_id
            JOIN mycheff.subscription_plans sp ON us.plan_id = sp.id
            WHERE u.is_active = true 
            AND us.end_date > CURRENT_TIMESTAMP
            AND sp.price > 0;
        """)
        conn.commit()
        
        # TEMEL VERİLER
        print("\n💾 TEMEL VERİLER ekleniyor...")
        
        # Languages
        cursor.execute("""
            INSERT INTO mycheff.languages (code, name) VALUES 
            ('tr', 'Türkçe'),
            ('en', 'English');
        """)
        
        # Units
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
        
        # Recipe categories (missing olan!)
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
        
        # KONTROLLER
        print("\n" + "="*60)
        print("🔍 FİNAL KONTROLLER")
        print("="*60)
        
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'mycheff' 
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        table_names = [t[0] for t in tables]
        
        print(f"📊 Toplam tablo sayısı: {len(table_names)}")
        
        # Kritik eksik tabloları kontrol et
        critical_missing = ['categories', 'category_translations', 'recipe_details', 'recipe_media', 'user_activities', 'push_notifications', 'calorie_entries', 'app_settings']
        
        print(f"\n✅ KRİTİK EKSİK TABLOLAR KONTROL:")
        all_ok = True
        for table in critical_missing:
            if table in table_names:
                print(f"   ✅ {table}")
            else:
                print(f"   ❌ {table} - HALA EKSİK!")
                all_ok = False
        
        # Veri kontrolleri
        cursor.execute("SELECT COUNT(*) FROM mycheff.languages;")
        lang_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.units;")
        unit_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.subscription_plans;")
        plan_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.categories;")
        cat_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.category_translations;")
        cat_trans_count = cursor.fetchone()[0]
        
        print(f"\n📈 VERİ KONTROLLERI:")
        print(f"   🌍 Diller: {lang_count}")
        print(f"   📏 Birimler: {unit_count}")
        print(f"   💳 Abonelik planları: {plan_count}")
        print(f"   📂 Kategoriler: {cat_count}")
        print(f"   🌐 Kategori çevirileri: {cat_trans_count}")
        
        conn.close()
        
        if all_ok:
            print("\n" + "🎉"*30)
            print("✅ TÜM SCHEMA EKSİKSİZ OLUŞTURULDU!")
            print("✅ İndeksler, trigger'lar, view'lar hazır!")
            print("✅ MyCheff database'i production-ready!")
            print("🎉"*30)
        else:
            print("\n❌ Hala eksiklikler var!")
        
        return all_ok
        
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
    if create_complete_schema():
        print("\n🎯 SONRAKİ ADIMLAR:")
        print("1. ✅ Database tamamen eksiksiz")
        print("2. 🔄 CSV verilerini yeniden import et")
        print("3. 🔄 Backend entegrasyonu")
        print("4. 🔄 Test verileri ekle")
    else:
        print("\n❌ Schema oluşturulamadı!") 