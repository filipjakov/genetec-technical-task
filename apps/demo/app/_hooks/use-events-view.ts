'use client';

import { useQueryStates } from 'nuqs';
import { eventsViewParams } from '../_utils/events-view-params';

/**
 * The Events grid's view, read from and written to the URL. Each change replaces the
 * history entry, so Back leaves the page rather than undoing filters.
 */
export function useEventsView() {
  return useQueryStates(eventsViewParams, { history: 'replace' });
}
