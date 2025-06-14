# MyCheff Database Documentation

## Genel Bakış

MyCheff, çok dilli tarif yönetim sistemi için tasarlanmış PostgreSQL veritabanıdır. Sistem, kullanıcıların malzemelerine göre tarif önermek, premium abonelik yönetimi ve detaylı tarif bilgileri sunmak üzere optimize edilmiştir.

### Temel Özellikler
- **Çok dilli destek** (TR, EN, ES, FR)
- **Premium abonelik sistemi**
- **Malzeme bazlı tarif eşleştirme**
- **Tam metin arama** (PostgreSQL pg_trgm)
- **Kalori takibi ve koleksiyon yönetimi**
- **Push bildirim desteği**

### Teknik Özellikler
- **PostgreSQL 12+** gerektirir
- **UUID** primary key kullanımı
- **JSONB** esnek veri yapıları için
- **pg_trgm** extension ile fuzzy search
- **Materialized view** ile performans optimizasyonu

## Veritabanı Şeması

### Schema: `mycheff`
Tüm tablolar ve objeler `mycheff` schema'sı altında bulunur.

## Tablo Detayları

### 1. Sistem Tabloları

#### `languages`
Sistem tarafından desteklenen dilleri tutar.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| code | VARCHAR(5) PK | ISO dil kodu (tr, en, es, fr) |
| name | VARCHAR(50) | Dilin adı |
| is_active | BOOLEAN | Dil aktif mi? |
| created_at | TIMESTAMP | Oluşturulma zamanı |

#### `app_settings`
Uygulama genelindeki ayarları JSON formatında saklar.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Benzersiz kimlik |
| key | VARCHAR(50) UNIQUE | Ayar anahtarı |
| value | JSONB | Ayar değeri (JSON) |
| description | TEXT | Ayar açıklaması |
| is_public | BOOLEAN | Kullanıcılara görünür mü? |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

### 2. Kullanıcı Tabloları

#### `users`
Sistem kullanıcılarını tutar.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Benzersiz kullanıcı kimliği |
| username | VARCHAR(50) UNIQUE | Kullanıcı adı |
| email | VARCHAR(100) UNIQUE | E-posta adresi |
| password_hash | VARCHAR(255) | Şifrelenmiş parola |
| preferred_language | VARCHAR(5) FK | Tercih edilen dil |
| profile_image | VARCHAR(255) | Profil fotoğrafı URL'i |
| bio | TEXT | Kullanıcı biyografisi |
| cooking_skill_level | SMALLINT (1-5) | Yemek yapma seviyesi |
| dietary_restrictions | JSONB | Diyet kısıtlamaları |
| allergies | TEXT[] | Alerjiler listesi |
| is_active | BOOLEAN | Hesap aktif mi? |
| last_login_at | TIMESTAMP | Son giriş zamanı |
| fcm_token | VARCHAR(255) | Push bildirim token |
| created_at | TIMESTAMP | Kayıt tarihi |
| updated_at | TIMESTAMP | Son güncelleme |

**İndeksler:**
- `idx_users_username_gin` - Kullanıcı adı araması için GIN
- `idx_users_email` - E-posta ile hızlı erişim
- `idx_users_preferred_language` - Dil bazlı filtreleme
- `idx_users_active` - Aktif kullanıcılar için partial index

### 3. Abonelik Sistemi

#### `subscription_plans`
Mevcut abonelik planları.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Plan kimliği |
| name | VARCHAR(50) | Plan adı (internal) |
| duration_months | INTEGER | Plan süresi (ay) |
| price | DECIMAL(10,2) | Plan ücreti |
| description | TEXT | Plan açıklaması |
| features | JSONB | Plan özellikleri |
| is_active | BOOLEAN | Plan aktif mi? |
| sort_order | INTEGER | Görüntüleme sırası |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

#### `subscription_plan_translations`
Plan isim ve açıklamalarının çevirileri.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Çeviri kimliği |
| plan_id | UUID FK | Plan referansı |
| language_code | VARCHAR(5) FK | Dil kodu |
| name | VARCHAR(50) | Plan adı (kullanıcıya gösterilen) |
| description | TEXT | Plan açıklaması |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

#### `user_subscriptions`
Kullanıcı abonelikleri.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Abonelik kimliği |
| user_id | UUID FK | Kullanıcı referansı |
| plan_id | UUID FK | Plan referansı |
| start_date | TIMESTAMP | Başlangıç tarihi |
| end_date | TIMESTAMP | Bitiş tarihi |
| payment_reference | VARCHAR(100) | Ödeme referansı |
| payment_status | VARCHAR(20) | Ödeme durumu |
| payment_method | VARCHAR(50) | Ödeme yöntemi |
| is_auto_renew | BOOLEAN | Otomatik yenileme |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

**İndeksler:**
- `idx_user_subscriptions_user_id` - Kullanıcı abonelikleri
- `idx_user_subscriptions_end_date` - Süre kontrolü
- `idx_active_subscriptions` - Aktif abonelikler

### 4. Kategori Tabloları

#### `categories`
Tarif kategorileri (Kahvaltı, Ana Yemek vb.)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Kategori kimliği |
| icon | VARCHAR(50) | İkon kodu |
| color | VARCHAR(7) | Renk kodu (#FF0000) |
| sort_order | INTEGER | Sıralama |
| is_active | BOOLEAN | Aktif mi? |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

#### `category_translations`
Kategori isimlerinin çevirileri.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Çeviri kimliği |
| category_id | UUID FK | Kategori referansı |
| language_code | VARCHAR(5) FK | Dil kodu |
| name | VARCHAR(50) | Kategori adı |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

### 5. Malzeme Tabloları

#### `ingredient_categories`
Malzeme kategorileri (hiyerarşik).

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Kategori kimliği |
| parent_id | UUID FK (self) | Üst kategori |
| icon | VARCHAR(50) | İkon kodu |
| color | VARCHAR(7) | Renk kodu |
| sort_order | INTEGER | Sıralama |
| is_active | BOOLEAN | Aktif mi? |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

#### `ingredients`
Sistem malzemeleri.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Malzeme kimliği |
| default_unit | VARCHAR(20) | Varsayılan birim |
| slug | VARCHAR(50) UNIQUE | URL-friendly isim |
| image | VARCHAR(255) | Görsel URL'i |
| nutritional_info | JSONB | Besin değerleri |
| is_active | BOOLEAN | Aktif mi? |
| category_id | UUID FK | Kategori referansı |
| unit_id | UUID FK | Birim referansı |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

#### `ingredient_translations`
Malzeme isim ve eşanlamları.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Çeviri kimliği |
| ingredient_id | UUID FK | Malzeme referansı |
| language_code | VARCHAR(5) FK | Dil kodu |
| name | VARCHAR(100) | Malzeme adı |
| aliases | TEXT[] | Alternatif isimler |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

**İndeksler:**
- `idx_ingredient_translations_name_trgm` - İsim araması için GIN
- `idx_ingredient_translations_aliases` - Eşanlamlarda arama

### 6. Ölçü Birimleri

#### `units`
Ölçü birimleri (g, kg, ml, l vb.)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Birim kimliği |
| code | VARCHAR(10) UNIQUE | Birim kodu |
| system | VARCHAR(10) | metric/imperial/other |
| base_unit_code | VARCHAR(10) | Temel birim |
| conversion_factor | DECIMAL(10,6) | Dönüşüm faktörü |
| is_active | BOOLEAN | Aktif mi? |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

#### `unit_translations`
Birim isimlerinin çevirileri.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Çeviri kimliği |
| unit_id | UUID FK | Birim referansı |
| language_code | VARCHAR(5) FK | Dil kodu |
| name | VARCHAR(50) | Birim adı |
| short_name | VARCHAR(10) | Kısa ad |
| plural_name | VARCHAR(50) | Çoğul isim |
| created_at | TIMESTAMP | Oluşturulma zamanı |

### 7. Tarif Tabloları

#### `recipes`
Ana tarif tablosu.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Tarif kimliği |
| is_premium | BOOLEAN | Premium tarif mi? |
| is_featured | BOOLEAN | Öne çıkan mı? |
| cooking_time_minutes | INTEGER | Pişirme süresi |
| prep_time_minutes | INTEGER | Hazırlık süresi |
| author_id | UUID FK | Tarifi ekleyen |
| difficulty_level | SMALLINT (1-5) | Zorluk seviyesi |
| serving_size | SMALLINT | Porsiyon sayısı |
| is_published | BOOLEAN | Yayında mı? |
| view_count | INTEGER | Görüntülenme |
| average_rating | DECIMAL(2,1) | Ortalama puan |
| rating_count | INTEGER | Değerlendirme sayısı |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

**İndeksler:**
- `idx_recipes_cooking_time` - Süreye göre filtreleme
- `idx_recipes_premium` - Premium tariflere hızlı erişim
- `idx_recipes_difficulty` - Zorluk seviyesine göre
- `idx_recipes_featured` - Öne çıkan tarifler
- `idx_recipes_published` - Yayındaki tarifler

#### `recipe_translations`
Tarif başlık, açıklama ve adımları.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Çeviri kimliği |
| recipe_id | UUID FK | Tarif referansı |
| language_code | VARCHAR(5) FK | Dil kodu |
| title | VARCHAR(100) | Tarif başlığı |
| description | TEXT | Tarif açıklaması |
| preparation_steps | JSONB | Hazırlama adımları |
| tips | TEXT[] | İpuçları |
| search_vector | TSVECTOR | Arama vektörü |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

**preparation_steps JSONB formatı:**
```json
[
  {
    "step": 1,
    "description": "Soğanları ince ince doğrayın",
    "duration_minutes": 5,
    "image_url": "https://..."
  }
]
```

**İndeksler:**
- `idx_recipe_translations_title_trgm` - Başlık araması
- `idx_recipe_translations_search` - Tam metin arama

#### `recipe_details`
Tarif detayları ve özellikleri.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Detay kimliği |
| recipe_id | UUID FK UNIQUE | Tarif referansı |
| nutritional_data | JSONB | Besin değerleri |
| attributes | JSONB | Tarif özellikleri |
| serving_size | VARCHAR(30) | Porsiyon bilgisi |
| estimated_cost | DECIMAL(10,2) | Tahmini maliyet |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

**nutritional_data JSONB formatı:**
```json
{
  "calories": 250,
  "protein": 15,
  "carbohydrates": 30,
  "fat": 10,
  "fiber": 5,
  "sugar": 8,
  "sodium": 300
}
```

**attributes JSONB formatı:**
```json
{
  "is_vegan": false,
  "is_vegetarian": true,
  "is_gluten_free": false,
  "is_dairy_free": false,
  "is_nut_free": true,
  "is_keto": false,
  "spice_level": 2
}
```

**İndeksler:**
- `idx_recipe_details_jsonb` - JSONB aramaları
- `idx_recipe_details_vegan` - Vegan tariflere hızlı erişim
- `idx_recipe_details_gluten_free` - Glutensiz tariflere hızlı erişim

#### `recipe_categories`
Tarif-kategori ilişkisi (many-to-many).

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| recipe_id | UUID FK | Tarif referansı |
| category_id | UUID FK | Kategori referansı |

**Primary Key:** (recipe_id, category_id)

#### `recipe_ingredients`
Tarif malzemeleri.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Kayıt kimliği |
| recipe_id | UUID FK | Tarif referansı |
| ingredient_id | UUID FK | Malzeme referansı |
| quantity | DECIMAL(10,2) | Miktar |
| unit | VARCHAR(30) | Ölçü birimi |
| is_required | BOOLEAN | Zorunlu mu? |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

**İndeksler:**
- `idx_recipe_ingredients_ingredient` - Malzeme bazlı arama
- `idx_recipe_ingredients_recipe` - Tarif malzemeleri

#### `recipe_media`
Tarif görselleri ve videoları.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Medya kimliği |
| recipe_id | UUID FK | Tarif referansı |
| media_type | VARCHAR(10) | photo/video |
| url | VARCHAR(255) | Medya URL'i |
| is_primary | BOOLEAN | Ana görsel mi? |
| display_order | INTEGER | Görüntüleme sırası |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

### 8. Kullanıcı Etkileşim Tabloları

#### `user_ingredients`
Kullanıcının evindeki malzemeler.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Kayıt kimliği |
| user_id | UUID FK | Kullanıcı referansı |
| ingredient_id | UUID FK | Malzeme referansı |
| quantity | DECIMAL(10,2) | Miktar |
| unit | VARCHAR(30) | Ölçü birimi |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

#### `favorite_recipes`
Favori tarifler.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| user_id | UUID FK | Kullanıcı referansı |
| recipe_id | UUID FK | Tarif referansı |
| created_at | TIMESTAMP | Favoriye eklenme zamanı |

**Primary Key:** (user_id, recipe_id)

#### `recipe_ratings`
Tarif değerlendirmeleri.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Değerlendirme kimliği |
| user_id | UUID FK | Kullanıcı referansı |
| recipe_id | UUID FK | Tarif referansı |
| rating | SMALLINT (1-5) | Puan |
| review_text | TEXT | Yorum |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

#### `recipe_collections`
Kullanıcı tarif koleksiyonları.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Koleksiyon kimliği |
| user_id | UUID FK | Kullanıcı referansı |
| name | VARCHAR(100) | Koleksiyon adı |
| description | TEXT | Açıklama |
| is_public | BOOLEAN | Herkese açık mı? |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

#### `collection_recipes`
Koleksiyon-tarif ilişkisi.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Kayıt kimliği |
| collection_id | UUID FK | Koleksiyon referansı |
| recipe_id | UUID FK | Tarif referansı |
| added_at | TIMESTAMP | Eklenme zamanı |
| updated_at | TIMESTAMP | Son güncelleme |

### 9. Ek Özellik Tabloları

#### `calorie_entries`
Kalori takibi.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Giriş kimliği |
| user_id | UUID FK | Kullanıcı referansı |
| recipe_id | UUID FK | Tarif referansı (opsiyonel) |
| date | DATE | Tarih |
| meal_type | VARCHAR(20) | breakfast/lunch/dinner/snack |
| calories | INTEGER | Kalori miktarı |
| created_at | TIMESTAMP | Oluşturulma zamanı |

#### `user_activities`
Kullanıcı aktivite logu.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Aktivite kimliği |
| user_id | UUID FK | Kullanıcı referansı |
| activity_type | VARCHAR(50) | Aktivite tipi |
| recipe_id | UUID FK | İlgili tarif (opsiyonel) |
| metadata | JSONB | Ek bilgiler |
| created_at | TIMESTAMP | Aktivite zamanı |

**activity_type örnekleri:**
- `view_recipe` - Tarif görüntüleme
- `search` - Arama yapma
- `cook_recipe` - Tarif yapma
- `rate_recipe` - Değerlendirme
- `add_favorite` - Favoriye ekleme

#### `push_notifications`
Push bildirim kayıtları.

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | UUID PK | Bildirim kimliği |
| user_id | UUID FK | Kullanıcı referansı |
| title | VARCHAR(100) | Bildirim başlığı |
| body | TEXT | Bildirim içeriği |
| data | JSONB | Ek veriler |
| status | VARCHAR(20) | pending/sent/failed |
| sent_at | TIMESTAMP | Gönderim zamanı |
| created_at | TIMESTAMP | Oluşturulma zamanı |

## Fonksiyonlar

### 1. `update_modified_column()`
Tablolardaki `updated_at` alanını otomatik günceller.

**Kullanım:** Trigger ile otomatik çalışır.

### 2. `update_recipe_translation_search_vector()`
Tarif başlık ve açıklamalarından arama vektörü oluşturur.

**Kullanım:** Trigger ile otomatik çalışır.

### 3. `match_recipes_by_ingredients()`
Kullanıcının malzemelerine göre uygun tarifleri bulur.

**Parametreler:**
- `p_user_id` (UUID) - Kullanıcı kimliği
- `p_language_code` (VARCHAR) - Dil kodu (varsayılan: 'tr')
- `p_min_match_percent` (INTEGER) - Minimum eşleşme yüzdesi (varsayılan: 50)
- `p_max_missing_ingredients` (INTEGER) - Maksimum eksik malzeme (varsayılan: 5)
- `p_include_premium` (BOOLEAN) - Premium tarifleri dahil et (varsayılan: FALSE)

**Örnek Kullanım:**
```sql
SELECT * FROM mycheff.match_recipes_by_ingredients(
    'user-uuid-here',
    'tr',
    60,  -- En az %60 eşleşme
    3,   -- En fazla 3 eksik malzeme
    FALSE
);
```

### 4. `search_recipes()`
Gelişmiş tarif arama fonksiyonu.

**Parametreler:**
- `p_query` (TEXT) - Arama metni
- `p_user_id` (UUID) - Kullanıcı kimliği (premium kontrolü için)
- `p_language_code` (VARCHAR) - Dil kodu (varsayılan: 'tr')
- `p_attributes` (JSONB) - Özellik filtreleri
- `p_max_cooking_time` (INTEGER) - Maksimum pişirme süresi
- `p_categories` (UUID[]) - Kategori filtreleri
- `p_difficulty_level_max` (SMALLINT) - Maksimum zorluk seviyesi
- `p_include_premium` (BOOLEAN) - Premium tarifleri dahil et

**Örnek Kullanım:**
```sql
SELECT * FROM mycheff.search_recipes(
    'domates çorbası',
    'user-uuid-here',
    'tr',
    '{"is_vegan": true}'::jsonb,
    30,  -- Max 30 dakika
    ARRAY['breakfast-category-uuid'],
    3,   -- Max zorluk seviyesi
    FALSE
);
```

## View'lar

### 1. `active_premium_users`
Aktif premium aboneliği olan kullanıcıları gösterir.

**Kolonlar:**
- id - Kullanıcı kimliği
- username - Kullanıcı adı
- email - E-posta
- subscription_end_date - Abonelik bitiş tarihi
- plan_name - Plan adı

### 2. `popular_recipes` (Materialized View)
Popüler tariflerin önbelleğe alınmış listesi.

**Kolonlar:**
- id - Tarif kimliği
- title - Tarif başlığı
- language_code - Dil kodu
- is_premium - Premium tarif mi?
- is_featured - Öne çıkan mı?
- avg_rating - Ortalama puan
- rating_count - Değerlendirme sayısı
- favorite_count - Favori sayısı
- view_count - Görüntülenme sayısı
- primary_image_url - Ana görsel URL'i

**Yenileme:**
```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY mycheff.popular_recipes;
```

## Trigger'lar

Sistemde `updated_at` alanlarını otomatik güncelleyen 20 trigger bulunmaktadır. Ayrıca `recipe_translations` tablosunda arama vektörünü güncelleyen 1 trigger vardır.

## İndeksler

### Performans İndeksleri
- **GIN İndeksler**: Metin araması için (username, title, name alanları)
- **BTREE İndeksler**: Foreign key'ler ve sık kullanılan filtreler için
- **Partial İndeksler**: `WHERE` koşullu indeksler (is_active, is_premium vb.)
- **JSONB İndeksler**: attributes alanında hızlı arama için

### Önemli İndeksler
- Kullanıcı adı araması: `idx_users_username_gin`
- Tarif başlık araması: `idx_recipe_translations_title_trgm`
- Tam metin arama: `idx_recipe_translations_search`
- Vegan tarifler: `idx_recipe_details_vegan`
- Glutensiz tarifler: `idx_recipe_details_gluten_free`

## API İçin Örnek Sorgular

### 1. Kullanıcı Girişi
```sql
SELECT id, username, email, password_hash, preferred_language
FROM mycheff.users
WHERE email = $1 AND is_active = true;
```

### 2. Premium Durumu Kontrolü
```sql
SELECT EXISTS (
    SELECT 1 FROM mycheff.user_subscriptions
    WHERE user_id = $1
    AND end_date > CURRENT_TIMESTAMP
    AND payment_status = 'completed'
) as is_premium;
```

### 3. Kategorileri Listeleme (Dil Destekli)
```sql
SELECT c.id, c.icon, c.color, ct.name
FROM mycheff.categories c
JOIN mycheff.category_translations ct ON c.id = ct.category_id
WHERE ct.language_code = $1
AND c.is_active = true
ORDER BY c.sort_order;
```

### 4. Tarif Detayı Getirme
```sql
SELECT 
    r.*,
    rt.title,
    rt.description,
    rt.preparation_steps,
    rt.tips,
    rd.nutritional_data,
    rd.attributes,
    array_agg(DISTINCT ct.name) as categories,
    (
        SELECT json_agg(json_build_object(
            'id', ri.id,
            'ingredient_name', it.name,
            'quantity', ri.quantity,
            'unit', ri.unit,
            'is_required', ri.is_required
        ))
        FROM mycheff.recipe_ingredients ri
        JOIN mycheff.ingredient_translations it ON ri.ingredient_id = it.ingredient_id
        WHERE ri.recipe_id = r.id
        AND it.language_code = $2
    ) as ingredients
FROM mycheff.recipes r
JOIN mycheff.recipe_translations rt ON r.id = rt.recipe_id
LEFT JOIN mycheff.recipe_details rd ON r.id = rd.recipe_id
LEFT JOIN mycheff.recipe_categories rc ON r.id = rc.recipe_id
LEFT JOIN mycheff.category_translations ct ON rc.category_id = ct.category_id
WHERE r.id = $1
AND rt.language_code = $2
AND ct.language_code = $2
GROUP BY r.id, rt.title, rt.description, rt.preparation_steps, rt.tips, rd.nutritional_data, rd.attributes;
```

### 5. Kullanıcının Favori Tarifleri
```sql
SELECT 
    r.id,
    rt.title,
    r.cooking_time_minutes,
    r.difficulty_level,
    r.average_rating,
    rm.url as primary_image_url
FROM mycheff.favorite_recipes fr
JOIN mycheff.recipes r ON fr.recipe_id = r.id
JOIN mycheff.recipe_translations rt ON r.id = rt.recipe_id
LEFT JOIN mycheff.recipe_media rm ON r.id = rm.recipe_id AND rm.is_primary = true
WHERE fr.user_id = $1
AND rt.language_code = $2
ORDER BY fr.created_at DESC;
```

## Bakım ve Optimizasyon

### Düzenli Bakım İşlemleri

1. **Materialized View Yenileme** (Günlük)
```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY mycheff.popular_recipes;
```

2. **VACUUM ve ANALYZE** (Haftalık)
```sql
VACUUM ANALYZE mycheff.recipes;
VACUUM ANALYZE mycheff.recipe_translations;
VACUUM ANALYZE mycheff.users;
VACUUM ANALYZE mycheff.recipe_ingredients;
```

3. **İndeks Bakımı** (Aylık)
```sql
REINDEX INDEX CONCURRENTLY mycheff.idx_recipe_translations_search;
REINDEX INDEX CONCURRENTLY mycheff.idx_recipe_translations_title_trgm;
```

### Performans İzleme

1. **Yavaş Sorgu Logları**
```sql
-- postgresql.conf
log_min_duration_statement = 1000  -- 1 saniyeden uzun sorgular
```

2. **İndeks Kullanım İstatistikleri**
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'mycheff'
ORDER BY idx_scan;
```

## Güvenlik Notları

1. **Row Level Security (RLS)**: Kullanıcılar sadece kendi verilerini görebilmeli
2. **SQL Injection**: Tüm sorgularda parametre binding kullanılmalı
3. **Hassas Veriler**: `password_hash` asla client'a gönderilmemeli
4. **API Rate Limiting**: Arama ve eşleştirme fonksiyonları için rate limit uygulanmalı

## Gelecek Geliştirmeler

1. **Partitioning**: `user_activities` ve `calorie_entries` tabloları tarih bazlı partition'lanabilir
2. **Full Text Search**: Malzeme araması için de FTS eklenebilir
3. **Caching**: Redis entegrasyonu ile sık kullanılan sorgular cache'lenebilir
4. **Event Sourcing**: Tarif değişiklik geçmişi için event log tablosu

## Versiyon Bilgisi

- **Versiyon**: 1.0 Final
- **PostgreSQL**: 12+ gerekli
- **Extensions**: uuid-ossp, pg_trgm