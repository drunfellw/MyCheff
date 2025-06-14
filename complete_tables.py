import psycopg2

def create_all_missing_tables():
    try:
        print("🚀 EKSİK TABLOLAR OLUŞTURULUYOR!")
        print("="*50)
        
        conn = psycopg2.connect(
            host='localhost',
            database='postgres', 
            user='postgres',
            password='123',
            port='5432'
        )
        
        cursor = conn.cursor()
        
        # 1. USERS TABLOSU (En önemli!)
        print("👤 Users tablosu oluşturuluyor...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                phone VARCHAR(20),
                avatar VARCHAR(255),
                is_active BOOLEAN DEFAULT TRUE,
                is_verified BOOLEAN DEFAULT FALSE,
                language_preference VARCHAR(5) DEFAULT 'tr',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP WITH TIME ZONE
            );
        """)
        conn.commit()
        
        # 2. SUBSCRIPTION PLANS
        print("💳 Subscription plans tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.subscription_plans (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                duration_months INTEGER NOT NULL,
                features JSONB,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 3. USER SUBSCRIPTIONS
        print("🔑 User subscriptions tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.user_subscriptions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                plan_id INTEGER NOT NULL REFERENCES mycheff.subscription_plans(id),
                start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                end_date TIMESTAMP WITH TIME ZONE,
                is_active BOOLEAN DEFAULT TRUE,
                payment_method VARCHAR(50),
                payment_id VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 4. RECIPES TABLOSU (Çok önemli!)
        print("🍽️ Recipes tablosu oluşturuluyor...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.recipes (
                id SERIAL PRIMARY KEY,
                slug VARCHAR(100) NOT NULL UNIQUE,
                image VARCHAR(255),
                prep_time INTEGER, -- dakika cinsinden
                cook_time INTEGER, -- dakika cinsinden  
                total_time INTEGER, -- dakika cinsinden
                servings INTEGER DEFAULT 4,
                difficulty_level INTEGER DEFAULT 1, -- 1-5 arası
                calories_per_serving INTEGER,
                is_premium BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                view_count INTEGER DEFAULT 0,
                created_by INTEGER REFERENCES mycheff.users(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 5. RECIPE TRANSLATIONS
        print("🌐 Recipe translations tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.recipe_translations (
                id SERIAL PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                title VARCHAR(200) NOT NULL,
                description TEXT,
                instructions TEXT NOT NULL,
                tags VARCHAR(255)[],
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (recipe_id, language_code)
            );
        """)
        conn.commit()
        
        # 6. RECIPE INGREDIENTS (Tarif-Malzeme İlişkisi)
        print("🥕 Recipe ingredients tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.recipe_ingredients (
                id SERIAL PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                ingredient_id INTEGER NOT NULL REFERENCES mycheff.ingredients(id),
                quantity DECIMAL(10,3) NOT NULL,
                unit_id INTEGER NOT NULL REFERENCES mycheff.units(id),
                is_optional BOOLEAN DEFAULT FALSE,
                notes TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (recipe_id, ingredient_id)
            );
        """)
        conn.commit()
        
        # 7. USER INGREDIENTS (Kullanıcının Elindeki Malzemeler)
        print("🏠 User ingredients tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.user_ingredients (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                ingredient_id INTEGER NOT NULL REFERENCES mycheff.ingredients(id),
                quantity DECIMAL(10,3),
                unit_id INTEGER REFERENCES mycheff.units(id),
                expiry_date DATE,
                added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, ingredient_id)
            );
        """)
        conn.commit()
        
        # 8. FAVORITES (Favori Tarifler)
        print("❤️ Favorites tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.favorites (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, recipe_id)
            );
        """)
        conn.commit()
        
        # 9. RATINGS & REVIEWS
        print("⭐ Ratings tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.ratings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                review TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, recipe_id)
            );
        """)
        conn.commit()
        
        # 10. RECIPE CATEGORIES (Tarif Kategorileri)
        print("📂 Recipe categories tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.recipe_categories (
                id SERIAL PRIMARY KEY,
                parent_id INTEGER REFERENCES mycheff.recipe_categories(id),
                icon VARCHAR(50),
                color VARCHAR(7),
                sort_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 11. RECIPE CATEGORY TRANSLATIONS
        print("🌐 Recipe category translations tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.recipe_category_translations (
                id SERIAL PRIMARY KEY,
                category_id INTEGER NOT NULL REFERENCES mycheff.recipe_categories(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (category_id, language_code)
            );
        """)
        conn.commit()
        
        # 12. RECIPE CATEGORY ASSIGNMENTS
        print("🔗 Recipe category assignments tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.recipe_category_assignments (
                id SERIAL PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES mycheff.recipes(id) ON DELETE CASCADE,
                category_id INTEGER NOT NULL REFERENCES mycheff.recipe_categories(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (recipe_id, category_id)
            );
        """)
        conn.commit()
        
        # 13. SHOPPING LISTS
        print("🛒 Shopping lists tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.shopping_lists (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES mycheff.users(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        # 14. SHOPPING LIST ITEMS
        print("📝 Shopping list items tablosu...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.shopping_list_items (
                id SERIAL PRIMARY KEY,
                shopping_list_id INTEGER NOT NULL REFERENCES mycheff.shopping_lists(id) ON DELETE CASCADE,
                ingredient_id INTEGER NOT NULL REFERENCES mycheff.ingredients(id),
                quantity DECIMAL(10,3),
                unit_id INTEGER REFERENCES mycheff.units(id),
                is_purchased BOOLEAN DEFAULT FALSE,
                notes TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        
        print("✅ Tüm eksik tablolar oluşturuldu!")
        
        # TEMEL VERİLERİ EKLE
        print("💾 Temel veriler ekleniyor...")
        
        # Subscription plans
        cursor.execute("""
            INSERT INTO mycheff.subscription_plans (name, price, duration_months, features) VALUES
            ('Ücretsiz', 0.00, 0, '{"max_recipes": 10, "premium_recipes": false, "shopping_lists": 1}'),
            ('Premium Aylık', 29.99, 1, '{"max_recipes": -1, "premium_recipes": true, "shopping_lists": 10}'),
            ('Premium Yıllık', 199.99, 12, '{"max_recipes": -1, "premium_recipes": true, "shopping_lists": 10, "discount": true}')
            ON CONFLICT DO NOTHING;
        """)
        
        # Recipe categories
        cursor.execute("""
            INSERT INTO mycheff.recipe_categories (icon, color, sort_order) VALUES
            ('🍲', '#FF6B6B', 1),
            ('🥗', '#4ECDC4', 2),
            ('🍝', '#45B7D1', 3),
            ('🍰', '#FFA07A', 4),
            ('🍞', '#98D8C8', 5),
            ('🥘', '#F7DC6F', 6),
            ('🍜', '#BB8FCE', 7),
            ('🥙', '#85C1E9', 8)
            ON CONFLICT DO NOTHING;
        """)
        
        # Recipe category translations
        cursor.execute("""
            INSERT INTO mycheff.recipe_category_translations (category_id, language_code, name, description)
            SELECT rc.id, 'tr', 
                CASE rc.sort_order
                    WHEN 1 THEN 'Ana Yemekler'
                    WHEN 2 THEN 'Salatalar'
                    WHEN 3 THEN 'Makarnalar'
                    WHEN 4 THEN 'Tatlılar'
                    WHEN 5 THEN 'Ekmek & Börek'
                    WHEN 6 THEN 'Çorbalar'
                    WHEN 7 THEN 'Çin Mutfağı'
                    WHEN 8 THEN 'Fast Food'
                END,
                CASE rc.sort_order
                    WHEN 1 THEN 'Et, tavuk ve balık yemekleri'
                    WHEN 2 THEN 'Sağlıklı salata tarifleri'
                    WHEN 3 THEN 'Her türlü makarna çeşidi'
                    WHEN 4 THEN 'Tatlı ve dessert tarifleri'
                    WHEN 5 THEN 'Ekmek, börek ve hamur işleri'
                    WHEN 6 THEN 'Sıcak çorba tarifleri'
                    WHEN 7 THEN 'Uzakdoğu mutfağı'
                    WHEN 8 THEN 'Hızlı hazırlanan yemekler'
                END
            FROM mycheff.recipe_categories rc
            ON CONFLICT DO NOTHING;
        """)
        
        cursor.execute("""
            INSERT INTO mycheff.recipe_category_translations (category_id, language_code, name, description)
            SELECT rc.id, 'en', 
                CASE rc.sort_order
                    WHEN 1 THEN 'Main Dishes'
                    WHEN 2 THEN 'Salads'
                    WHEN 3 THEN 'Pasta'
                    WHEN 4 THEN 'Desserts'
                    WHEN 5 THEN 'Bread & Pastry'
                    WHEN 6 THEN 'Soups'
                    WHEN 7 THEN 'Asian Cuisine'
                    WHEN 8 THEN 'Fast Food'
                END,
                CASE rc.sort_order
                    WHEN 1 THEN 'Meat, chicken and fish recipes'
                    WHEN 2 THEN 'Healthy salad recipes'
                    WHEN 3 THEN 'All kinds of pasta dishes'
                    WHEN 4 THEN 'Sweet and dessert recipes'
                    WHEN 5 THEN 'Bread, pastry and dough recipes'
                    WHEN 6 THEN 'Hot soup recipes'
                    WHEN 7 THEN 'Far Eastern cuisine'
                    WHEN 8 THEN 'Quick preparation meals'
                END
            FROM mycheff.recipe_categories rc
            ON CONFLICT DO NOTHING;
        """)
        
        conn.commit()
        
        print("✅ Temel veriler eklendi!")
        
        # KONTROLLER
        print("\n🔍 TABLO KONTROLLERI:")
        print("="*30)
        
        # Tüm tabloları listele
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'mycheff' 
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        table_names = [t[0] for t in tables]
        
        print(f"📊 Toplam tablo sayısı: {len(table_names)}")
        print("📋 Tablolar:")
        for i, table in enumerate(table_names, 1):
            print(f"   {i:2d}. {table}")
        
        # Kritik tabloları kontrol et
        critical_tables = ['users', 'recipes', 'recipe_ingredients', 'user_ingredients', 'favorites']
        print(f"\n✅ KRİTİK TABLOLAR:")
        for table in critical_tables:
            if table in table_names:
                print(f"   ✅ {table}")
            else:
                print(f"   ❌ {table} - EKSİK!")
        
        # Veri kontrolleri
        cursor.execute("SELECT COUNT(*) FROM mycheff.subscription_plans;")
        plans_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.recipe_categories;")
        recipe_cats_count = cursor.fetchone()[0]
        
        print(f"\n📈 VERİ KONTROLLERI:")
        print(f"   💳 Abonelik planları: {plans_count}")
        print(f"   📂 Tarif kategorileri: {recipe_cats_count}")
        
        conn.close()
        
        print("\n" + "="*50)
        print("🎉 TÜM TABLOLAR BAŞARIYLA OLUŞTURULDU!")
        print("✅ MyCheff database'i artık eksiksiz!")
        print("="*50)
        
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
    if create_all_missing_tables():
        print("\n🎯 Sonraki adımlar:")
        print("1. ✅ Database tamamen hazır")
        print("2. 🔄 Backend modülleri (Users, Recipes controller'ları)")
        print("3. 🔄 Frontend API entegrasyonu")
        print("4. 🔄 Test verileri ekleme")
    else:
        print("\n❌ Tablolar oluşturulamadı!") 