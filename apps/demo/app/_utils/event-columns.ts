import { createColumns } from '@repo/ui/datagrid';
import { SEVERITIES, type Event } from '@repo/ui/event-form';
import type { EventColumnId } from './events-view-params';

const col = createColumns<Event>();

/** The Events grid's columns, in display order, one per {@link EventColumnId}. */
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
];

/** The column's header text. Every id has a column above, keyed by its accessor. */
export const getEventColumnLabel = (id: EventColumnId) =>
  eventColumns.find((column) => column.accessor === id)!.label;
