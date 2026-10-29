'use client';

import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { DataGrid } from '@repo/ui/datagrid';
import type { Event } from '@repo/ui/event-form';
import { useQueryClient } from '@tanstack/react-query';
import { Suspense, useRef, type MouseEvent } from 'react';
import { ClientOnly } from '../../_components/client-only';
import { openEventDialog } from '../../_components/event-dialog';
import { NewEventButton } from '../../_components/new-event-button';
import { QueryErrorBoundary } from '../../_components/query-error-boundary';
import { toaster } from '../../../_components/toaster';
import { eventsQueryOptions } from '../../_utils/events-query';
import { EventsGrid } from './events-grid';

const HEADING_ID = 'events-heading';

/**
 * The `Events` section: its heading row with New Event, then the grid or its load states.
 * It opens the Event dialog for Add and Edit. It takes the page's remaining height at most, and the grid's
 * rows scroll inside it.
 */
export function EventsGridSection() {
  const queryClient = useQueryClient();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const newEventRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // The grid stays on its page and sort, so whether the Event is still on screen is
  // whether its Edit button is rendered; focus and the toast both go by it.
  const findEditButton = (id: string) =>
    gridRef.current?.querySelector<HTMLElement>(
      `[data-event-id="${CSS.escape(id)}"]`,
    ) ?? null;

  /** Adds an Event, or edits `event`, then moves focus and says where it went. */
  const editEvent = async (event?: Event) => {
    const saved = await openEventDialog(event);
    const id = event?.id ?? saved?.id;
    const editButton = id === undefined ? null : findEditButton(id);

    if (!event) {
      newEventRef.current?.focus();
    } else {
      (editButton ?? headingRef.current)?.focus();
    }

    if (!saved) {
      return;
    }

    toaster.create({
      type: 'success',
      title: editButton
        ? 'Event saved.'
        : "Event saved. It isn't on this page of the grid with the current filters.",
      closable: true,
      duration: 6000,
    });
  };

  // One listener for every row's Edit button, so the columns stay module-level.
  const onGridClick = (e: MouseEvent<HTMLDivElement>) => {
    const id = (e.target as Element).closest<HTMLElement>('[data-event-id]')
      ?.dataset.eventId;
    const event =
      id === undefined
        ? undefined
        : queryClient
            .getQueryData(eventsQueryOptions.queryKey)
            ?.find((stored) => stored.id === id);
    if (event) void editEvent(event);
  };

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
        <Heading
          as="h2"
          size="md"
          id={HEADING_ID}
          ref={headingRef}
          tabIndex={-1}
        >
          Events
        </Heading>
        <NewEventButton ref={newEventRef} onClick={() => void editEvent()} />
      </Flex>
      {/* Positioning pins the grid to the space left on the page; under 20rem the page scrolls. */}
      <Box flex="1" minHeight="20rem" position="relative">
        <Stack
          ref={gridRef}
          position="absolute"
          inset="0"
          gap="3"
          onClick={onGridClick}
        >
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
