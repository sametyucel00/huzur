# Sükût Mobile

Expo Router tabanlı React Native uygulaması. V1 girişsiz çalışır ve kullanıcı ibadet verilerini cihazda tutar.

## Komutlar

```bash
npm run mobile
```

Android/iOS/web build otomatik alınmaz. Expo web uyumu mobil test amacıyla korunur.

## Önemli Dosyalar

- `src/theme/tokens.ts`: tasarım tokenları
- `src/components`: tekrar kullanılabilir UI bileşenleri
- `src/features`: V1 ekranları
- `src/storage`: AsyncStorage ve SQLite iskeleti
- `src/services/content`: Firebase içerik fetch abstraction
- `src/services/prayerTimes`: provider interface uyumlu namaz vakti abstraction
- `src/stores/localProfileStore.ts`: lokal profil ve tercihler
- `src/storage/localProgress.ts`: favoriler, hedefler, zikir sayacı ve rozet snapshot'ı
- `src/services/notifications/localNotifications.ts`: lokal bildirim izin ve planlama iskeleti
- `src/services/purchases`: Sükût Ayrıcalık satın alma sağlayıcıları

## Rotalar

- `/dua/[id]`
- `/zikr/[id]`
- `/daily/[id]`
- `/event/[id]`
- `/privacy`
- `/sources`
- `/paywall`
- `/weekly-reflection`

## Akışlar

- Firebase config yoksa seed içerik kullanılır.
- Aladhan provider varsayılan olarak Diyanet Türkiye yöntemiyle çalışır; hata olursa seed provider çalışır.
- Namaz vakitleri konum izni zorunlu tutmaz; manuel şehir seçimi vardır.
- Kıble yönü seçili şehir koordinatından yaklaşık hesaplanır; mobil cihazda pusula sensörü varsa canlı yönlendirme yapılır.
- Tema tercihi `system/light/dark` olarak lokal profilden uygulanır.
- Bildirim tercihleri lokal profilde toggle olarak tutulur ve lokal bildirimler cihazda planlanır.
- SQLite içinde `content_cache` tablosu hazırdır.

## Sükût Ayrıcalık Satın Alma

- Satın alma katmanı `src/services/purchases` altında soyut provider mimarisiyle çalışır.
- Geliştirme ortamında varsayılan sağlayıcı `EXPO_PUBLIC_PURCHASE_PROVIDER=mock` olur.
- Canlı mağaza satın alması için `EXPO_PUBLIC_PURCHASE_PROVIDER=store` kullanılmalıdır.
- `store` sağlayıcısı `expo-iap` üzerinden iOS StoreKit ve Android Google Play Billing API'lerini kullanır.
- Ürün id alanları:
  - `EXPO_PUBLIC_SUKUT_PRIVILEGE_MONTHLY_PRODUCT_ID=sukut_privilege_monthly`
  - `EXPO_PUBLIC_SUKUT_PRIVILEGE_YEARLY_PRODUCT_ID=sukut_privilege_yearly`
- iOS tarafında bu ürün id'leri App Store Connect abonelik ürünleriyle birebir aynı olmalıdır.
- Direkt mağaza satın alımı Expo Go ve web üzerinde çalışmaz; doğrulama için development/preview build ve sandbox/test kullanıcıları gerekir.
- Premium durum `src/stores/subscriptionStore.ts` içinde lokal saklanır; mobil kullanıcı ibadet verisi Firebase'e gönderilmez.
- Production güvenliği için App Store Server API ile sunucu tarafı makbuz doğrulaması önerilir. Mevcut V1 entegrasyonu cihaz üstünde StoreKit aktif abonelik kontrolü yapar.
- Development modda Ayarlar ekranında mock Ayrıcalık aç/kapat kontrolü görünür; production modda gösterilmez.
