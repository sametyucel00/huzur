# Sükût Secret ve Değişken Listesi

Bu dosya mobil Android/iOS buildleri ve admin panel deploy/build süreçleri için GitHub Actions'a girilecek secret ve variable değerlerini özetler.

Workflow dosyaları manuel tetiklemelidir; build, deploy veya submit otomatik çalışmaz.

## GitHub Secrets

GitHub repo ekranında `Settings > Secrets and variables > Actions > Secrets` bölümüne eklenir.

| Secret adı | Nereden alınır? | Ne için kullanılır? |
| --- | --- | --- |
| `EXPO_TOKEN` | Expo hesabı > Access Tokens | GitHub Actions içinden EAS build başlatmak için zorunludur. |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase Console > Project settings > Web app config > `apiKey` | Mobil uygulamanın aktif içerikleri okuyabilmesi için Firebase config parçası. |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console > Project settings > Web app config > `authDomain` | Firebase proje bağlantısı. |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console > Project settings > `projectId` | Firestore projesini tanımlar. |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console > Project settings > `storageBucket` | Storage medya yolları için kullanılır. |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console > Project settings > Web app config > `messagingSenderId` | Firebase app config parçası. |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase Console > Project settings > Web app config > `appId` | Firebase app config parçası. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console > Project settings > Web app config > `apiKey` | Admin panelin Firebase'e bağlanması için kullanılır. Genellikle mobil ile aynı Firebase web app config olabilir. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console > Project settings > Web app config > `authDomain` | Admin Firebase Auth bağlantısı. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console > Project settings > `projectId` | Admin Firestore projesi. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console > Project settings > `storageBucket` | Admin medya yükleme için Storage bucket. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console > Project settings > Web app config > `messagingSenderId` | Admin Firebase config parçası. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console > Project settings > Web app config > `appId` | Admin Firebase config parçası. |
| `NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS` | Sen belirleyeceksin | Admin paneline girebilecek e-postalar. Virgülle ayrılır: `admin@sukut.app,editor@sukut.app`. |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Console / Google Cloud IAM service account JSON | Admin panel Firebase Hosting deploy için gerekir. Sadece deploy workflow'u `deploy=true` seçilirse kullanılır. |
| `FIREBASE_PROJECT_ID` | Firebase Console > Project settings > `projectId` | Firebase Hosting deploy hedef projesi. |

Not: `EXPO_PUBLIC_*` değerleri uygulama paketine gömülür; klasik anlamda gizli anahtar gibi düşünülmemelidir. Yine de repo içine yazılmaması ve Actions secret/variable olarak tutulması daha düzenlidir.

## GitHub Variables

GitHub repo ekranında `Settings > Secrets and variables > Actions > Variables` bölümüne eklenir.

| Variable adı | Önerilen değer | Açıklama |
| --- | --- | --- |
| `EXPO_PUBLIC_CONTENT_ENV` | `production` | Mobil uygulamanın içerik ortamı. |
| `EXPO_PUBLIC_PRAYER_PROVIDER` | `aladhan` | Namaz vakti sağlayıcısı. |
| `EXPO_PUBLIC_ALADHAN_BASE_URL` | `https://api.aladhan.com/v1` | Aladhan API adresi. |
| `EXPO_PUBLIC_ALADHAN_METHOD` | `13` | Türkiye/Diyanet uyumlu hesaplama yöntemi. |
| `EXPO_PUBLIC_ALADHAN_SCHOOL` | `0` | Hanefi dışı varsayılan asr ayarı. |
| `EXPO_PUBLIC_PURCHASE_PROVIDER` | `mock` veya `store` | Canlı satın alma açılmadan `mock` kalmalı. Canlıda Apple StoreKit / Google Play Billing için `store`. |
| `EXPO_PUBLIC_SUKUT_PRIVILEGE_MONTHLY_PRODUCT_ID` | App Store Connect / Google Play Console product id | Aylık abonelik ürün id'si. Örnek: `sukut_privilege_monthly`. |
| `EXPO_PUBLIC_SUKUT_PRIVILEGE_YEARLY_PRODUCT_ID` | App Store Connect / Google Play Console product id | Yıllık abonelik ürün id'si. Örnek: `sukut_privilege_yearly`. |

## Lokal `.env` Karşılıkları

Mobil için dosya: `apps/mobile/.env`

```env
EXPO_PUBLIC_FIREBASE_API_KEY=<Firebase web app apiKey>
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=<Firebase authDomain>
EXPO_PUBLIC_FIREBASE_PROJECT_ID=<Firebase projectId>
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=<Firebase storageBucket>
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<Firebase messagingSenderId>
EXPO_PUBLIC_FIREBASE_APP_ID=<Firebase appId>
EXPO_PUBLIC_CONTENT_ENV=development
EXPO_PUBLIC_PRAYER_PROVIDER=aladhan
EXPO_PUBLIC_ALADHAN_BASE_URL=https://api.aladhan.com/v1
EXPO_PUBLIC_ALADHAN_METHOD=13
EXPO_PUBLIC_ALADHAN_SCHOOL=0
EXPO_PUBLIC_PURCHASE_PROVIDER=mock
EXPO_PUBLIC_SUKUT_PRIVILEGE_MONTHLY_PRODUCT_ID=<App Store / Play Store monthly product id>
EXPO_PUBLIC_SUKUT_PRIVILEGE_YEARLY_PRODUCT_ID=<App Store / Play Store yearly product id>
```

Admin için dosya: `apps/admin/.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=<Firebase web app apiKey>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<Firebase authDomain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<Firebase projectId>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<Firebase storageBucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<Firebase messagingSenderId>
NEXT_PUBLIC_FIREBASE_APP_ID=<Firebase appId>
NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS=<admin e-postaları, virgülle ayrılmış>
```

## EAS / Store Tarafında Hazırlanacaklar

Bu değerler doğrudan GitHub secret olmak zorunda değildir; EAS ve mağaza hesaplarında hazırlanır.

| Alan | Nerede hazırlanır? | Açıklama |
| --- | --- | --- |
| Android keystore | EAS Credentials | Production Android build imzalama için gerekir. EAS üzerinde yönetilmesi önerilir. |
| Apple Developer hesabı | Apple Developer + EAS Credentials | iOS cihaz/simulator dışı production build için gerekir. |
| iOS Distribution Certificate | EAS Credentials | App Store/TestFlight build için gerekir. |
| iOS Provisioning Profile | EAS Credentials | `com.sukut.app` bundle id ile uyumlu olmalı. |
| App Store Connect API Key | App Store Connect | Sadece ileride otomatik submit yapılacaksa gerekir. Mevcut workflow build alır, submit yapmaz. |
| Google Play service account json | Google Play Console | Sadece ileride otomatik submit yapılacaksa gerekir. Mevcut workflow build alır, submit yapmaz. |

## Direkt Apple / Google Satın Alma Notları

RevenueCat kullanılmaz. Mobil uygulama `expo-iap` üzerinden doğrudan Apple StoreKit ve Google Play Billing'e bağlanır.

App Store Connect tarafında ürünler:

| Alan | Değer |
| --- | --- |
| Bundle ID | `com.sukut.app` |
| Subscription group | `Sükût Ayrıcalık` |
| Monthly product id | `sukut_privilege_monthly` |
| Yearly product id | `sukut_privilege_yearly` |
| Monthly price | `99 TL` |
| Yearly price | `799 TL` |

Google Play Console tarafında ürünler:

| Alan | Değer |
| --- | --- |
| Package name | `com.sukut.app` |
| Monthly subscription id | `sukut_privilege_monthly` |
| Monthly base plan id | Öneri: `monthly` |
| Yearly subscription id | `sukut_privilege_yearly` |
| Yearly base plan id | Öneri: `yearly` |
| Monthly price | `99 TL` |
| Yearly price | `799 TL` |

Direkt mağaza satın alımları Expo Go ve web üzerinde çalışmaz. Gerçek doğrulama için development/preview build ve mağaza sandbox/test kullanıcıları gerekir.

## Manuel Build Akışı

1. Secret ve variable değerleri GitHub'a girilir.
2. Expo/EAS projesinde Android ve iOS credentials hazırlanır.
3. GitHub Actions ekranından `Android Build` veya `iOS Build` workflow'u manuel çalıştırılır.
4. Build profili olarak önce `preview`, mağaza öncesinde `production` seçilir.

Bu projede build alma kararı manuel olmalıdır; workflow dosyaları kendiliğinden çalışmaz.
