export interface QuranChapterSummary {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: "meccan" | "medinan" | string;
  total_verses: number;
  link?: string;
}

export interface QuranVerse {
  id: number;
  text: string;
  transliteration: string;
  translation: string;
}

export interface QuranChapter extends QuranChapterSummary {
  verses: QuranVerse[];
}

export interface QuranBookmark {
  chapterId: number;
  verseId: number;
  updatedAt: string;
}

export interface QuranProgressState {
  favoriteChapterIds: number[];
  favoriteVerses: QuranBookmark[];
  lastRead: QuranBookmark | null;
  updatedAt: string;
}
