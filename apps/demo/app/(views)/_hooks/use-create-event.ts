'use client';

import type { Event, EventFormValues } from '@repo/ui/event-form';
import { useCallback } from 'react';
import { postEvent } from '../_utils/events-api';
import { useSaveEvent } from './use-save-event';

/**
 * Returns `createEvent(values)`, which gives the values a new id, adds the
 * Event to the cache at once and stores it on the server. Returns the new Event.
 */
export function useCreateEvent(): (values: EventFormValues) => Event {
  const mutate = useSaveEvent(postEvent);
  return useCallback(
    (values) => {
      const event: Event = { ...values, id: crypto.randomUUID() };
      mutate(event);
      return event;
    },
    [mutate],
  );
}
