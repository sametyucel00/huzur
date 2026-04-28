# Firebase Admin Claims

Production için önerilen yöntem admin kullanıcılarına custom claim vermektir.

## Önerilen Claim

```json
{
  "admin": true
}
```

## Rules ile Uyum

`firestore.rules` ve `storage.rules` şu kontrolleri destekler:

- `request.auth.token.admin == true`
- Geçici placeholder olarak `admin@example.com`

Yayın öncesinde `admin@example.com` gerçek e-posta ile değiştirilmeli veya tamamen custom claim'e geçilmelidir.

## Uygulama Notu

Custom claim verme işlemi Firebase Admin SDK ile güvenli bir backend veya yerel yönetici scripti üzerinden yapılmalıdır. Bu repo içinde canlı script çalıştırılmadı; servis hesabı bilgisi gerektirir.
