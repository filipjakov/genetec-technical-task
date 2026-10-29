'use client';

import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import type { Event } from '@repo/ui/event-form';
import { createTimeline } from '@repo/ui/timeline';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  eventsQueryOptions,
  selectTimelineWindow,
} from '../../_utils/events-query';

const EventTimeline = createTimeline<Event>();

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
// Editing lands with the Event dialog.
const editEvent = () => {};

/** The Timeline Window's Events, unfiltered: the window is the Timeline's only narrowing. */
export function EventsTimeline() {
  const { data: windowEvents } = useSuspenseQuery({
    ...eventsQueryOptions,
    select: selectTimelineWindow,
  });

  return (
    <EventTimeline.Root
      items={windowEvents}
      getId={getEventId}
      getTimestamp={getOccurredAt}
      getLabel={getEventLabel}
      onItemActivate={editEvent}
      formatCount={formatEventCount}
    >
      <EventTimeline.KeyHint itemNoun="event" activateLabel="edit" />
      {/* The Grid fills its parent; positioning pins it to the space left on the page, and
          under 20rem the page scrolls instead. */}
      <Box flex="1" minHeight="20rem" position="relative">
        <Box position="absolute" inset="0">
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
      </Box>
      <EventTimeline.Empty>
        <Text color="fg.muted">No Events in the last 30 days.</Text>
      </EventTimeline.Empty>
    </EventTimeline.Root>
  );
}
