'use client';

import { Button } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { Ref } from 'react';
import { eventsQueryOptions } from '../_utils/events-query';

export interface NewEventButtonProps {
  onClick: () => void;
  /** Focus returns here after an Add, saved or cancelled. */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Opens the form for a new Event. Disabled until the Events have loaded: an Event added to
 * the empty cache would be overwritten by the load. Reads only `isSuccess`, so it doesn't
 * re-render on data changes.
 */
export function NewEventButton({ onClick, ref }: NewEventButtonProps) {
  const { isSuccess } = useQuery(eventsQueryOptions);
  return (
    <Button ref={ref} size="sm" disabled={!isSuccess} onClick={onClick}>
      New Event
    </Button>
  );
}
