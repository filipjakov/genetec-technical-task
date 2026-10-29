import { queryOptions } from '@tanstack/react-query';
import { loadEvents } from './events-api';

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
