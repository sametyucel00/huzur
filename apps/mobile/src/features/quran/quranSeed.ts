import type { QuranChapter, QuranChapterSummary } from "./quranTypes";

export const quranDataSource = {
  name: "quran-json",
  url: "https://github.com/risan/quran-json",
  chapterIndexUrl: "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/tr/index.json",
  chapterUrl: (chapterId: number) => `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/tr/${chapterId}.json`,
  note: "Arapça metin quranenc, Latin okunuş Tanzil.net, Türkçe meal Diyanet İşleri Başkanlığı kaynaklı quran-json dağıtımından alınır."
};

export const fallbackQuranChapters: QuranChapterSummary[] = [
  {
    id: 1,
    name: "الفاتحة",
    transliteration: "Al-Fatihah",
    translation: "Fâtiha",
    type: "meccan",
    total_verses: 7
  },
  {
    id: 112,
    name: "الإخلاص",
    transliteration: "Al-Ikhlas",
    translation: "İhlâs",
    type: "meccan",
    total_verses: 4
  },
  {
    id: 113,
    name: "الفلق",
    transliteration: "Al-Falaq",
    translation: "Felak",
    type: "meccan",
    total_verses: 5
  },
  {
    id: 114,
    name: "الناس",
    transliteration: "An-Nas",
    translation: "Nâs",
    type: "meccan",
    total_verses: 6
  }
];

export const fallbackQuranChapterOne: QuranChapter = {
  ...fallbackQuranChapters[0],
  verses: [
    {
      id: 1,
      text: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ",
      transliteration: "Bismillâhirrahmânirrahîm",
      translation: "Rahmân ve Rahîm olan Allah'ın adıyla."
    },
    {
      id: 2,
      text: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَم۪ينَ",
      transliteration: "Elhamdü lillâhi rabbi'l-âlemîn",
      translation: "Hamd, âlemlerin Rabbi Allah'a mahsustur."
    },
    {
      id: 3,
      text: "اَلرَّحْمٰنِ الرَّح۪يمِ",
      transliteration: "Errahmânirrahîm",
      translation: "O, Rahmân ve Rahîm'dir."
    },
    {
      id: 4,
      text: "مَالِكِ يَوْمِ الدّ۪ينِ",
      transliteration: "Mâliki yevmi'd-dîn",
      translation: "Din gününün sahibidir."
    },
    {
      id: 5,
      text: "اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَع۪ينُ",
      transliteration: "İyyâke na'budü ve iyyâke nesta'în",
      translation: "Ancak Sana kulluk eder ve yalnız Senden yardım dileriz."
    },
    {
      id: 6,
      text: "اِهْدِنَا الصِّرَاطَ الْمُسْتَق۪يمَ",
      transliteration: "İhdina's-sırâta'l-müstakîm",
      translation: "Bizi dosdoğru yola ilet."
    },
    {
      id: 7,
      text: "صِرَاطَ الَّذ۪ينَ اَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّٓالّ۪ينَ",
      transliteration: "Sırâtallezîne en'amte aleyhim ğayri'l-mağdûbi aleyhim ve le'd-dâllîn",
      translation: "Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapmışların yoluna değil."
    }
  ]
};
