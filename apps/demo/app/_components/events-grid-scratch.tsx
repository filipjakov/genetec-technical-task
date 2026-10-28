'use client';

// Throwaway scratch grid for the DataGrid slices; replaced by the demo shell.
import { Button, Stack, Text } from '@chakra-ui/react';
import { DataGrid } from '@repo/ui/datagrid';
import { Suspense, useState } from 'react';
import { ClientOnly } from './client-only';
import { EventsFilterBar } from './events-filter-bar';
import { EventsGridScratchContent } from './events-grid-scratch-content';
import { QueryErrorBoundary } from './query-error-boundary';

export function EventsGridScratch() {
  const [showEmpty, setShowEmpty] = useState(false);
  return (
    <Stack gap="2">
      <Button
        alignSelf="start"
        variant="outline"
        onClick={() => setShowEmpty((value) => !value)}
      >
        {showEmpty ? 'Show Events' : 'Show no rows'}
      </Button>
      {/* Client-only: it reads the URL, and its date picker reads today's date. */}
      <ClientOnly fallback={null}>
        <EventsFilterBar />
      </ClientOnly>
      <QueryErrorBoundary
        fallback={(retry) => (
          <Stack role="alert" gap="2" borderWidth="1px" rounded="md" p="3">
            <Text>Couldn&apos;t load Events.</Text>
            <Button size="sm" alignSelf="start" onClick={retry}>
              Retry
            </Button>
          </Stack>
        )}
      >
        <ClientOnly fallback={<DataGrid.Skeleton label="Loading Events" />}>
          <Suspense fallback={<DataGrid.Skeleton label="Loading Events" />}>
            <EventsGridScratchContent showEmpty={showEmpty} />
          </Suspense>
        </ClientOnly>
      </QueryErrorBoundary>
    </Stack>
  );
}
