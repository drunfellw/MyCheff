import psycopg2
import time

def setup_complete_schema():
    try:
        print("🚀 PostgreSQL MyCheff Schema Kurulumu Başlıyor...")
        
        # Database bağlantısı
        conn = psycopg2.connect(
            host='localhost',
            database='postgres', 
            user='postgres',
            password='123',
            port='5432'
        )
        
        cursor = conn.cursor()
        
        print("✅ Database bağlantısı başarılı")
        
        # 1. Eski schema'yı sil
        print("🧹 Eski schema temizleniyor...")
        cursor.execute("DROP SCHEMA IF EXISTS mycheff CASCADE;")
        conn.commit()
        
        # 2. Extension'ları kontrol et ve gerekirse kur
        print("📦 Extension'lar kontrol ediliyor...")
        try:
            cursor.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
            cursor.execute('CREATE EXTENSION IF NOT EXISTS "pg_trgm";')
            cursor.execute('CREATE EXTENSION IF NOT EXISTS "unaccent";')
            conn.commit()
            print("✅ Extension'lar hazır")
        except Exception as e:
            print(f"⚠️  Extension uyarısı: {e}")
            print("🔄 Extension olmadan devam ediliyor...")
            conn.rollback()
        
        # 3. mycheff schema'sını oluştur
        print("🏗️  mycheff schema'sı oluşturuluyor...")
        cursor.execute("CREATE SCHEMA mycheff;")
        conn.commit()
        
        # 4. Search path ayarla
        cursor.execute("SET search_path TO mycheff, public;")
        
        # 5. Update function'ı oluştur (uuid-ossp olmadan)
        print("⚙️  Trigger function'ı oluşturuluyor...")
        cursor.execute("""
            CREATE OR REPLACE FUNCTION mycheff.update_modified_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        """)
        
        # 6. Temel tabloları oluştur
        print("📊 Temel tablolar oluşturuluyor...")
        
        # Languages table
        cursor.execute("""
            CREATE TABLE mycheff.languages (
                code VARCHAR(5) PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Units table (uuid yerine serial kullan)
        cursor.execute("""
            CREATE TABLE mycheff.units (
                id SERIAL PRIMARY KEY,
                uuid_id VARCHAR(36) DEFAULT CONCAT(
                    LPAD(TO_HEX(FLOOR(RANDOM() * 4294967296)::BIGINT), 8, '0'), '-',
                    LPAD(TO_HEX(FLOOR(RANDOM() * 65536)::BIGINT), 4, '0'), '-',
                    LPAD(TO_HEX(FLOOR(RANDOM() * 65536)::BIGINT), 4, '0'), '-',
                    LPAD(TO_HEX(FLOOR(RANDOM() * 65536)::BIGINT), 4, '0'), '-',
                    LPAD(TO_HEX(FLOOR(RANDOM() * 281474976710656)::BIGINT), 12, '0')
                ),
                code VARCHAR(10) NOT NULL UNIQUE,
                system VARCHAR(10) NOT NULL,
                base_unit_code VARCHAR(10),
                conversion_factor DECIMAL(10,6),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Unit translations table
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
        
        # Ingredient categories table
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
        
        # Ingredient category translations table
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
        
        # Ingredients table (slug ile)
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
        
        # Ingredient translations table
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
        
        print("✅ Tablolar oluşturuldu!")
        
        # 7. İndeksleri oluştur (trigram olmadan)
        print("🔍 İndeksler oluşturuluyor...")
        try:
            cursor.execute("CREATE INDEX idx_ingredient_translations_name_trgm ON mycheff.ingredient_translations USING gin (name gin_trgm_ops);")
        except:
            cursor.execute("CREATE INDEX idx_ingredient_translations_name ON mycheff.ingredient_translations(name);")
            
        cursor.execute("CREATE INDEX idx_ingredient_translations_aliases ON mycheff.ingredient_translations USING gin (aliases);")
        cursor.execute("CREATE INDEX idx_ingredients_category ON mycheff.ingredients(category_id);")
        cursor.execute("CREATE INDEX idx_ingredients_unit ON mycheff.ingredients(unit_id);")
        
        # 8. Trigger'ları oluştur
        print("⚡ Trigger'lar oluşturuluyor...")
        cursor.execute("""
            CREATE TRIGGER update_units_modtime
                BEFORE UPDATE ON mycheff.units
                FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
        """)
        
        cursor.execute("""
            CREATE TRIGGER update_ingredient_categories_modtime
                BEFORE UPDATE ON mycheff.ingredient_categories
                FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
        """)
        
        cursor.execute("""
            CREATE TRIGGER update_ingredients_modtime
                BEFORE UPDATE ON mycheff.ingredients
                FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
        """)
        
        cursor.execute("""
            CREATE TRIGGER update_ingredient_translations_modtime
                BEFORE UPDATE ON mycheff.ingredient_translations
                FOR EACH ROW EXECUTE FUNCTION mycheff.update_modified_column();
        """)
        
        conn.commit()
        
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
            ('çay kaşığı', 'metric', 'ml', 5.0),
            ('yemek kaşığı', 'metric', 'ml', 15.0);
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
                    WHEN 'çay kaşığı' THEN 'çay kaşığı'
                    WHEN 'yemek kaşığı' THEN 'yemek kaşığı'
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
                    WHEN 'çay kaşığı' THEN 'çay kaşığı'
                    WHEN 'yemek kaşığı' THEN 'yemek kaşığı'
                END
            FROM mycheff.units u;
        """)
        
        conn.commit()
        
        print("✅ Temel veriler eklendi!")
        
        # 10. Final kontroller
        print("🔍 Final kontroller yapılıyor...")
        
        # Schema kontrolü
        cursor.execute("SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'mycheff';")
        if cursor.fetchone():
            print("✅ mycheff schema oluşturuldu")
        
        # Tablo sayısı
        cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'mycheff';")
        table_count = cursor.fetchone()[0]
        print(f"📊 Oluşturulan tablo sayısı: {table_count}")
        
        # Kritik tabloları kontrol et
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'mycheff' 
            AND table_name IN ('ingredients', 'ingredient_translations', 'units', 'ingredient_categories', 'ingredient_category_translations', 'unit_translations', 'languages')
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        table_names = [t[0] for t in tables]
        print(f"🔍 Oluşturulan kritik tablolar: {table_names}")
        
        # Veri kontrolü
        cursor.execute("SELECT COUNT(*) FROM mycheff.languages;")
        lang_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.units;")
        unit_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM mycheff.unit_translations;")
        unit_trans_count = cursor.fetchone()[0]
        
        print(f"📈 Veri kontrolleri:")
        print(f"   - Diller: {lang_count}")
        print(f"   - Birimler: {unit_count}")
        print(f"   - Birim çevirileri: {unit_trans_count}")
        
        conn.close()
        
        print("🎉 mycheff schema başarıyla kuruldu!")
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
    if setup_complete_schema():
        print("✅ Schema kurulumu tamamlandı!")
        print("🎯 Sonraki adım: Ingredient verilerini import etmek")
        print("💡 Komut: cd mycheff-py && python3 get_data_fixed.py")
    else:
        print("❌ Schema kurulumu başarısız!") 