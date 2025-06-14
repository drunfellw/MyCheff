# MyCheff Admin Panel - Static Version

Bu statik admin paneli MyCheff uygulaması için tasarlanmış, tam özellikli bir yönetim arayüzüdür.

## 🚀 Özellikler

- **Modern Tasarım**: Material-UI ile profesyonel arayüz
- **Responsive**: Mobil, tablet ve masaüstü desteği
- **Tam Fonksiyonel**: Tüm CRUD işlemleri için hazır arayüzler
- **Static**: Herhangi bir web sunucusunda çalışır
- **Hızlı**: Ayrı servis gerektirmez

## 📁 Sayfa Yapısı

### 🏠 Dashboard (`/dashboard/`)
- Genel istatistikler ve özetler
- Son eklenen tarifler
- Popüler kategoriler
- Hızlı erişim butonları

### 🍽️ Recipes (`/recipes/`)
- Tarif listesi ve arama
- Tarif ekleme/düzenleme modal'ı
- Zorluk seviyesi, süre, portion bilgileri
- Rating ve görüntülenme sayıları

### 📂 Categories (`/categories/`)
- Kategori yönetimi
- Renk kodlu kategoriler
- Tarif sayıları
- Aktif/pasif durumları

### 🥕 Ingredients (`/ingredients/`)
- Malzeme listesi
- Beslenme bilgileri
- Kullanım sayıları
- Birim yönetimi

### 👥 Users (`/users/`)
- Kullanıcı listesi
- Premium hesap durumları
- Tarif sayıları
- Hesap durumları

### 🌍 Languages (`/languages/`)
- Dil yönetimi
- Çeviri ilerlemeleri
- İçerik sayıları
- Varsayılan dil ayarları

### 📊 Analytics (`/analytics/`)
- Detaylı istatistikler
- Kullanım metrikleri
- Son aktiviteler
- Sistem performansı

### ⚙️ Settings (`/settings/`)
- Sistem ayarları
- Güvenlik konfigürasyonları
- Bildirim ayarları
- Depolama yönetimi

## 🔐 Giriş Bilgileri

Demo için hazırlanmış giriş bilgileri:

- **Email**: `admin@mycheff.com`
- **Password**: `admin123`

## 🖥️ Kullanım

### Lokal Web Sunucusu ile

1. Bu klasörde basit bir HTTP sunucusu başlatın:

```bash
# Python 3 ile
python -m http.server 8000

# Node.js ile (serve paketi gerekli)
npx serve .

# PHP ile
php -S localhost:8000
```

2. Tarayıcınızda `http://localhost:8000` adresine gidin
3. Login sayfasında demo bilgileri ile giriş yapın

### Nginx ile

```nginx
server {
    listen 80;
    server_name admin.mycheff.com;
    root /path/to/admin-static;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
}
```

### Apache ile

`.htaccess` dosyası:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]
```

## 🔄 API Entegrasyonu

Admin panel şu anda mock data kullanıyor. Gerçek API'yi entegre etmek için:

1. `admin-panel/src/lib/api.ts` dosyasını düzenleyin
2. Mock fonksiyonları gerçek API çağrıları ile değiştirin
3. Backend URL'ini konfigüre edin
4. Yeniden build edin: `npm run build`

## 🎨 Özelleştirme

### Tema Değişiklikleri
- `admin-panel/src/lib/theme.ts` dosyasını düzenleyin
- Renk paletini ve tipografiyi özelleştirin

### Yeni Sayfa Ekleme
1. `admin-panel/src/app/[sayfa-adi]/page.tsx` oluşturun
2. `AdminLayout.tsx`'teki menüye ekleyin
3. Yeniden build edin

## 📱 Responsive Tasarım

Admin panel tüm cihaz boyutlarında optimize edilmiştir:

- **Mobile**: < 600px
- **Tablet**: 600px - 1200px  
- **Desktop**: > 1200px

## 🔧 Teknolojiler

- **Framework**: Next.js 15 (Static Export)
- **UI Library**: Material-UI v5
- **Icons**: Material Icons
- **Language**: TypeScript
- **Styling**: Material-UI Theme System

## 📦 Build Detayları

```
Route (app)                              Size     First Load JS
├ ○ /                                    408 B           100 kB
├ ○ /analytics                           5.32 kB         166 kB
├ ○ /categories                          3.05 kB         182 kB
├ ○ /dashboard                           5.8 kB          167 kB
├ ○ /ingredients                         3.07 kB         182 kB
├ ○ /languages                           3.17 kB         182 kB
├ ○ /login                               2.2 kB          163 kB
├ ○ /recipes                             6.79 kB         187 kB
├ ○ /settings                            8.05 kB         184 kB
└ ○ /users                               3.28 kB         182 kB
```

Tüm sayfalar static olarak pre-rendered edilmiştir ve CDN friendly'dir.

## 🤝 Geliştirme

Admin panel geliştirmek için:

```bash
cd admin-panel
npm install
npm run dev
```

Değişikliklerinizi yaptıktan sonra:

```bash
npm run build
cp -r out/* ../admin-static/
```

## 📞 Destek

Herhangi bir sorun veya soru için geliştirme ekibi ile iletişime geçin. 