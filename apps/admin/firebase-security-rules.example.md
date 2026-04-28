# Firebase Security Rules Taslağı

Bu dosya canlıya otomatik uygulanmaz. Firebase Console üzerinden proje yapısına göre gözden geçirilip manuel uygulanmalıdır.

## Firestore

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/adminUsers/$(request.auth.token.email));
    }

    function isActiveContent() {
      return resource.data.isActive == true;
    }

    match /adminUsers/{email} {
      allow read: if isSignedIn() && request.auth.token.email == email;
      allow write: if false;
    }

    match /{collection}/{document} {
      allow read: if collection in [
        'duas',
        'zikrs',
        'dailyContents',
        'moodContents',
        'events',
        'badges',
        'categories',
        'sources',
        'planTemplates',
        'notificationTemplates',
        'appConfig'
      ] && (isActiveContent() || isAdmin());

      allow create, update: if isAdmin();
      allow delete: if false;
    }
  }
}
```

## Storage

```js
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && firestore.exists(/databases/(default)/documents/adminUsers/$(request.auth.token.email));
    }

    match /{folder}/{fileName} {
      allow read: if true;
      allow write: if isAdmin()
        && request.resource.size < 8 * 1024 * 1024
        && (request.resource.contentType.matches('image/.*') || request.resource.contentType.matches('audio/.*'));
      allow delete: if false;
    }
  }
}
```

## Not

`adminUsers` koleksiyonu manuel oluşturulmalı ve doküman ID'si admin e-posta adresi olmalıdır. Custom claims tercih edilirse `isAdmin()` fonksiyonu custom claim kontrolüne göre güncellenebilir.
