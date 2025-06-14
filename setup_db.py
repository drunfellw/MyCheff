import psycopg2

def setup_database():
    try:
        # Database bağlantısı
        conn = psycopg2.connect(
            host='localhost',
            database='postgres', 
            user='postgres',
            password='123',
            port='5432'
        )
        
        cursor = conn.cursor()
        
        print("🚀 Database setup başlıyor...")
        
        # SQL dosyasını oku ve tamamını çalıştır
        with open('database/setup_complete_schema.sql', 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        print("📄 SQL dosyası okundu, çalıştırılıyor...")
        
        # Tüm SQL'i tek seferde çalıştır
        cursor.execute(sql_content)
        conn.commit()
        
        print("✅ Database schema başarıyla oluşturuldu!")
        
        # Schema kontrolü
        cursor.execute("SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'mycheff';")
        result = cursor.fetchone()
        if result:
            print("✅ mycheff schema oluşturuldu")
        
        # Tablo sayısını kontrol et
        cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'mycheff';")
        table_count = cursor.fetchone()[0]
        print(f"📊 Oluşturulan tablo sayısı: {table_count}")
        
        # Bazı kritik tabloları kontrol et
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'mycheff' 
            AND table_name IN ('ingredients', 'ingredient_translations', 'units', 'ingredient_categories')
        """)
        tables = cursor.fetchall()
        print(f"🔍 Kritik tablolar: {[t[0] for t in tables]}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Hata: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return False

if __name__ == "__main__":
    setup_database() 