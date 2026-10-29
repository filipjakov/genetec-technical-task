'use client';

// Throwaway scratch Timeline for the Timeline slices; replaced by the demo shell.
import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react';
import type { Event } from '@repo/ui/event-form';
import { createTimeline, type TimelineHandle } from '@repo/ui/timeline';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import {
  eventsQueryOptions,
  selectTimelineWindow,
} from '../_utils/events-query';

const EventTimeline = createTimeline<Event>();

const NO_EVENTS: Event[] = [];

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const getEventId = (event: Event) => event.id;
const getOccurredAt = (event: Event) => event.occurredAt;
const getEventLabel = (event: Event) =>
  [
    timeFormat.format(event.occurredAt),
    event.title,
    `${event.severity} severity`,
    event.category,
    event.location,
  ]
    .filter(Boolean)
    .join(', ');
const formatEventCount = (count: number) =>
  count === 1 ? '1 event' : `${count} events`;

export function EventsTimelineScratchContent({
  showEmpty,
}: {
  showEmpty: boolean;
}) {
  const { data: events } = useSuspenseQuery({
    ...eventsQueryOptions,
    select: selectTimelineWindow,
  });
  const timelineRef = useRef<TimelineHandle>(null);
  const [activated, setActivated] = useState<Event>();
  // Checks focus() re-targeting: the removed Event's old position takes focus.
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(new Set());
  const items = useMemo(
    () =>
      removedIds.size === 0
        ? events
        : events.filter((event) => !removedIds.has(event.id)),
    [events, removedIds],
  );

  const removeActivated = () => {
    if (!activated) return;
    setRemovedIds((ids) => new Set(ids).add(activated.id));
    setActivated(undefined);
    requestAnimationFrame(() => timelineRef.current?.focus());
  };

  return (
    <EventTimeline.Root
      ref={timelineRef}
      items={showEmpty ? NO_EVENTS : items}
      getId={getEventId}
      getTimestamp={getOccurredAt}
      getLabel={getEventLabel}
      onItemActivate={setActivated}
      formatCount={formatEventCount}
    >
      <HStack>
        <Text fontSize="sm">Activated: {activated?.title ?? 'none'}</Text>
        <Button
          size="xs"
          variant="outline"
          disabled={!activated}
          onClick={removeActivated}
        >
          Remove activated, then focus()
        </Button>
      </HStack>
      <EventTimeline.KeyHint itemNoun="event" activateLabel="edit" />
      <Box flex="1" minHeight="0">
        <EventTimeline.Grid label="Events, last 30 days">
          {(event) => (
            <Stack gap="0" fontSize="sm">
              <HStack gap="2">
                <Text
                  as="span"
                  color="fg.muted"
                  fontVariantNumeric="tabular-nums"
                >
                  {timeFormat.format(event.occurredAt)}
                </Text>
                <Box
                  boxSize="2"
                  flexShrink="0"
                  rounded="full"
                  bg={`severity.${event.severity}`}
                />
                <Text as="span" fontWeight="medium" truncate>
                  {event.title}
                </Text>
              </HStack>
              <Text color="fg.muted" truncate>
                {[event.category, event.location].filter(Boolean).join(' · ')}
              </Text>
            </Stack>
          )}
        </EventTimeline.Grid>
      </Box>
      <EventTimeline.Empty>
        <Text color="fg.muted">No Events in the last 30 days.</Text>
      </EventTimeline.Empty>
    </EventTimeline.Root>
  );
}
