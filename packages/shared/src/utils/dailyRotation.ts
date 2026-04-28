function startOfLocalYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export function getDayOfYearIndex(date = new Date()): number {
  const start = startOfLocalYear(date);
  const diff = date.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

export function getDailyRotatedItem<T>(items: T[], date = new Date()): T | undefined {
  if (items.length === 0) {
    return undefined;
  }

  return items[getDayOfYearIndex(date) % items.length];
}

export function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
