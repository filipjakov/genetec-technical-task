// The Events grid's view (filters, sort, page, hidden columns) as URL params, so a link
// reproduces it. Params equal to their default are left out of the URL.
import type { DataGridSort } from '@repo/ui/datagrid';
import { CATEGORIES, SEVERITIES, type Event } from '@repo/ui/event-form';
import {
  createLoader,
  createParser,
  debounce,
  parseAsArrayOf,
  parseAsIndex,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
} from 'nuqs';
import { isDayKey } from './day-keys';

export const EVENT_COLUMN_IDS = [
  'occurredAt',
  'title',
  'category',
  'severity',
  'location',
  'description',
] as const satisfies readonly (keyof Event)[];

export type EventColumnId = (typeof EVENT_COLUMN_IDS)[number];

export const PAGE_SIZES = [25, 50, 100] as const;

export const isEventColumnId = (id: string): id is EventColumnId =>
  (EVENT_COLUMN_IDS as readonly string[]).includes(id);

/** A viewer-local `YYYY-MM-DD` day; anything else reads as no day. */
const parseAsDayKey = createParser({
  parse: (value) => (isDayKey(value) ? value : null),
  serialize: (key: string) => key,
});

/** `?sort=severity.desc`, or `?sort=none` for unsorted, since no param means the default sort. */
const parseAsSort = createParser<DataGridSort | 'none'>({
  parse: (value) => {
    if (value === 'none') return 'none';
    const [columnId = '', direction] = value.split('.');
    if (!isEventColumnId(columnId)) return null;
    if (direction !== 'asc' && direction !== 'desc') return null;
    return { columnId, direction };
  },
  serialize: (sort) =>
    sort === 'none' ? 'none' : `${sort.columnId}.${sort.direction}`,
  eq: (a, b) =>
    a === b ||
    (a !== 'none' &&
      b !== 'none' &&
      a.columnId === b.columnId &&
      a.direction === b.direction),
});

/** `?hidden=description,location`: unknown ids are dropped, and hiding every column reads as the default. */
const parseAsHiddenColumns = createParser<EventColumnId[]>({
  parse: (value) => {
    const ids = [...new Set(value.split(',').filter(isEventColumnId))];
    return ids.length === EVENT_COLUMN_IDS.length ? null : ids;
  },
  serialize: (ids) => ids.join(','),
  eq: (a, b) => a.length === b.length && a.every((id, i) => id === b[i]),
});

/**
 * Typed text: the URL is written 300 ms after typing stops, while the hook's state follows
 * each keystroke. The grid filters from the URL (see {@link loadEventsFilters}).
 */
const parseAsSearchText = parseAsString
  .withDefault('')
  .withOptions({ limitUrlUpdates: debounce(300) });

export const eventsFilterParams = {
  from: parseAsDayKey,
  to: parseAsDayKey,
  title: parseAsSearchText,
  category: parseAsArrayOf(parseAsStringLiteral(CATEGORIES)).withDefault([]),
  severity: parseAsArrayOf(parseAsStringLiteral(SEVERITIES)).withDefault([]),
  location: parseAsSearchText,
  description: parseAsSearchText,
};

/** The filters as written to the URL, so text applies only once typing stops. */
export const loadEventsFilters = createLoader(eventsFilterParams);

export const eventsViewParams = {
  ...eventsFilterParams,
  // 1-based in the URL, zero-based here.
  page: parseAsIndex.withDefault(0),
  size: parseAsNumberLiteral(PAGE_SIZES).withDefault(25),
  sort: parseAsSort.withDefault({ columnId: 'occurredAt', direction: 'desc' }),
  hidden: parseAsHiddenColumns.withDefault(['description']),
};

export type EventsFilterValues = inferParserType<typeof eventsFilterParams>;
