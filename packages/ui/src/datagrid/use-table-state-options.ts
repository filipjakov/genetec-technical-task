'use client';

import {
  functionalUpdate,
  type ColumnVisibilityState,
  type SortingState,
  type TableOptions,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { getColumnId, type DataGridColumn } from './columns';
import type { DataGridRootProps } from './data-grid-root';
import type { ErasedRow, Features } from './table-features';
import {
  clampPageSize,
  DEFAULT_PAGE_SIZE,
  type DataGridPageState,
  type DataGridSort,
} from './view-state';

type StateProps = Pick<
  DataGridRootProps<ErasedRow>,
  | 'filters'
  | 'sort'
  | 'onSortChange'
  | 'initialSort'
  | 'pagination'
  | 'onPaginationChange'
  | 'initialPageSize'
  | 'hiddenColumns'
  | 'onHiddenColumnsChange'
>;

type StateOptions = Pick<
  TableOptions<Features, ErasedRow>,
  | 'state'
  | 'onSortingChange'
  | 'onPaginationChange'
  | 'onColumnVisibilityChange'
>;

const toSorting = (sort: DataGridSort | null): SortingState =>
  sort ? [{ id: sort.columnId, desc: sort.direction === 'desc' }] : [];

const fromSorting = ([first]: SortingState): DataGridSort | null =>
  first ? { columnId: first.id, direction: first.desc ? 'desc' : 'asc' } : null;

const toVisibility = (hidden: readonly string[]): ColumnVisibilityState =>
  Object.fromEntries(hidden.map((id) => [id, false]));

const fromVisibility = (visibility: ColumnVisibilityState): string[] =>
  Object.keys(visibility).filter((id) => visibility[id] === false);

const isInvalidDate = (value: unknown) =>
  value instanceof Date && Number.isNaN(value.getTime());

// An Invalid Date end is open, as TanStack's `inDateRange` treats it.
const normaliseFilter = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) => (isInvalidDate(item) ? undefined : item))
    : value;

// `[]`, or a DateRange with both ends open.
const isEmptyFilter = (value: unknown) =>
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.every((item) => item === undefined));

/**
 * Translates `DataGrid.Root`'s state props into TanStack's state options. The grid always
 * controls TanStack: a slice whose prop is passed comes from it, the rest from the hook's own
 * state, and the change callbacks fire either way. Each slice is memoised on its content,
 * since a new array would re-run the row models over every row.
 *
 * Also returns `filtersKey`, which changes only when the applied filters do.
 */
export function useTableStateOptions(
  columns: readonly DataGridColumn<ErasedRow>[],
  {
    filters,
    sort,
    onSortChange,
    initialSort,
    pagination,
    onPaginationChange,
    initialPageSize = DEFAULT_PAGE_SIZE,
    hiddenColumns,
    onHiddenColumnsChange,
  }: StateProps,
): StateOptions & { filtersKey: string } {
  // Unknown or unfilterable columns are dropped; Dates serialise as ISO strings.
  const filterable = new Set(
    columns.filter((column) => column.filterFn).map(getColumnId),
  );
  const activeFilters = Object.entries(filters ?? {})
    .map(([id, value]) => [id, normaliseFilter(value)] as const)
    .filter(([id, value]) => filterable.has(id) && !isEmptyFilter(value));
  const filtersKey = JSON.stringify(activeFilters);
  const columnFilters = useMemo(
    () => activeFilters.map(([id, value]) => ({ id, value })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtersKey],
  );

  const [ownSort, setOwnSort] = useState(initialSort ?? null);
  const currentSort = sort === undefined ? ownSort : sort;
  const sortKey =
    currentSort && `${currentSort.columnId}.${currentSort.direction}`;
  const sorting = useMemo(
    () => toSorting(currentSort),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortKey],
  );

  const [ownPage, setOwnPage] = useState<DataGridPageState>(() => ({
    pageIndex: 0,
    pageSize: clampPageSize(initialPageSize),
  }));
  const { pageIndex, pageSize } = pagination ?? ownPage;
  const pageState = useMemo(
    () => ({ pageIndex, pageSize: clampPageSize(pageSize) }),
    [pageIndex, pageSize],
  );

  const [ownHidden, setOwnHidden] = useState<readonly string[]>(() =>
    columns.filter((column) => column.hidden).map(getColumnId),
  );
  const hidden = hiddenColumns ?? ownHidden;
  const hiddenKey = hidden.join(',');
  const columnVisibility = useMemo(
    () => toVisibility(hidden),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hiddenKey],
  );

  return {
    filtersKey,
    state: { columnFilters, sorting, pagination: pageState, columnVisibility },
    // TanStack passes a value or a function of the previous one; resolve it, then translate.
    onSortingChange: (updater) => {
      const next = fromSorting(functionalUpdate(updater, sorting));
      if (sort === undefined) setOwnSort(next);
      onSortChange?.(next);
    },
    onPaginationChange: (updater) => {
      const next = functionalUpdate(updater, pageState);
      if (pagination === undefined) setOwnPage(next);
      onPaginationChange?.(next);
    },
    onColumnVisibilityChange: (updater) => {
      const next = fromVisibility(functionalUpdate(updater, columnVisibility));
      if (hiddenColumns === undefined) setOwnHidden(next);
      onHiddenColumnsChange?.(next);
    },
  };
}
