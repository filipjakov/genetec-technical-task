'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Event } from '@repo/ui/event-form';
import { toaster } from '../../_components/toaster';
import { eventsQueryOptions } from '../_utils/events-query';

const { queryKey } = eventsQueryOptions;

/** `events` with the Event of `id` replaced by `next`, or removed when `next` is undefined. */
function replaceById(
  events: Event[],
  id: string,
  next: Event | undefined,
): Event[] {
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) return next ? [...events, next] : events;
  return next ? events.with(index, next) : events.toSpliced(index, 1);
}

/**
 * Optimistic save through the cache. Only the saved Event is snapshotted and
 * rolled back, so overlapping saves of different Events stay safe. On success
 * the server's copy is written back by id; no invalidation, as a refetch would
 * re-download every Event. Returns the mutation's `mutate`.
 */
export function useSaveEvent(save: (event: Event) => Promise<Event>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: save,
    onMutate: async (event: Event) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient
        .getQueryData(queryKey)
        ?.find((stored) => stored.id === event.id);
      queryClient.setQueryData(
        queryKey,
        (events) => events && replaceById(events, event.id, event),
      );
      return { previous };
    },
    onError: (_error, event, context) => {
      queryClient.setQueryData(
        queryKey,
        (events) => events && replaceById(events, event.id, context?.previous),
      );
      toaster.create({
        type: 'error',
        title: `Couldn't save "${event.title}". Changes were undone.`,
        closable: true,
      });
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(
        queryKey,
        (events) => events && replaceById(events, saved.id, saved),
      );
    },
  }).mutate;
}
