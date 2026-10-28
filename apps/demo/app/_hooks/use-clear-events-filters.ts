'use client';

import { eventsFilterParams } from '../_utils/events-view-params';
import { useEventsView } from './use-events-view';

const NO_FILTERS = Object.fromEntries(
  Object.keys(eventsFilterParams).map((key) => [key, null]),
);

/** Removes every filter param from the URL; sort, page size and hidden columns stay. */
export function useClearEventsFilters(): () => void {
  const [, setView] = useEventsView();
  return () => void setView(NO_FILTERS);
}
