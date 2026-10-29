'use client';

import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import type { Event } from '@repo/ui/event-form';
import { Timeline, type TimelineHandle } from '@repo/ui/timeline';
import { Suspense, useCallback, useRef } from 'react';
import { ClientOnly } from '../../_components/client-only';
import { openEventDialog } from '../../_components/event-dialog';
import { NewEventButton } from '../../_components/new-event-button';
import { QueryErrorBoundary } from '../../_components/query-error-boundary';
import { toaster } from '../../../_components/toaster';
import { isInTimelineWindow } from '../../_utils/events-query';
import { EventsTimeline } from './events-timeline';

const HEADING_ID = 'timeline-heading';

// Its Day Group's date, e.g. `Tuesday 3 March`; always the date, as `Event saved to Today.`
// would read oddly.
const dayFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

/**
 * The `Last 30 days` section: its heading row with New Event, then the Timeline or its load
 * states. It opens the Event dialog for Add and Edit. It takes the page's remaining height, and the Timeline
 * scrolls inside it.
 */
export function EventsTimelineSection() {
  const timelineRef = useRef<TimelineHandle>(null);
  const newEventRef = useRef<HTMLButtonElement>(null);

  /** Adds an Event, or edits `event`, then moves focus and says where it went. */
  const editEvent = useCallback(async (event?: Event) => {
    const saved = await openEventDialog(event);
    // The Timeline remembers the edited Event; if it left the Window, focus lands on the
    // Event now at its old position.
    if (!event) {
      newEventRef.current?.focus();
    } else {
      timelineRef.current?.focus();
    }

    if (!saved) {
      return;
    }

    toaster.create({
      type: 'success',
      title: isInTimelineWindow(saved)
        ? `Event saved to ${dayFormat.format(saved.occurredAt)}.`
        : "Event saved. It's older than the last 30 days, so it isn't in the Timeline.",
      closable: true,
      duration: 6000,
    });
  }, []);
  // Stable, so the Timeline isn't handed a new activation handler on each render.
  const onEdit = useCallback(
    (event: Event) => void editEvent(event),
    [editEvent],
  );

  return (
    <Stack
      as="section"
      aria-labelledby={HEADING_ID}
      gap="3"
      flex="1"
      minHeight="0"
      width="full"
    >
      <Flex align="center" justify="space-between" gap="4">
        <Heading as="h2" size="md" id={HEADING_ID}>
          Last 30 days
        </Heading>
        <NewEventButton ref={newEventRef} onClick={() => void editEvent()} />
      </Flex>
      <Stack gap="2" flex="1" minHeight="0">
        <QueryErrorBoundary
          fallback={() => <Text role="alert">Couldn&apos;t load events.</Text>}
        >
          <ClientOnly fallback={<Timeline.Skeleton label="Loading Events" />}>
            <Suspense fallback={<Timeline.Skeleton label="Loading Events" />}>
              <EventsTimeline ref={timelineRef} onEdit={onEdit} />
            </Suspense>
          </ClientOnly>
        </QueryErrorBoundary>
      </Stack>
    </Stack>
  );
}
