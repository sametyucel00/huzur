export const tr = {
  app: {
    name: "Sükût",
    privacySummary:
      "V1'de kullanıcı hesabı yoktur. Favoriler, hedefler, devam zinciri, zikir geçmişi ve ayarlar cihazda tutulur; Firebase'e ibadet verisi gönderilmez.",
    sourceDisclaimer:
      "Sükût fetva veren bir uygulama değildir. İçerikler manevi destek ve alışkanlık takibi için sunulur; kaynak alanları admin panelinden yönetilir."
  },
  navigation: {
    home: "Ana Sayfa",
    prayerTimes: "Vakitler",
    qibla: "Kıble",
    duas: "Dualar",
    quran: "Kur'an",
    zikr: "Zikir",
    moods: "Ruh Hali",
    goals: "Hedefler",
    badges: "Rozetler",
    settings: "Ayarlar"
  },
  home: {
    dailyPeace: "Günlük huzur",
    todayPrayerSummary: "Bugünkü vakit özeti",
    dailySuggestion: "Bugünün önerisi",
    streakTitle: "Devam zinciri",
    moodShortcut: "Bugün kalbin nasıl?"
  },
  actions: {
    save: "Kaydet",
    cancel: "Vazgeç",
    reset: "Sıfırla",
    favorite: "Favori",
    complete: "Tamamlandı",
    chooseCity: "Şehir seç"
  },
  states: {
    loading: "Yükleniyor",
    empty: "Henüz içerik yok",
    error: "Bir şey ters gitti. Eski içerikler gösteriliyor olabilir.",
    offlineSeed: "İnternet yoksa dahili başlangıç içerikleri kullanılabilir."
  },
  notifications: {
    permissionIntro:
      "Bildirimler, seçtiğin vakitleri ve nazik günlük hatırlatmaları kaçırmaman için kullanılır. İzin vermezsen uygulama yine çalışır."
  },
  settings: {
    noAccountV1: "V1'de üyelik aktif değildir. İleride isteğe bağlı hesap desteği eklenebilir.",
    dataReset: "Cihazdaki verileri sıfırla",
    sources: "Kaynaklar hakkında",
    privacy: "Gizlilik"
  }
} as const;
