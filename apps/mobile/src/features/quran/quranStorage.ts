import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/storage/keys";
import type { QuranChapter, QuranChapterSummary, QuranProgressState } from "./quranTypes";

const defaultProgress: QuranProgressState = {
  favoriteChapterIds: [],
  favoriteVerses: [],
  lastRead: null,
  updatedAt: new Date().toISOString()
};

export async function readCachedChapters(): Promise<QuranChapterSummary[] | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.quranChapters);
    return raw ? (JSON.parse(raw) as QuranChapterSummary[]) : null;
  } catch {
    return null;
  }
}

export async function writeCachedChapters(chapters: QuranChapterSummary[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.quranChapters, JSON.stringify(chapters)).catch(() => undefined);
}

export async function readCachedChapter(chapterId: number): Promise<QuranChapter | null> {
  try {
    const raw = await AsyncStorage.getItem(`${STORAGE_KEYS.quranChapterPrefix}${chapterId}`);
    return raw ? (JSON.parse(raw) as QuranChapter) : null;
  } catch {
    return null;
  }
}

export async function writeCachedChapter(chapter: QuranChapter) {
  await AsyncStorage.setItem(`${STORAGE_KEYS.quranChapterPrefix}${chapter.id}`, JSON.stringify(chapter)).catch(() => undefined);
}

export async function readQuranProgress(): Promise<QuranProgressState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.quranProgress);

  if (!raw) {
    return defaultProgress;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<QuranProgressState>;
    return {
      ...defaultProgress,
      ...parsed,
      favoriteChapterIds: parsed.favoriteChapterIds ?? [],
      favoriteVerses: parsed.favoriteVerses ?? [],
      lastRead: parsed.lastRead ?? null,
      updatedAt: parsed.updatedAt ?? new Date().toISOString()
    };
  } catch {
    return defaultProgress;
  }
}

export async function writeQuranProgress(progress: QuranProgressState) {
  await AsyncStorage.setItem(
    STORAGE_KEYS.quranProgress,
    JSON.stringify({
      ...progress,
      updatedAt: new Date().toISOString()
    })
  ).catch(() => undefined);
}
