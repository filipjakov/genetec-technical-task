import { Stack } from '@chakra-ui/react';
import type { Metadata } from 'next';
import { ClientOnly } from '../_components/client-only';
import { ColumnsPopover } from './_components/columns-popover';
import { EventsFilterBar } from './_components/events-filter-bar';
import { EventsFilterBarSkeleton } from './_components/events-filter-bar-skeleton';
import { EventsGridSection } from './_components/events-grid-section';

export const metadata: Metadata = { title: 'Events grid' };

export default function EventsPage() {
  return (
    // Fills the viewport's remaining height without growing past it, so the grid's rows
    // scroll inside the page rather than the page scrolling.
    <Stack as="main" gap="4" flex="1" minHeight="0">
      {/* Client-only: it reads the URL, and its date picker reads today's date. */}
      <ClientOnly fallback={<EventsFilterBarSkeleton actions={['Columns']} />}>
        <EventsFilterBar>
          <ColumnsPopover />
        </EventsFilterBar>
      </ClientOnly>
      <EventsGridSection />
    </Stack>
  );
}
