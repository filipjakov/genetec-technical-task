'use client';

import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Timeline } from '@repo/ui/timeline';
import { Suspense } from 'react';
import { ClientOnly } from '../../_components/client-only';
import { NewEventButton } from '../../_components/new-event-button';
import { QueryErrorBoundary } from '../../_components/query-error-boundary';
import { EventsTimeline } from './events-timeline';

const HEADING_ID = 'timeline-heading';

/**
 * The `Last 30 days` section: its heading row with New Event, then the Timeline or its load
 * states. It takes the page's remaining height, and the Timeline scrolls inside it.
 */
export function EventsTimelineSection() {
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
        <NewEventButton />
      </Flex>
      <Stack gap="2" flex="1" minHeight="0">
        <QueryErrorBoundary
          fallback={() => <Text role="alert">Couldn&apos;t load events.</Text>}
        >
          <ClientOnly fallback={<Timeline.Skeleton label="Loading Events" />}>
            <Suspense fallback={<Timeline.Skeleton label="Loading Events" />}>
              <EventsTimeline />
            </Suspense>
          </ClientOnly>
        </QueryErrorBoundary>
      </Stack>
    </Stack>
  );
}
