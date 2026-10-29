'use client';

import { Button } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { eventsQueryOptions } from '../_utils/events-query';

/**
 * Opens the form for a new Event. Disabled until the Events have loaded: an Event added to
 * the empty cache would be overwritten by the load. Reads only `isSuccess`, so it doesn't
 * re-render on data changes.
 */
export function NewEventButton() {
  const { isSuccess } = useQuery(eventsQueryOptions);
  return (
    <Button size="sm" disabled={!isSuccess}>
      New Event
    </Button>
  );
}
