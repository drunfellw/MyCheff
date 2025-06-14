import psycopg2

def setup_minimal_schema():
    try:
        conn = psycopg2.connect(
            host='localhost',
            database='postgres', 
            user='postgres',
            password='123',
            port='5432'
        )
        
        cursor = conn.cursor()
        
        print("🚀 Minimal schema oluşturuluyor...")
        
        # Schema oluştur
        cursor.execute("CREATE SCHEMA IF NOT EXISTS mycheff;")
        
        # Extensions
        cursor.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS \"pg_trgm\";")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS \"unaccent\";")
        
        # Search path ayarla
        cursor.execute("SET search_path TO mycheff, public;")
        
        # Update function
        cursor.execute("""
            CREATE OR REPLACE FUNCTION mycheff.update_modified_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        """)
        
        # Languages
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.languages (
                code VARCHAR(5) PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Units
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.units (
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
        
        # Unit translations
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.unit_translations (
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
        
        # Ingredient categories
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.ingredient_categories (
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
        
        # Ingredient category translations
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.ingredient_category_translations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                category_id UUID NOT NULL REFERENCES mycheff.ingredient_categories(id) ON DELETE CASCADE,
                language_code VARCHAR(5) NOT NULL REFERENCES mycheff.languages(code),
                name VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (category_id, language_code)
            );
        """)
        
        # Ingredients (slug kolonu ile)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.ingredients (
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
        
        # Ingredient translations
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mycheff.ingredient_translations (
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
        
        # Commit all changes
        conn.commit()
        
        print("✅ Temel tablolar oluşturuldu!")
        
        # Insert basic data
        cursor.execute("""
            INSERT INTO mycheff.languages (code, name) VALUES 
            ('tr', 'Türkçe'),
            ('en', 'English')
            ON CONFLICT (code) DO NOTHING;
        """)
        
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
            ('bardak', 'metric', 'ml', 250.0)
            ON CONFLICT (code) DO NOTHING;
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
                END
            FROM mycheff.units u
            ON CONFLICT (unit_id, language_code) DO NOTHING;
        """)
        
        conn.commit()
        
        print("✅ Temel veriler eklendi!")
        
        # Tablo kontrolü
        cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'mycheff';")
        table_count = cursor.fetchone()[0]
        print(f"📊 Oluşturulan tablo sayısı: {table_count}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return False

if __name__ == "__main__":
    setup_minimal_schema() 