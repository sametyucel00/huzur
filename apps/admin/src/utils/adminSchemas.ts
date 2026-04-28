import { FIRESTORE_COLLECTIONS, MOOD_LABELS_TR, MOOD_KEYS, TURKEY_PRAYER_CITIES } from "@sukut/shared";

export interface AdminSelectOption {
  label: string;
  value: string;
}

export interface AdminModuleField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "date" | "json" | "select" | "relation" | "relationMulti" | "featureFlags";
  required?: boolean;
  defaultValue?: unknown;
  options?: AdminSelectOption[];
  helperText?: string;
  relation?: {
    collectionName: string;
    labelKeys: string[];
    filter?: {
      key: string;
      value: string;
    };
  };
}

export interface AdminModuleConfig {
  title: string;
  description: string;
  collectionName: string;
  fields: AdminModuleField[];
}

const moodOptions = MOOD_KEYS.map((mood) => ({
  label: MOOD_LABELS_TR[mood],
  value: mood
}));

const categoryTypeOptions: AdminSelectOption[] = [
  { label: "Dua", value: "dua" },
  { label: "Zikir", value: "zikr" },
  { label: "Günlük", value: "daily" },
  { label: "Özel gün", value: "event" }
];

const eventTypeOptions: AdminSelectOption[] = [
  { label: "Cuma", value: "friday" },
  { label: "Kandil", value: "kandil" },
  { label: "Ramazan", value: "ramadan" },
  { label: "Bayram", value: "eid" }
];

const badgeConditionOptions: AdminSelectOption[] = [
  { label: "Devam günü", value: "streakDays" },
  { label: "İlk zikir", value: "firstZikr" },
  { label: "İlk favori", value: "firstFavorite" },
  { label: "Cuma rutini", value: "fridayRoutine" },
  { label: "Günlük hedef", value: "dailyGoals" }
];

const notificationTypeOptions: AdminSelectOption[] = [
  { label: "Günlük", value: "daily" },
  { label: "Namaz vakti", value: "prayer" },
  { label: "Özel gün", value: "event" },
  { label: "Devam zinciri", value: "streak" },
  { label: "Nazik hatırlatma", value: "gentleReminder" }
];

const sourceTypeOptions: AdminSelectOption[] = [
  { label: "Kur'an", value: "quran" },
  { label: "Hadis", value: "hadith" },
  { label: "TDV", value: "tdv" },
  { label: "Diyanet", value: "diyanet" },
  { label: "Kitap", value: "book" },
  { label: "Diğer", value: "other" }
];

const sourceLocaleOptions: AdminSelectOption[] = [
  { label: "Türkçe", value: "tr" },
  { label: "Arapça", value: "ar" },
  { label: "İngilizce", value: "en" }
];

const cityOptions = TURKEY_PRAYER_CITIES.map((city) => ({
  label: city.city,
  value: city.city
}));

const languageOptions: AdminSelectOption[] = [
  { label: "Türkçe", value: "tr" },
  { label: "İngilizce hazırlık", value: "en" }
];

export const adminModules: Record<string, AdminModuleConfig> = {
  duas: {
    title: "Dua yönetimi",
    description: "Arapça metin, Türkçe okunuş, anlam, kaynak ve ruh hali etiketleri.",
    collectionName: FIRESTORE_COLLECTIONS.duas,
    fields: [
      { key: "title", label: "Başlık", type: "text", required: true },
      { key: "arabicText", label: "Arapça metin", type: "textarea", required: true },
      { key: "transliterationTr", label: "Türkçe okunuş", type: "textarea", required: true },
      { key: "meaningTr", label: "Türkçe anlam", type: "textarea", required: true },
      {
        key: "categoryId",
        label: "Kategori",
        type: "relation",
        required: true,
        relation: {
          collectionName: FIRESTORE_COLLECTIONS.categories,
          labelKeys: ["name"],
          filter: { key: "type", value: "dua" }
        },
        helperText: "Dua kategorileri içinden seçilir."
      },
      { key: "moodTags", label: "Ruh hali etiketleri JSON", type: "json", defaultValue: [], helperText: "Örnek: [\"seekingPeace\", \"grateful\"]" },
      { key: "source", label: "Kaynak", type: "text", required: true },
      {
        key: "sourceReferenceIds",
        label: "Kaynak referansları",
        type: "relationMulti",
        defaultValue: [],
        relation: { collectionName: FIRESTORE_COLLECTIONS.sources, labelKeys: ["title", "citation"] },
        helperText: "Kaynaklar modülünden seçilir; Kaynak alanı uygulamada gösterilecek kısa metin olarak kalır."
      },
      { key: "isPremium", label: "Premium", type: "boolean", defaultValue: false },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true },
      { key: "order", label: "Sıra", type: "number", defaultValue: 0 }
    ]
  },
  zikrs: {
    title: "Zikir yönetimi",
    description: "Zikir metinleri ve önerilen hedef sayıları.",
    collectionName: FIRESTORE_COLLECTIONS.zikrs,
    fields: [
      { key: "title", label: "Başlık", type: "text", required: true },
      { key: "text", label: "Metin", type: "text", required: true },
      { key: "recommendedCount", label: "Önerilen sayı", type: "number", required: true, defaultValue: 33 },
      { key: "description", label: "Açıklama", type: "textarea", required: true },
      {
        key: "categoryId",
        label: "Kategori",
        type: "relation",
        required: true,
        relation: {
          collectionName: FIRESTORE_COLLECTIONS.categories,
          labelKeys: ["name"],
          filter: { key: "type", value: "zikr" }
        },
        helperText: "Zikir kategorileri içinden seçilir."
      },
      { key: "source", label: "Kaynak", type: "text", required: true, helperText: "Örnek: Âl-i İmrân Suresi 173. ayet veya Buhârî, Ezân, 155." },
      {
        key: "sourceReferenceIds",
        label: "Kaynak referansları",
        type: "relationMulti",
        defaultValue: [],
        relation: { collectionName: FIRESTORE_COLLECTIONS.sources, labelKeys: ["title", "citation"] }
      },
      { key: "isPremium", label: "Premium", type: "boolean", defaultValue: false },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true }
    ]
  },
  "daily-content": {
    title: "Günlük içerik",
    description: "Günün mesajı, dua/zikir önerisi ve kaynak bilgisi.",
    collectionName: FIRESTORE_COLLECTIONS.dailyContents,
    fields: [
      { key: "date", label: "Tarih", type: "date", required: true },
      { key: "title", label: "Başlık", type: "text", required: true },
      { key: "shortMessage", label: "Kısa mesaj", type: "textarea", required: true },
      {
        key: "duaId",
        label: "Dua",
        type: "relation",
        relation: { collectionName: FIRESTORE_COLLECTIONS.duas, labelKeys: ["title"] },
        helperText: "Günlük içerikte önerilecek dua."
      },
      {
        key: "zikrId",
        label: "Zikir",
        type: "relation",
        relation: { collectionName: FIRESTORE_COLLECTIONS.zikrs, labelKeys: ["title"] },
        helperText: "Günlük içerikte önerilecek zikir."
      },
      { key: "verseText", label: "Ayet/metin", type: "textarea" },
      { key: "source", label: "Kaynak", type: "text" },
      { key: "isPremium", label: "Premium", type: "boolean", defaultValue: false },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true }
    ]
  },
  moods: {
    title: "Ruh hali içerikleri",
    description: "Ruh haline göre dua, zikir ve kısa manevi açıklama.",
    collectionName: FIRESTORE_COLLECTIONS.moodContents,
    fields: [
      { key: "moodKey", label: "Ruh hali", type: "select", required: true, options: moodOptions },
      { key: "title", label: "Başlık", type: "text", required: true },
      { key: "description", label: "Açıklama", type: "textarea", required: true },
      {
        key: "duaIds",
        label: "Dua önerileri",
        type: "relationMulti",
        defaultValue: [],
        relation: { collectionName: FIRESTORE_COLLECTIONS.duas, labelKeys: ["title"] },
        helperText: "Birden fazla dua seçebilirsin."
      },
      {
        key: "zikrIds",
        label: "Zikir önerileri",
        type: "relationMulti",
        defaultValue: [],
        relation: { collectionName: FIRESTORE_COLLECTIONS.zikrs, labelKeys: ["title"] },
        helperText: "Birden fazla zikir seçebilirsin."
      },
      { key: "shortAdvice", label: "Kısa tavsiye", type: "textarea", required: true },
      { key: "source", label: "Kaynak", type: "text", required: true, helperText: "Bu ruh hali önerisinin dayandığı dua/zikir kaynakları." },
      { key: "isPremium", label: "Premium", type: "boolean", defaultValue: false },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true }
    ]
  },
  events: {
    title: "Özel gün içerikleri",
    description: "Cuma, Kandil, Ramazan ve Bayram modları.",
    collectionName: FIRESTORE_COLLECTIONS.events,
    fields: [
      { key: "eventType", label: "Etkinlik tipi", type: "select", required: true, options: eventTypeOptions },
      { key: "title", label: "Başlık", type: "text", required: true },
      { key: "description", label: "Açıklama", type: "textarea", required: true },
      { key: "startDate", label: "Başlangıç", type: "date", required: true },
      { key: "endDate", label: "Bitiş", type: "date", required: true },
      {
        key: "suggestedDuaIds",
        label: "Önerilen dualar",
        type: "relationMulti",
        defaultValue: [],
        relation: { collectionName: FIRESTORE_COLLECTIONS.duas, labelKeys: ["title"] }
      },
      {
        key: "suggestedZikrIds",
        label: "Önerilen zikirler",
        type: "relationMulti",
        defaultValue: [],
        relation: { collectionName: FIRESTORE_COLLECTIONS.zikrs, labelKeys: ["title"] }
      },
      { key: "notificationTitle", label: "Bildirim başlığı", type: "text", required: true },
      { key: "notificationBody", label: "Bildirim metni", type: "textarea", required: true },
      { key: "source", label: "Kaynak", type: "text", required: true, helperText: "Özel gün açıklaması için TDV/Diyanet kaynak notu." },
      { key: "isPremium", label: "Premium", type: "boolean", defaultValue: false },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true }
    ]
  },
  badges: {
    title: "Rozetler",
    description: "Sade ilerleme rozetleri.",
    collectionName: FIRESTORE_COLLECTIONS.badges,
    fields: [
      { key: "name", label: "Ad", type: "text", required: true },
      { key: "description", label: "Açıklama", type: "textarea", required: true },
      { key: "iconKey", label: "İkon key", type: "text", required: true, defaultValue: "spark" },
      { key: "conditionType", label: "Koşul tipi", type: "select", required: true, options: badgeConditionOptions },
      { key: "targetValue", label: "Hedef değer", type: "number", defaultValue: 1 },
      { key: "isPremium", label: "Premium", type: "boolean", defaultValue: false },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true }
    ]
  },
  categories: {
    title: "Kategoriler",
    description: "Dua, zikir ve içerik kategorileri.",
    collectionName: FIRESTORE_COLLECTIONS.categories,
    fields: [
      { key: "name", label: "Ad", type: "text", required: true },
      { key: "type", label: "Tip", type: "select", required: true, options: categoryTypeOptions },
      { key: "iconKey", label: "İkon key", type: "text", required: true, defaultValue: "leaf" },
      { key: "order", label: "Sıra", type: "number", defaultValue: 0 },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true }
    ]
  },
  sources: {
    title: "Kaynaklar",
    description: "Dua, zikir ve özel gün içeriklerinde tekrar kullanılacak ayet, hadis ve kurum kaynakları.",
    collectionName: FIRESTORE_COLLECTIONS.sources,
    fields: [
      { key: "title", label: "Kaynak adı", type: "text", required: true },
      { key: "type", label: "Kaynak tipi", type: "select", required: true, options: sourceTypeOptions, defaultValue: "quran" },
      { key: "citation", label: "Atıf / yer bilgisi", type: "text", required: true, helperText: "Örnek: Bakara Suresi 201. ayet veya Buhârî, Ezân, 155." },
      { key: "url", label: "URL", type: "text", helperText: "Varsa güvenilir kaynak bağlantısı." },
      { key: "note", label: "Editör notu", type: "textarea" },
      { key: "locale", label: "Dil", type: "select", options: sourceLocaleOptions, defaultValue: "tr" },
      { key: "order", label: "Sıra", type: "number", defaultValue: 0 },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true }
    ]
  },
  "app-config": {
    title: "App config",
    description: "Sürüm, bakım modu, varsayılan şehir ve feature flag alanları.",
    collectionName: FIRESTORE_COLLECTIONS.appConfig,
    fields: [
      { key: "id", label: "Belge ID", type: "text", defaultValue: "default" },
      { key: "minimumAppVersion", label: "Minimum app version", type: "text", defaultValue: "0.1.0" },
      { key: "contentVersion", label: "Content version", type: "number", defaultValue: 1 },
      { key: "maintenanceMode", label: "Bakım modu", type: "boolean", defaultValue: false },
      { key: "defaultLanguage", label: "Varsayılan dil", type: "select", defaultValue: "tr", options: languageOptions },
      { key: "defaultCity", label: "Varsayılan şehir", type: "select", defaultValue: "İstanbul", options: cityOptions },
      { key: "forceUpdateMessage", label: "Zorunlu güncelleme mesajı", type: "textarea", defaultValue: "Uygulamayı kullanmaya devam etmek için güncelleme yapman gerekiyor." },
      { key: "maintenanceMessage", label: "Bakım mesajı", type: "textarea", defaultValue: "Sükût kısa bir bakım molasında. Lütfen biraz sonra tekrar dene." },
      { key: "paywallEnabled", label: "Paywall aktif", type: "boolean", defaultValue: true },
      {
        key: "premiumPricing",
        label: "Premium fiyat metinleri JSON",
        type: "json",
        defaultValue: {
          monthlyLabel: "149 TL / ay",
          yearlyLabel: "799 TL / yıl",
          yearlyMonthlyEquivalentLabel: "Aylık yaklaşık 66 TL",
          highlightedPlan: "yearly"
        },
        helperText: "Fiyatlar uygulamada product metadata/remote config üzerinden gösterilecek şekilde saklanır."
      },
      {
        key: "featureFlags",
        label: "Feature flags JSON",
        type: "featureFlags",
        defaultValue: {
          premiumEnabled: true,
          paywallEnabled: true,
          weeklyReflectionEnabled: true,
          advancedDailyPlanEnabled: true,
          remoteContentEnabled: true,
          localNotificationsEnabled: true,
          optionalAuthPlaceholder: true,
          premiumThemesEnabled: false
        },
        helperText: "Premium V1'de kapalı tutulabilir; remoteContentEnabled mobil içerik çekimini yönetir."
      },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true }
    ]
  },
  notifications: {
    title: "Bildirim metinleri",
    description: "Lokal bildirimlerde kullanılacak içerik metinleri.",
    collectionName: FIRESTORE_COLLECTIONS.notificationTemplates,
    fields: [
      { key: "title", label: "Başlık", type: "text", required: true },
      { key: "body", label: "Metin", type: "textarea", required: true },
      { key: "type", label: "Tip", type: "select", options: notificationTypeOptions },
      { key: "scheduledDate", label: "Planlı tarih", type: "date" },
      { key: "isPremium", label: "Premium", type: "boolean", defaultValue: false },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true }
    ]
  },
  "plan-templates": {
    title: "Plan şablonları",
    description: "7/14/30 günlük huzur planları ve Plus programları.",
    collectionName: FIRESTORE_COLLECTIONS.planTemplates,
    fields: [
      { key: "title", label: "Başlık", type: "text", required: true },
      { key: "description", label: "Açıklama", type: "textarea", required: true },
      { key: "durationDays", label: "Süre", type: "number", required: true, defaultValue: 7, helperText: "7, 14 veya 30 gün olarak girilmeli." },
      { key: "taskTitles", label: "Görev başlıkları JSON", type: "json", defaultValue: ["Günlük içeriği oku", "33 zikir tamamla"] },
      {
        key: "suggestedDuaIds",
        label: "Önerilen dualar",
        type: "relationMulti",
        defaultValue: [],
        relation: { collectionName: FIRESTORE_COLLECTIONS.duas, labelKeys: ["title"] }
      },
      {
        key: "suggestedZikrIds",
        label: "Önerilen zikirler",
        type: "relationMulti",
        defaultValue: [],
        relation: { collectionName: FIRESTORE_COLLECTIONS.zikrs, labelKeys: ["title"] }
      },
      { key: "source", label: "Kaynak/not", type: "text" },
      { key: "isPremium", label: "Premium", type: "boolean", defaultValue: true },
      { key: "isActive", label: "Aktif", type: "boolean", defaultValue: true },
      { key: "order", label: "Sıra", type: "number", defaultValue: 0 }
    ]
  }
};
