import type { Event } from '@repo/ui/event-form';

/** How many viewer-local days, today included, the Timeline Window spans. */
export const TIMELINE_WINDOW_DAYS = 30;

/** Where the Timeline Window starts: the viewer-local midnight 29 days ago. */
function timelineWindowStart(): Date {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - (TIMELINE_WINDOW_DAYS - 1),
  );
}

/** Whether `event` is in the Timeline Window; an Event can only fall outside it by being older. */
export function isInTimelineWindow(event: Event): boolean {
  return event.occurredAt.getTime() >= timelineWindowStart().getTime();
}

/**
 * The Timeline Window: Events from the start of the viewer-local day 29 days
 * ago onwards. Module-level so it stays a stable `select`; Query re-runs it
 * only when the cached array changes.
 */
export function selectTimelineWindow(events: Event[]): Event[] {
  const start = timelineWindowStart().getTime();
  return events.filter((event) => event.occurredAt.getTime() >= start);
}
