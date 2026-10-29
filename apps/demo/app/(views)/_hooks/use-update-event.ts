'use client';

import type { Event } from '@repo/ui/event-form';
import { patchEvent } from '../_utils/events-api';
import { useSaveEvent } from './use-save-event';

/** Returns `updateEvent(event)`, which replaces the Event of the same id in the cache at once and on the server. */
export function useUpdateEvent(): (event: Event) => void {
  return useSaveEvent(patchEvent);
}
