import { queryOptions } from '@tanstack/react-query';
import type { Event } from '@repo/ui/event-form';
import { loadEvents } from './load-events';

const WINDOW_DAYS = 30;

/**
 * The one query for every Event; its cache is the client's only Event store.
 * Fetched once and pinned: writes update the cache in place, so a refetch
 * (~15 MB) is never needed.
 */
export const eventsQueryOptions = queryOptions({
  queryKey: ['events'],
  queryFn: loadEvents,
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: 1,
});

/** Where the Timeline Window starts: the viewer-local midnight 29 days ago. */
function timelineWindowStart(): Date {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - (WINDOW_DAYS - 1),
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
