# Namaz Vakti Provider Kararı

Kodda `PrayerTimesProvider` interface'i hazırdır. Varsayılan hedef provider Aladhan API'dir; hata durumunda seed provider kullanılır.

## Seçilen Yol

Birincil hedef sağlayıcı: **Aladhan API**.

Gerekçe:

- API key, başvuru veya proxy zorunluluğu yoktur.
- HTTPS/JSON ile mobil uygulamadan doğrudan okunabilir.
- Calculation method listesinde `Diyanet İşleri Başkanlığı, Turkey` yöntemi bulunur.
- Mevcut offline-first mimariyle birlikte hata durumunda seed/cache fallback korunur.

Referans:

- https://aladhan.com/prayer-times-api
- https://aladhan.com/calculation-methods

## Fallback

- API hatasında son başarılı cache kullanılmalıdır.
- İlk açılışta internet yoksa seed içerik ve seed vakitler gösterilir.

## Kod Noktaları

- `packages/shared/src/types/prayer.ts`
- `apps/mobile/src/services/prayerTimes/provider.ts`
- `apps/mobile/src/services/prayerTimes/aladhanProvider.ts`
- `packages/shared/src/constants/prayerCities.ts`

## Env

- `EXPO_PUBLIC_PRAYER_PROVIDER=aladhan`
- `EXPO_PUBLIC_ALADHAN_BASE_URL=https://api.aladhan.com/v1`
- `EXPO_PUBLIC_ALADHAN_METHOD=13`
