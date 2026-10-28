'use client';

// Throwaway scratch readout for the client data layer; removed with the scratch page.
import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useCreateEvent } from '../_hooks/use-create-event';
import {
  eventsQueryOptions,
  selectTimelineWindow,
} from '../_utils/events-query';

export function EventsReadout() {
  const all = useQuery(eventsQueryOptions);
  const timelineWindow = useQuery({
    ...eventsQueryOptions,
    select: selectTimelineWindow,
  });
  const createEvent = useCreateEvent();
  const sample = (occurredAt: Date) =>
    createEvent({
      title: 'Scratch Event',
      occurredAt,
      category: 'system',
      severity: 'info',
    });

  return (
    <Stack gap="2">
      <Text>
        Status: {all.status} · Total: {all.data?.length ?? '–'} · Timeline
        Window: {timelineWindow.data?.length ?? '–'}
      </Text>
      {all.isError && (
        <Button alignSelf="start" onClick={() => void all.refetch()}>
          Retry
        </Button>
      )}
      <HStack wrap="wrap">
        <Button disabled={!all.isSuccess} onClick={() => sample(new Date())}>
          Create Event now
        </Button>
        <Button
          disabled={!all.isSuccess}
          variant="outline"
          onClick={() => sample(new Date(Date.now() + 60 * 60_000))}
        >
          Create future Event (400, rolls back)
        </Button>
      </HStack>
    </Stack>
  );
}
