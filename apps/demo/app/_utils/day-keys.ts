// Viewer-local calendar days as `YYYY-MM-DD` keys: how the URL and the date filter store days.

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

const pad = (n: number) => String(n).padStart(2, '0');

/** The viewer-local calendar day of `date` as `YYYY-MM-DD`. */
export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Whether `key` is a real `YYYY-MM-DD` day, e.g. not `2026-02-30`. */
export function isDayKey(key: string): boolean {
  return DAY_KEY.test(key) && toDayKey(startOfDay(key)) === key;
}

/** The viewer-local midnight starting the `key` day; the inverse of {@link toDayKey}. */
export function startOfDay(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year!, month! - 1, day);
}

/** The last instant of the `key` day: the next local midnight, so DST changes are covered, less 1 ms. */
export function endOfDay(key: string): Date {
  const dayAfter = startOfDay(key);
  dayAfter.setDate(dayAfter.getDate() + 1);
  return new Date(dayAfter.getTime() - 1);
}
