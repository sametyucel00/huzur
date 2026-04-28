import { fallbackQuranChapterOne, fallbackQuranChapters, quranDataSource } from "./quranSeed";
import { readCachedChapter, readCachedChapters, writeCachedChapter, writeCachedChapters } from "./quranStorage";
import type { QuranChapter, QuranChapterSummary } from "./quranTypes";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Kur'an verisi alınamadı: ${response.status}`);
  }

  return (await response.json()) as T;
}

function normalizeChapterSummary(chapter: QuranChapterSummary): QuranChapterSummary {
  return {
    id: Number(chapter.id),
    name: String(chapter.name),
    transliteration: String(chapter.transliteration),
    translation: String(chapter.translation),
    type: chapter.type,
    total_verses: Number(chapter.total_verses),
    link: chapter.link
  };
}

function normalizeChapter(chapter: QuranChapter): QuranChapter {
  return {
    ...normalizeChapterSummary(chapter),
    verses: chapter.verses.map((verse) => ({
      id: Number(verse.id),
      text: String(verse.text),
      transliteration: String(verse.transliteration ?? ""),
      translation: String(verse.translation ?? "")
    }))
  };
}

export async function loadQuranChapters(): Promise<QuranChapterSummary[]> {
  const cached = await readCachedChapters();

  try {
    const remote = await fetchJson<QuranChapterSummary[]>(quranDataSource.chapterIndexUrl);
    const chapters = remote.map(normalizeChapterSummary);
    await writeCachedChapters(chapters);
    return chapters;
  } catch {
    return cached ?? fallbackQuranChapters;
  }
}

export async function loadQuranChapter(chapterId: number): Promise<QuranChapter> {
  const cached = await readCachedChapter(chapterId);

  try {
    const remote = await fetchJson<QuranChapter>(quranDataSource.chapterUrl(chapterId));
    const chapter = normalizeChapter(remote);
    await writeCachedChapter(chapter);
    return chapter;
  } catch {
    if (cached) {
      return cached;
    }

    if (chapterId === 1) {
      return fallbackQuranChapterOne;
    }

    throw new Error("Bu sure ilk kez açılmak için internet bağlantısı gerektiriyor.");
  }
}
