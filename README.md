# Sükût

Sükût, dini/spiritual wellness odaklı mobil öncelikli bir monorepo çalışmasıdır. V1'de mobil kullanıcı üyeliği yoktur; favoriler, hedefler, streak, zikir geçmişi ve ayarlar cihazda kalır. Firebase yalnızca admin panel, içerik yönetimi, Storage dosyaları, app config ve aktif içerik aktarımı için kullanılır.

## Proje Yapısı

```txt
apps/
  mobile/   Expo + React Native + TypeScript + Expo Router
  admin/    Next.js + TypeScript + Tailwind + Firebase
packages/
  shared/   Ortak tipler, şemalar, i18n, seed data ve yardımcılar
docs/       Yayın, Firebase, içerik ve operasyon dokümanları
```

## Durum

- Mobil V1 ekranları, detay rotaları, offline-first cache, lokal profil, lokal progress, tema, bildirim tercihleri ve kıble yaklaşımı hazır.
- Admin panel CRUD, relation seçimleri, Storage upload iskeleti, dashboard, auth gate, arama/filtre ve Zod validation hazır.
- Shared paket tipler, şemalar, i18n, seed içerik, Türkçe arama, mojibake validator, progress engine ve disclaimer sabitleri içerir.
- GitHub Actions dosyaları manuel `workflow_dispatch` ile hazırdır.
- Aladhan API için Diyanet Türkiye yöntemiyle provider adapter hazırdır; hata olursa seed provider'a düşer.
- Netlify için gizlilik, koşullar ve kaynaklar sayfası `netlify/` altında hazırdır.

## Komutlar

Bu komutlar yalnızca sen çalıştırmak istediğinde kullanılmalı:

```bash
npm install
npm run mobile
npm run admin
```

Build/test/lint komutları hazırdır, ancak otomatik çalıştırılmamıştır.

## Mobil

- Ana ekran, namaz vakitleri, kıble, dua, zikir, ruh hali, hedefler, rozetler ve ayarlar ekranları vardır.
- Dua, zikir, günlük içerik, özel gün, gizlilik ve kaynak detay rotaları eklidir.
- Kullanıcı verileri cihazda saklanır.
- Firebase config yoksa seed içerik kullanılır.
- Content sync önce `appConfig.contentVersion` okur; sürüm yeniyse içerik paketini çeker.
- SQLite `content_cache` tablosu ileride aktif içerik cache'i için hazırdır.

## Admin

- Dashboard Firestore'dan canlı sayı okumaya çalışır; veri yoksa seed içerik gösterir.
- CRUD listelerinde düzenleme, aktif/pasif, silme, arama ve filtre vardır.
- Enum alanları dropdown ile seçilir.
- İlişkili alanlar mevcut dua, zikir ve kategori kayıtlarından seçilir.
- JSON alanları doğrulanır; feature flag alanları toggle olarak düzenlenir.
- Storage upload paneli görsel/ses URL'si üretmek için hazırdır.

## Firebase

Koleksiyonlar:

- `duas`
- `zikrs`
- `dailyContents`
- `moodContents`
- `events`
- `badges`
- `categories`
- `appConfig`
- `notificationTemplates`

Rules içinde `admin@example.com` placeholder'ı vardır. Yayın öncesi gerçek admin e-postası veya custom claim kullanılmalıdır.

## Manuel Workflow

- `.github/workflows/android-build.yml`
- `.github/workflows/ios-build.yml`
- `.github/workflows/optional-admin-deploy.yml`

Bu workflow'lar otomatik build almaz; GitHub Actions ekranından manuel çalıştırılır.

## Operasyon Dokümanları

- [Firebase Setup](docs/FIREBASE_SETUP.md)
- [Dini İçerik Kaynakları](docs/CONTENT_SOURCES.md)
- [Namaz Vakti Provider Kararı](docs/PRAYER_PROVIDER_DECISION.md)
- [Marka ve Asset Hazırlığı](docs/BRAND_ASSETS.md)
- [GitHub Secrets](docs/GITHUB_SECRETS.md)
- [Gizlilik Politikası Taslağı](docs/PRIVACY_POLICY_DRAFT.md)
- [Store Listing Taslağı](docs/STORE_LISTING_DRAFT.md)
- [Firebase Admin Claims](docs/FIREBASE_ADMIN_CLAIMS.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)
- [Final Handoff](docs/FINAL_HANDOFF.md)

## Marka ve Kimlik

- App adı: `Sükût`
- Bundle ID/package name: `com.sukut.app`
- Namaz vakti sağlayıcısı: Aladhan API `method=13` Diyanet Türkiye yöntemi + seed/cache fallback
- Premium: feature flag ve `isPremium` alanı var; ödeme entegrasyonu yok
- Firebase: env değerleri proje ortamında girilmelidir
- App icon/logo/splash: Sükût gece-manzara/hilal diliyle başlangıç assetleri eklendi

## Benden Gerekli Bilgiler

- Admin kullanıcı e-postası veya custom claim kararı
- Firebase hosting/admin domain ve üretim güvenlik ayarları
- App icon/logo tercihi
- Store bilgileri
- RevenueCat bilgileri, ileride premium açılırsa
