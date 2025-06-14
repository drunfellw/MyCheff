import psycopg2

def create_basic_tables():
    try:
        print("🚀 Basit Tablo Oluşturma Başlıyor...")
        
        conn = psycopg2.connect(
            host='localhost',
            database='postgres', 
            user='postgres',
            password='123',
            port='5432'
        )
        
        cursor = conn.cursor()
        
        # 1. Schema temizle ve oluştur
        print("🧹 Schema temizleniyor...")
        cursor.execute("DROP SCHEMA IF EXISTS mycheff CASCADE;")
        cursor.execute("CREATE SCHEMA mycheff;")
        conn.commit()
        
        # 2. Languages tablosu
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
        
        # 3. Units tablosu  
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
        
        # 4. Unit translations tablosu
        print("🌐 Unit translations tablosu...")
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
        
        # 5. Ingredient categories tablosu
        print("📂 Ingredient categories tablosu...")
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
        
        # 6. Ingredient category translations tablosu
        print("🌐 Ingredient category translations tablosu...")
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
        
        # 7. Ingredients tablosu
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
        
        # 8. Ingredient translations tablosu
        print("🌐 Ingredient translations tablosu...")
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
        
        print("✅ Tüm tablolar oluşturuldu!")
        
        # 9. Temel verileri ekle
        print("💾 Temel veriler ekleniyor...")
        
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
        
        # Unit translations
        cursor.execute("""
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
                    WHEN 'çay_k' THEN 'çay kaşığı'
                    WHEN 'yemek_k' THEN 'yemek kaşığı'
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
                    WHEN 'çay_k' THEN 'çay kaşığı'
                    WHEN 'yemek_k' THEN 'yemek kaşığı'
                END
            FROM mycheff.units u;
        """)
        
        conn.commit()
        
        print("✅ Temel veriler eklendi!")
        
        # 10. Kontroller
        cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'mycheff';")
        table_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'mycheff' ORDER BY table_name;")
        tables = cursor.fetchall()
        table_names = [t[0] for t in tables]
        
        cursor.execute("SELECT COUNT(*) FROM mycheff.languages;")
        lang_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.units;")
        unit_count = cursor.fetchone()[0]
        
        print(f"📊 Oluşturulan tablo sayısı: {table_count}")
        print(f"🔍 Tablolar: {table_names}")
        print(f"📈 Diller: {lang_count}, Birimler: {unit_count}")
        
        conn.close()
        
        print("🎉 Temel schema hazır!")
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
    if create_basic_tables():
        print("\n✅ Schema başarıyla oluşturuldu!")
        print("🎯 Sonraki adım: cd mycheff-py && python3 get_data_fixed.py")
    else:
        print("\n❌ Schema oluşturulamadı!") 