# Sükût Admin

Next.js + Tailwind CSS + Firebase Auth/Firestore/Storage tabanlı içerik yönetim paneli. Bu uygulama landing page değildir; yalnızca Sükût mobil uygulamasının dini içerik, kategori, rozet, bildirim ve app config yönetimi için kullanılır.

## Lokal Çalıştırma

```bash
npm run admin
```

Next.js dev server `@next/swc-*` bağımlılığını eksik görürse önce bağımlılıkları kökten tekrar kurmak gerekir:

```bash
npm install
```

Bu işlem production build veya deploy değildir; yalnızca lokal `node_modules` ve lockfile eşleşmesini onarır.

Production build, deploy, Firebase deploy veya GitHub Actions bu projede manuel onay olmadan çalıştırılmamalıdır.

## Environment

`apps/admin/.env.example` dosyasını temel alarak `apps/admin/.env.local` oluştur:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS=
```

`NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS` virgülle ayrılmış admin e-posta listesidir. Bu kontrol istemci tarafında kullanıcı deneyimini iyileştirir; asıl güvenlik Firestore ve Storage rules ile sağlanmalıdır.

## Modüller

- Dashboard
- Dualar
- Zikirler
- Günlük içerik
- Ruh hali içerikleri
- Özel gün içerikleri
- Plan şablonları
- Rozetler
- Kategoriler
- Kaynaklar
- App config
- Bildirim metinleri

## Firebase Yapısı

Beklenen koleksiyonlar:

- `duas`
- `zikrs`
- `dailyContents`
- `moodContents`
- `events`
- `badges`
- `categories`
- `sources`
- `notificationTemplates`
- `planTemplates`
- `appConfig`
- `adminUsers`

`adminUsers` koleksiyonu admin yetkisi için önerilen güvenlik katmanıdır. Doküman ID'si admin e-postası olmalıdır. Canlı custom claims kurulumu gerekiyorsa Firebase Admin SDK ile ayrı bir güvenli ortamda yapılmalıdır.

## Güvenlik Kuralları

Örnek Firestore ve Storage kuralları için:

```text
apps/admin/firebase-security-rules.example.md
```

Kurallar canlıya otomatik uygulanmaz. Firebase Console veya kontrollü deploy süreciyle manuel uygulanmalıdır.

## İçerik Validasyonu

Admin panel:

- Kayıt öncesi shared Zod şemalarıyla temel alan doğrulaması yapar.
- Türkçe karakter ve mojibake kontrolü yapar.
- `ç, ğ, ı, İ, ö, ş, ü, û, â, î` karakterlerini UTF-8 olarak korur.
- `Ý, þ, ð, Ä±, Ã§, Ã¼, Ã¶, ÅŸ, ÄŸ, SÃ¼kÃ»t` gibi bozulmuş metinleri uyarı olarak yakalar.
- Negatif sayı, hatalı tarih sırası ve kritik app config hatalarını engeller.

## CRUD Davranışı

- Kayıtlar `createdAt` ve `updatedAt` alanlarıyla yazılır.
- Silme butonu hard delete yapmaz; kayıtları arşivleyip `isActive: false` durumuna alır.
- Aktif/pasif filtresi ve Türkçe uyumlu arama vardır.
- Listeleme ilk 100 kayıtla sınırlandırılmıştır; büyük veri setlerinde pagination genişletilebilir.

## Storage

Storage paneli görsel ve ses dosyaları için hazırlanmıştır.

- Sadece `image/*` ve `audio/*` kabul edilir.
- Maksimum dosya boyutu 8 MB'dir.
- Dosya yolu modül klasörüne göre oluşturulur.
- Dosya silme işlemi panelden yapılmaz.

## Mobil Uygulama Güvenliği

Mobil kullanıcı verileri Firebase'e yazılmamalıdır. Firebase yalnızca aktif içerikler, rozet tanımları, bildirim metinleri ve app config aktarımı için kullanılmalıdır.

## Sükût Plus ve Habit Yönetimi

- Dua, zikir, günlük içerik, ruh hali, özel gün, rozet ve bildirim kayıtlarında `isPremium` alanı yönetilebilir.
- `Plan şablonları` modülü 7/14/30 günlük huzur programları için hazırlanmıştır.
- `App config` içinde `paywallEnabled`, `premiumPricing` ve premium feature flag alanları vardır.
- Canlı ödeme, RevenueCat ürün ID'leri ve store metadata bilgisi panelden otomatik aktive edilmez; bu bilgiler ayrı onayla girilmelidir.
