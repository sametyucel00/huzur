# Firebase Setup

Bu rehber build veya deploy çalıştırmaz; gerekli Firebase ayarlarını listeler.

## Project Config

Mobil `.env`:

```txt
apps/mobile/.env
```

Admin `.env.local`:

```txt
apps/admin/.env.local
```

Gerekli alanlar `.env.example` dosyalarında hazırdır.

## Auth

- Firebase Auth içinde e-posta/şifre sağlayıcısını aç.
- Admin e-postalarını `NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS` içine virgüllü liste olarak yaz.
- Production için önerilen yol admin kullanıcılarına custom claim vermektir.
- Detay: `docs/FIREBASE_ADMIN_CLAIMS.md`

## Firestore

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

Mobil kullanıcı ibadet verisi Firestore'a yazılmaz.

## Rules

`firestore.rules` ve `storage.rules` içinde `admin@example.com` placeholder'ı vardır. Yayın öncesi gerçek admin e-postası veya custom claim kullanılmalıdır.

## Storage

Admin panelde Storage yükleme iskeleti vardır. Görsel/ses URL'si üretir; bu URL ilgili içerik alanında kullanılabilir.
