# Sükût Release Checklist

Bu dosya build çalıştırmaz; yayın öncesi kontrol listesidir.

## Gerekli Kararlar

- App adı `Sükût` olarak son kontrol edilecek
- Bundle ID / package name `com.sukut.app` olarak son kontrol edilecek
- Firebase project config
- Admin kullanıcı e-postaları veya custom claim yapısı
- Dini içerik kaynak listesi
- Namaz vakti provider saha doğrulaması
- App icon/logo son onayı
- Store açıklamaları ve ekran görüntüleri
- App Store Connect / Google Play abonelik ürünleri, premium açılırsa

## İlgili Dokümanlar

- `docs/FIREBASE_SETUP.md`
- `docs/CONTENT_SOURCES.md`
- `docs/PRAYER_PROVIDER_DECISION.md`
- `docs/BRAND_ASSETS.md`
- `docs/GITHUB_SECRETS.md`
- `docs/PRIVACY_POLICY_DRAFT.md`
- `docs/STORE_LISTING_DRAFT.md`
- `docs/FIREBASE_ADMIN_CLAIMS.md`
- `docs/FINAL_HANDOFF.md`

## Mobil Yayın Öncesi

- `.env` değerleri girilecek.
- `app.json` içindeki `com.sukut.app` değerleri son kez kontrol edilecek.
- Varsayılan `EXPO_PUBLIC_PRAYER_PROVIDER=aladhan` ve `EXPO_PUBLIC_ALADHAN_METHOD=13` değerleri kontrol edilecek.
- Kıble ekranı cihaz pusulası ile doğrulanacak.
- Privacy metni store politikasıyla eşleştirilecek.
- Türkçe karakterler cihazlarda görsel olarak kontrol edilecek.

## Admin Yayın Öncesi

- Firebase Auth provider açılacak.
- Firestore rules içindeki `admin@example.com` placeholder değiştirilecek veya custom claim kullanılacak.
- Storage upload alanları aktif edilecekse rules kapsamı tekrar kontrol edilecek.
- Firebase Hosting secrets GitHub Actions'a girilecek.

## Manuel Workflow Secrets

- `EXPO_TOKEN`
- `FIREBASE_SERVICE_ACCOUNT`
- `FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS`
