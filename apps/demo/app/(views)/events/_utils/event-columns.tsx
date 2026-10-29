import { Button } from '@chakra-ui/react';
import { createColumns } from '@repo/ui/datagrid';
import { SEVERITIES, type Event } from '@repo/ui/event-form';
import type { EventColumnId } from './events-view-params';

const col = createColumns<Event>();

/**
 * The Events grid's columns, in display order: one per {@link EventColumnId}, then Actions,
 * which can't be sorted, filtered or hidden.
 */
export const eventColumns = [
  col({
    accessor: 'occurredAt',
    label: 'Occurred',
    width: '11rem',
    filterFn: 'inDateRange',
  }),
  col({
    accessor: 'title',
    label: 'Title',
    width: '18rem',
    filterFn: 'includesString',
  }),
  col({
    accessor: 'category',
    label: 'Category',
    width: '9rem',
    filterFn: 'arrHas',
  }),
  col({
    accessor: 'severity',
    label: 'Severity',
    width: '9rem',
    cell: (severity) => severity.toUpperCase(),
    compare: (a, b) => SEVERITIES.indexOf(a) - SEVERITIES.indexOf(b),
    filterFn: 'arrHas',
  }),
  col({
    accessor: 'location',
    label: 'Location',
    width: '12rem',
    filterFn: 'includesString',
  }),
  col({
    accessor: 'description',
    label: 'Description',
    filterFn: 'includesString',
  }),
  col({
    id: 'actions',
    accessor: (event) => event.id,
    label: 'Actions',
    width: '5rem',
    sortable: false,
    // Named by the title, so it reads the same whichever columns are visible.
    cell: (id, event) => (
      <Button
        size="xs"
        variant="outline"
        aria-label={`Edit "${event.title}"`}
        data-event-id={id}
      >
        Edit
      </Button>
    ),
  }),
];

/** The column's header text. Every id has a column above, keyed by its accessor. */
export const getEventColumnLabel = (id: EventColumnId) =>
  eventColumns.find((column) => column.accessor === id)!.label;
