export function mapFirebaseError(error: unknown, fallback: string): string {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-posta veya şifre hatalı.";
    case "auth/too-many-requests":
      return "Çok fazla deneme yapıldı. Bir süre sonra tekrar dene.";
    case "auth/network-request-failed":
      return "Ağ bağlantısı kurulamadı. İnternet bağlantını kontrol et.";
    case "permission-denied":
    case "firestore/permission-denied":
    case "storage/unauthorized":
      return "Bu işlem için yetkin yok. Firebase kuralları ve admin yetkilerini kontrol et.";
    case "unavailable":
    case "firestore/unavailable":
      return "Firebase servisine şu an ulaşılamıyor. Daha sonra tekrar dene.";
    case "not-found":
    case "firestore/not-found":
      return "İstenen kayıt bulunamadı.";
    case "storage/quota-exceeded":
      return "Storage kotası dolmuş görünüyor.";
    case "storage/unauthenticated":
      return "Dosya yüklemek için admin oturumu gerekli.";
    default:
      return error instanceof Error ? error.message || fallback : fallback;
  }
}
