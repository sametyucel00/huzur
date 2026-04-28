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
- Kıble yönü seçili şehir koordinatından yaklaşık hesaplanır.
- Tema tercihi `system/light/dark` olarak lokal profilden uygulanır.
- Bildirim tercihleri lokal profilde toggle olarak tutulur.
- SQLite içinde `content_cache` tablosu hazırdır.

## Sükût Ayrıcalık Satın Alma Altyapısı

- Satın alma katmanı `src/services/purchases` altında soyut provider mimarisiyle hazırdır.
- Varsayılan sağlayıcı `EXPO_PUBLIC_PURCHASE_PROVIDER=mock` olarak çalışır.
- `store` sağlayıcısı ürün kimliklerini ve teklif kartlarını hazır tutar, ancak native IAP modülü Android build uyumluluğu nedeniyle şu anda devre dışıdır.
- Ürün id alanları `EXPO_PUBLIC_SUKUT_PRIVILEGE_MONTHLY_PRODUCT_ID` ve `EXPO_PUBLIC_SUKUT_PRIVILEGE_YEARLY_PRODUCT_ID` olarak tanımlıdır.
- Canlı Apple/Google satın alma açılmadan önce Expo SDK ile uyumlu bir native IAP modülü seçilip tekrar etkinleştirilmelidir.
- Direkt mağaza satın alımı Expo Go ve web üzerinde çalışmaz; doğrulama için development/preview build ve sandbox/test kullanıcıları gerekir.
- Premium durum `src/stores/subscriptionStore.ts` içinde lokal saklanır; mobil kullanıcı ibadet verisi Firebase'e gönderilmez.
- Development modda Ayarlar ekranında mock Ayrıcalık aç/kapat kontrolü görünür; production modda gösterilmez.
