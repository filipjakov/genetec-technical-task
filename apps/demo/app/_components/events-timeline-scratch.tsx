'use client';

// Throwaway scratch Timeline for the Timeline slices; replaced by the demo shell.
import { Button, Stack, Text } from '@chakra-ui/react';
import { Timeline } from '@repo/ui/timeline';
import { Suspense, useState } from 'react';
import { ClientOnly } from './client-only';
import { EventsTimelineScratchContent } from './events-timeline-scratch-content';
import { QueryErrorBoundary } from './query-error-boundary';

export function EventsTimelineScratch() {
  const [showEmpty, setShowEmpty] = useState(false);
  return (
    <Stack gap="2" maxWidth="48rem">
      <Button
        alignSelf="start"
        variant="outline"
        onClick={() => setShowEmpty((value) => !value)}
      >
        {showEmpty ? 'Show Events' : 'Show no items'}
      </Button>
      <Stack height="70vh" gap="2">
        <QueryErrorBoundary
          fallback={() => <Text role="alert">Couldn&apos;t load events.</Text>}
        >
          <ClientOnly fallback={<Timeline.Skeleton label="Loading Events" />}>
            <Suspense fallback={<Timeline.Skeleton label="Loading Events" />}>
              <EventsTimelineScratchContent showEmpty={showEmpty} />
            </Suspense>
          </ClientOnly>
        </QueryErrorBoundary>
      </Stack>
    </Stack>
  );
}
