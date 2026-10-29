// Private to @repo/ui (not in the package `exports`). All dates are read in the viewer's
// locale and time zone; formatters are created once, since `Intl` constructors are costly
// at 100k rows.
import { CalendarDateTime, getLocalTimeZone } from '@internationalized/date';

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const timeFormat = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' });

const dayFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const relativeDayFormat = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
});

const pad = (n: number) => String(n).padStart(2, '0');

/** The viewer-local calendar day of `date` as `YYYY-MM-DD`; equal keys mean the same Day Group. */
export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Whether `date` is later than `now`. */
export function isFutureDate(date: Date, now: Date = new Date()): boolean {
  return date.getTime() > now.getTime();
}

/** Date and time, e.g. `3 Mar 2026, 14:05`. */
export function formatDateTime(date: Date): string {
  return dateTimeFormat.format(date);
}

/** Time of day, e.g. `14:05`. */
export function formatTime(date: Date): string {
  return timeFormat.format(date);
}

/** A day heading: `Today`, `Yesterday`, else the weekday and date, e.g. `Tuesday 3 March`. */
export function formatDayLabel(date: Date, now: Date = new Date()): string {
  const key = toDayKey(date);
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  const offset =
    key === toDayKey(now) ? 0 : key === toDayKey(yesterday) ? -1 : undefined;
  if (offset === undefined) return dayFormat.format(date);
  const label = relativeDayFormat.format(offset, 'day');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** `date` as the minute-precision local date-time the Event Form edits; seconds are dropped. */
export function toFormDateTime(date: Date): CalendarDateTime {
  return new CalendarDateTime(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  );
}

/** The instant a form date-time names in the viewer's time zone. */
export function fromFormDateTime(value: CalendarDateTime): Date {
  return value.toDate(getLocalTimeZone());
}
