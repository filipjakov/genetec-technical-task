'use client';

import { Button, HStack, Text } from '@chakra-ui/react';
import { DataGrid } from '@repo/ui/datagrid';
import type { Event } from '@repo/ui/event-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useClearEventsFilters } from '../_hooks/use-clear-events-filters';
import { useEventsView } from '../_hooks/use-events-view';
import { eventsQueryOptions } from '../../_utils/events-query';
import {
  isEventColumnId,
  loadEventsFilters,
  PAGE_SIZES,
} from '../_utils/events-view-params';
import { toGridFilters } from '../_utils/to-grid-filters';
import { eventColumns } from '../_utils/event-columns';

const getEventId = (event: Event) => event.id;

// The grid's pager offers only PAGE_SIZES, so the fallback is never hit.
const toPageSize = (size: number) =>
  PAGE_SIZES.find((pageSize) => pageSize === size) ?? PAGE_SIZES[0];

/** Every Event in a DataGrid whose view (filters, sort, page, hidden columns) lives in the URL. */
export function EventsGrid() {
  const { data: events } = useSuspenseQuery(eventsQueryOptions);
  // The view lives in the URL (see EventsFilterBar); the grid only reads and reports it.
  const [view, setView] = useEventsView();
  // Filters come from the URL itself, not the hook's state, so text filters apply only once
  // their debounced URL write lands rather than on every keystroke.
  const filters = loadEventsFilters(useSearchParams());
  const clearFilters = useClearEventsFilters();

  return (
    <DataGrid.Root
      rows={events}
      getRowId={getEventId}
      columns={eventColumns}
      filters={toGridFilters(filters)}
      sort={view.sort === 'none' ? null : view.sort}
      onSortChange={(sort) => setView({ sort: sort ?? 'none' })}
      pagination={{ pageIndex: view.page, pageSize: view.size }}
      onPaginationChange={({ pageIndex, pageSize }) =>
        setView({ page: pageIndex, size: toPageSize(pageSize) })
      }
      hiddenColumns={view.hidden}
      onHiddenColumnsChange={(hidden) =>
        setView({ hidden: hidden.filter(isEventColumnId) })
      }
    >
      <DataGrid.Table label="Events">
        <DataGrid.Empty>
          <Text color="fg.muted">No Events yet.</Text>
        </DataGrid.Empty>
        <DataGrid.NoMatches>
          <HStack gap="3" wrap="wrap">
            <Text color="fg.muted">No Events match the filters.</Text>
            <Button size="xs" variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </HStack>
        </DataGrid.NoMatches>
      </DataGrid.Table>
      <DataGrid.Pagination pageSizes={PAGE_SIZES} />
    </DataGrid.Root>
  );
}
