'use client';

// Throwaway scratch grid for the DataGrid slices; replaced by the demo shell.
import { Text } from '@chakra-ui/react';
import { createColumns, DataGrid } from '@repo/ui/datagrid';
import { SEVERITIES, type Event } from '@repo/ui/event-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import { eventsQueryOptions } from '../_utils/events-query';

const col = createColumns<Event>();

const columns = [
  col({ accessor: 'occurredAt', label: 'Occurred', width: '11rem' }),
  col({ accessor: 'title', label: 'Title', width: '18rem' }),
  col({ accessor: 'category', label: 'Category', width: '7rem' }),
  col({
    accessor: 'severity',
    label: 'Severity',
    width: '7rem',
    cell: (severity) => severity.toUpperCase(),
    compare: (a, b) => SEVERITIES.indexOf(a) - SEVERITIES.indexOf(b),
  }),
  col({ accessor: 'location', label: 'Location', width: '12rem' }),
  col({ accessor: 'description', label: 'Description', hidden: true }),
];

const NO_EVENTS: Event[] = [];

const getEventId = (event: Event) => event.id;

export function EventsGridScratchContent({
  showEmpty,
}: {
  showEmpty: boolean;
}) {
  const { data: events } = useSuspenseQuery(eventsQueryOptions);

  return (
    <DataGrid.Root
      rows={showEmpty ? NO_EVENTS : events}
      getRowId={getEventId}
      columns={columns}
      initialSort={{ columnId: 'occurredAt', direction: 'desc' }}
    >
      <DataGrid.Table label="Events">
        <DataGrid.Empty>
          <Text color="fg.muted">No Events yet.</Text>
        </DataGrid.Empty>
        <DataGrid.NoMatches>
          <Text color="fg.muted">No Events match the filters.</Text>
        </DataGrid.NoMatches>
      </DataGrid.Table>
      <DataGrid.Pagination />
    </DataGrid.Root>
  );
}
