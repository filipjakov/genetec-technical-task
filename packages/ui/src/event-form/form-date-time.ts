import { CalendarDateTime, getLocalTimeZone } from '@internationalized/date';

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
