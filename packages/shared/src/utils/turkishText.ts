const TURKISH_LOCALE = "tr-TR";

const MOJIBAKE_PATTERNS = [
  "Ý",
  "ý",
  "þ",
  "Þ",
  "ð",
  "Ð",
  "Ä±",
  "Ä°",
  "Ã§",
  "Ã‡",
  "Ã¼",
  "Ãœ",
  "Ã¶",
  "Ã–",
  "ÅŸ",
  "Åž",
  "ÄŸ",
  "Äž",
  "Ã»",
  "Ã¢",
  "Ã®",
  "SÃ¼kÃ»t"
] as const;

const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
  û: "u",
  Û: "u",
  â: "a",
  Â: "a",
  î: "i",
  Î: "i"
};

export interface MojibakeResult {
  hasMojibake: boolean;
  matches: string[];
}

export function toTurkishLower(value: string): string {
  return value.toLocaleLowerCase(TURKISH_LOCALE);
}

export const safeTurkishLower = toTurkishLower;

export function toTurkishUpper(value: string): string {
  return value.toLocaleUpperCase(TURKISH_LOCALE);
}

export const safeTurkishUpper = toTurkishUpper;

export function normalizeForTurkishSearch(value: string): string {
  return toTurkishLower(value)
    .normalize("NFKD")
    .replace(/[çÇğĞıIİöÖşŞüÜûÛâÂîÎ]/g, (char) => TURKISH_CHAR_MAP[char] ?? char)
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const normalizeTurkishSearch = normalizeForTurkishSearch;

export function includesTurkishSearch(source: string, query: string): boolean {
  const normalizedQuery = normalizeForTurkishSearch(query);

  if (!normalizedQuery) {
    return true;
  }

  return normalizeForTurkishSearch(source).includes(normalizedQuery);
}

export function detectMojibake(value: string): MojibakeResult {
  const matches = MOJIBAKE_PATTERNS.filter((pattern) => value.includes(pattern));

  return {
    hasMojibake: matches.length > 0,
    matches
  };
}

export function containsMojibake(value: string): boolean {
  return detectMojibake(value).hasMojibake;
}

export function validateTurkishText(value: string): MojibakeResult {
  return detectMojibake(value);
}

export function collectMojibakeWarnings(fields: Record<string, unknown>): Record<string, string[]> {
  return Object.entries(fields).reduce<Record<string, string[]>>((warnings, [key, value]) => {
    if (typeof value !== "string") {
      return warnings;
    }

    const result = detectMojibake(value);
    if (result.hasMojibake) {
      warnings[key] = result.matches;
    }

    return warnings;
  }, {});
}

export function createTurkishSlug(value: string): string {
  return normalizeForTurkishSearch(value).replace(/\s+/g, "-");
}
