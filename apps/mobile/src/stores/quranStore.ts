import { create } from "zustand";
import { loadQuranChapter, loadQuranChapters } from "@/features/quran/quranService";
import { readQuranProgress, writeQuranProgress } from "@/features/quran/quranStorage";
import type { QuranBookmark, QuranChapter, QuranChapterSummary, QuranProgressState } from "@/features/quran/quranTypes";

interface QuranState extends QuranProgressState {
  chapters: QuranChapterSummary[];
  chapterCache: Record<number, QuranChapter>;
  isLoading: boolean;
  errorMessage: string | null;
  hydrate: () => Promise<void>;
  loadChapters: () => Promise<void>;
  loadChapter: (chapterId: number) => Promise<QuranChapter | null>;
  toggleFavoriteChapter: (chapterId: number) => void;
  toggleFavoriteVerse: (bookmark: Omit<QuranBookmark, "updatedAt">) => void;
  setLastRead: (bookmark: Omit<QuranBookmark, "updatedAt">) => void;
  isFavoriteVerse: (chapterId: number, verseId: number) => boolean;
}

function persist(state: QuranState) {
  writeQuranProgress({
    favoriteChapterIds: state.favoriteChapterIds,
    favoriteVerses: state.favoriteVerses,
    lastRead: state.lastRead,
    updatedAt: new Date().toISOString()
  }).catch(() => undefined);
}

export const useQuranStore = create<QuranState>((set, get) => ({
  chapters: [],
  chapterCache: {},
  favoriteChapterIds: [],
  favoriteVerses: [],
  lastRead: null,
  updatedAt: new Date().toISOString(),
  isLoading: false,
  errorMessage: null,
  async hydrate() {
    try {
      const progress = await readQuranProgress();
      set({ ...progress, errorMessage: null });
    } catch {
      set({ errorMessage: "Okuma ilerlemen şu anda alınamadı; Kur'an bölümü güvenli modda açıldı." });
    }
    await get().loadChapters().catch(() => undefined);
  },
  async loadChapters() {
    set({ isLoading: true, errorMessage: null });
    try {
      const chapters = await loadQuranChapters();
      set({ chapters, isLoading: false });
    } catch (error) {
      set({ isLoading: false, errorMessage: error instanceof Error ? error.message : "Sure listesi yüklenemedi." });
    }
  },
  async loadChapter(chapterId) {
    const cached = get().chapterCache[chapterId];
    if (cached) {
      return cached;
    }

    set({ isLoading: true, errorMessage: null });
    try {
      const chapter = await loadQuranChapter(chapterId);
      set((state) => ({
        chapterCache: { ...state.chapterCache, [chapterId]: chapter },
        isLoading: false
      }));
      return chapter;
    } catch (error) {
      set({ isLoading: false, errorMessage: error instanceof Error ? error.message : "Sure yüklenemedi." });
      return null;
    }
  },
  toggleFavoriteChapter(chapterId) {
    set((state) => {
      const exists = state.favoriteChapterIds.includes(chapterId);
      const next = {
        ...state,
        favoriteChapterIds: exists ? state.favoriteChapterIds.filter((id) => id !== chapterId) : [...state.favoriteChapterIds, chapterId],
        updatedAt: new Date().toISOString()
      };
      persist(next);
      return next;
    });
  },
  toggleFavoriteVerse(bookmark) {
    set((state) => {
      const exists = state.favoriteVerses.some((item) => item.chapterId === bookmark.chapterId && item.verseId === bookmark.verseId);
      const next = {
        ...state,
        favoriteVerses: exists
          ? state.favoriteVerses.filter((item) => !(item.chapterId === bookmark.chapterId && item.verseId === bookmark.verseId))
          : [...state.favoriteVerses, { ...bookmark, updatedAt: new Date().toISOString() }],
        updatedAt: new Date().toISOString()
      };
      persist(next);
      return next;
    });
  },
  setLastRead(bookmark) {
    set((state) => {
      const next = {
        ...state,
        lastRead: { ...bookmark, updatedAt: new Date().toISOString() },
        updatedAt: new Date().toISOString()
      };
      persist(next);
      return next;
    });
  },
  isFavoriteVerse(chapterId, verseId) {
    return get().favoriteVerses.some((item) => item.chapterId === chapterId && item.verseId === verseId);
  }
}));
