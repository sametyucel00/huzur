export const MOOD_KEYS = [
  "stressed",
  "sad",
  "afraid",
  "undecided",
  "grateful",
  "seekingPeace",
  "focused"
] as const;

export const MOOD_LABELS_TR: Record<(typeof MOOD_KEYS)[number], string> = {
  stressed: "Stresliyim",
  sad: "Üzgünüm",
  afraid: "Korkuyorum",
  undecided: "Kararsızım",
  grateful: "Şükretmek istiyorum",
  seekingPeace: "Huzur arıyorum",
  focused: "Odaklanmak istiyorum"
};
