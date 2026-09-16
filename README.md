# Etkinlik Yönetim Uygulaması

TRtek Yazılım bünyesinde gerçekleştirilen staj projesi kapsamında geliştirilmiş, kullanıcıların belirli zamanlarda gerçekleşecek etkinlikleri takip edebildiği bir web uygulaması.

Proje No: **PRJIC20240805**

## Özellikler

### Kullanıcı Arayüzü (Herkese Açık)
- **Etkinlik Listesi** — sadece aktif ve ileri tarihli etkinlikler, kayıt zamanına göre sıralı
- **Etkinlik Detay** — resim, HTML formatlı uzun açıklama, son 5 etkinlik
- **Takvim** — FullCalendar ile aylık görünüm

### Yönetim Paneli (Giriş Gerektirir)
- Kullanıcı Kayıt / Giriş / Profil (sıfırdan yazılmış kimlik doğrulama, hazır kütüphane kullanılmadı)
- Ana Sayfa — özet istatistikler
- Etkinlik Yönetimi — tüm etkinliklerin listesi
- Etkinlik Kayıt Formu — ekleme + düzenleme aynı form üzerinden, resim yükleme, HTML editör

## Kullanılan Teknolojiler

**Backend**
- .NET 8, ASP.NET Core Web API
- Entity Framework Core (Code First)
- SQL Server
- N-katmanlı mimari: Entity, DataAccess, Business, API
- AES ile geri döndürülebilir parola şifreleme

**Frontend**
- React 19 (Vite)
- React Router
- Bootstrap 5
- FullCalendar
- React Quill (HTML editör)
- Axios

## Proje Yapısı
EtkinlikYonetimi/
├── src/
│ ├── EtkinlikYonetimi.Entity/ → Entity katmanı
│ ├── EtkinlikYonetimi.DataAccess/ → DbContext, migration'lar
│ ├── EtkinlikYonetimi.Business/ → İş kuralları, servisler
│ └── EtkinlikYonetimi.API/ → Controller'lar, Web API
├── client/ → React frontend
└── EtkinlikYonetimi.sln


## Kurulum

### Gereksinimler
- .NET 8 SDK
- Node.js (v18+)
- SQL Server (LocalDB veya Express)

### Backend

```bash
cd src/EtkinlikYonetimi.API
dotnet restore
```

`appsettings.json` içindeki `ConnectionStrings:DefaultConnection` ve `EncryptionSettings:Key` alanlarını kendi ortamına göre düzenle (`EncryptionSettings:Key` tam 32 karakter olmalı).

Veritabanını oluştur:

```bash
dotnet ef database update --project ../EtkinlikYonetimi.DataAccess --startup-project .
```

Sunucuyu başlat:

```bash
dotnet run
```

API `http://localhost:5201` adresinde çalışacaktır.

### Frontend

```bash
cd client
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılacaktır.

## Veritabanı Şeması

Uygulama iki tablodan oluşur: `Users` ve `Events`. Aralarında bire-çok ilişki vardır (`Events.CreatedByUserId` → `Users.Id`).

## Notlar

- Yüklenen etkinlik görselleri `src/EtkinlikYonetimi.API/wwwroot/uploads/` klasöründe tutulur (depoya dahil edilmemiştir).
- Parolalar, formun gerekliliği doğrultusunda geri döndürülebilir AES şifreleme ile saklanır; tek yönlü hash kullanılmamıştır.