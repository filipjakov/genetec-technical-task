'use client';

import {
  functionalUpdate,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type SortingState,
  type TableOptions,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { getColumnId, type DataGridColumn } from './columns';
import type { ErasedRow } from './data-grid-context';
import type { DataGridRootProps, DataGridSort } from './data-grid-root';
import type { Features } from './table-features';

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
  | 'initialState'
  | 'onSortingChange'
  | 'onPaginationChange'
  | 'onColumnVisibilityChange'
>;

const toSorting = (sort: DataGridSort | null | undefined): SortingState =>
  sort ? [{ id: sort.columnId, desc: sort.direction === 'desc' }] : [];

const fromSorting = ([first]: SortingState): DataGridSort | null =>
  first ? { columnId: first.id, direction: first.desc ? 'desc' : 'asc' } : null;

const toVisibility = (hidden: readonly string[]): ColumnVisibilityState =>
  Object.fromEntries(hidden.map((id) => [id, false]));

const fromVisibility = (visibility: ColumnVisibilityState): string[] =>
  Object.keys(visibility).filter((id) => visibility[id] === false);

// `[]`, or a DateRange with both ends open.
const isEmptyFilter = (value: unknown) =>
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.every((item) => item === undefined));

/**
 * Translates `DataGrid.Root`'s state props into TanStack's state options: the slices whose
 * prop is passed are controlled, the rest start from `initialState`. Each slice is memoised
 * on its content, since a new array would re-run the row models over every row.
 *
 * Also returns `filtersKey`, which changes only when the applied filters do.
 */
export function useTableStateOptions(
  columns: readonly DataGridColumn<ErasedRow>[],
  columnsById: ReadonlyMap<string, DataGridColumn<ErasedRow>>,
  {
    filters,
    sort,
    onSortChange,
    initialSort,
    pagination,
    onPaginationChange,
    initialPageSize = 50,
    hiddenColumns,
    onHiddenColumnsChange,
  }: StateProps,
): StateOptions & { filtersKey: string } {
  // Unknown or unfilterable columns are dropped; Dates serialise as ISO strings.
  const activeFilters = Object.entries(filters ?? {}).filter(
    ([id, value]) =>
      columnsById.get(id)?.filterFn !== undefined && !isEmptyFilter(value),
  );
  const filtersKey = JSON.stringify(activeFilters);
  const columnFilters = useMemo<ColumnFiltersState>(
    () => activeFilters.map(([id, value]) => ({ id, value })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtersKey],
  );

  const sortKey = sort && `${sort.columnId}.${sort.direction}`;
  const sorting = useMemo(
    () => (sort === undefined ? undefined : toSorting(sort)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortKey],
  );

  const { pageIndex, pageSize } = pagination ?? {};
  const pageState = useMemo<PaginationState | undefined>(
    () =>
      pageIndex === undefined || pageSize === undefined
        ? undefined
        : { pageIndex, pageSize },
    [pageIndex, pageSize],
  );

  const hiddenKey = hiddenColumns?.join(',');
  const columnVisibility = useMemo(
    () => (hiddenColumns ? toVisibility(hiddenColumns) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hiddenKey],
  );

  return {
    filtersKey,
    state: {
      columnFilters,
      ...(sorting && { sorting }),
      ...(pageState && { pagination: pageState }),
      ...(columnVisibility && { columnVisibility }),
    },
    // TanStack passes a value or a function of the previous one; resolve it, then translate.
    ...(sorting && {
      onSortingChange: (updater) =>
        onSortChange?.(fromSorting(functionalUpdate(updater, sorting))),
    }),
    ...(pageState && {
      onPaginationChange: (updater) =>
        onPaginationChange?.(functionalUpdate(updater, pageState)),
    }),
    ...(columnVisibility && {
      onColumnVisibilityChange: (updater) =>
        onHiddenColumnsChange?.(
          fromVisibility(functionalUpdate(updater, columnVisibility)),
        ),
    }),
    initialState: {
      columnVisibility: toVisibility(
        columns.filter((column) => column.hidden).map(getColumnId),
      ),
      sorting: toSorting(initialSort),
      pagination: { pageIndex: 0, pageSize: initialPageSize },
    },
  };
}
