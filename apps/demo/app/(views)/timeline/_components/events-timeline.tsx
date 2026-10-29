'use client';

import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { CATEGORY_LABELS, type Event } from '@repo/ui/event-form';
import { createTimeline, type TimelineHandle } from '@repo/ui/timeline';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { Ref } from 'react';
import {
  TIMELINE_WINDOW_DAYS,
  selectTimelineWindow,
} from '../../../_utils/timeline-window';
import { eventsQueryOptions } from '../../_utils/events-query';
import { getEventId } from '../../_utils/get-event-id';

const EventTimeline = createTimeline<Event>();

const KEY_HINT_ID = 'timeline-key-hint';

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

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
const countFormat = new Intl.NumberFormat();
const formatEventCount = (count: number) =>
  count === 1 ? '1 event' : `${countFormat.format(count)} events`;

interface EventsTimelineProps {
  /** Opens an Event for editing; pass a stable function. */
  onEdit: (event: Event) => void;
  /** Brings focus back to the Timeline, e.g. when the Edit dialog closes. */
  ref?: Ref<TimelineHandle>;
}

/** The Timeline Window's Events, unfiltered: the window is the Timeline's only narrowing. */
export function EventsTimeline({ onEdit, ref }: EventsTimelineProps) {
  const { data: windowEvents } = useSuspenseQuery({
    ...eventsQueryOptions,
    select: selectTimelineWindow,
  });

  return (
    <EventTimeline.Root
      ref={ref}
      items={windowEvents}
      getId={getEventId}
      getTimestamp={getOccurredAt}
      getLabel={getEventLabel}
      onItemActivate={onEdit}
      formatCount={formatEventCount}
    >
      <EventTimeline.KeyHint
        id={KEY_HINT_ID}
        itemNoun="event"
        activateLabel="edit"
      />
      {/* The Grid fills its parent; positioning pins it to the space left on the page, and
          under 20rem the page scrolls instead. */}
      <Box flex="1" minHeight="20rem" position="relative">
        <Box position="absolute" inset="0">
          <EventTimeline.Grid
            label={`Events, last ${TIMELINE_WINDOW_DAYS} days`}
            describedBy={KEY_HINT_ID}
          >
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
                  {[CATEGORY_LABELS[event.category], event.location]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
              </Stack>
            )}
          </EventTimeline.Grid>
        </Box>
      </Box>
      <EventTimeline.Empty>
        <Text color="fg.muted">
          No Events in the last {TIMELINE_WINDOW_DAYS} days.
        </Text>
      </EventTimeline.Empty>
    </EventTimeline.Root>
  );
}
