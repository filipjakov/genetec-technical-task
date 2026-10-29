'use client';

import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { DataGrid } from '@repo/ui/datagrid';
import { Suspense } from 'react';
import { ClientOnly } from '../../_components/client-only';
import { NewEventButton } from '../../_components/new-event-button';
import { QueryErrorBoundary } from '../../_components/query-error-boundary';
import { EventsGrid } from './events-grid';

const HEADING_ID = 'events-heading';

/**
 * The `Events` section: its heading row with New Event, then the grid or its load states. It
 * takes the page's remaining height at most, and the grid's rows scroll inside it.
 */
export function EventsGridSection() {
  return (
    <Stack
      as="section"
      aria-labelledby={HEADING_ID}
      gap="3"
      flex="1"
      minHeight="0"
    >
      <Flex align="center" justify="space-between" gap="4">
        {/* Focusable as a fallback target once an edited Event leaves the page. */}
        <Heading as="h2" size="md" id={HEADING_ID} tabIndex={-1}>
          Events
        </Heading>
        <NewEventButton />
      </Flex>
      {/* Positioning pins the grid to the space left on the page; under 20rem the page scrolls. */}
      <Box flex="1" minHeight="20rem" position="relative">
        <Stack position="absolute" inset="0" gap="3">
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
                <EventsGrid />
              </Suspense>
            </ClientOnly>
          </QueryErrorBoundary>
        </Stack>
      </Box>
    </Stack>
  );
}
