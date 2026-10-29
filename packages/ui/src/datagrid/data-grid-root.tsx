'use client';

import { useTable, type ColumnDef } from '@tanstack/react-table';
import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import {
  getColumnId,
  getColumnValue,
  type DataGridColumn,
  type DataGridFilters,
} from './columns';
import { compareValues } from './compare-values';
import { DataGridContext } from './data-grid-context';
import { features, type ErasedRow, type Features } from './table-features';
import { useTableStateOptions } from './use-table-state-options';
import type { DataGridPageState, DataGridSort } from './view-state';

/** Props for {@link DataGridRoot}. */
export interface DataGridRootProps<TRow extends object> {
  /** Every row; the grid processes them in memory. Pass a stable array. */
  rows: readonly TRow[];
  /** A unique, stable id per row. */
  getRowId: (row: TRow) => string;
  /** The columns, in display order; see `createColumns`. Pass a stable array. */
  columns: readonly DataGridColumn<TRow>[];
  /**
   * The filters to apply, by column id; each column matches its value with its `filterFn`.
   * The grid draws no filter controls, so this is one-way. Changing it returns to the first page.
   */
  filters?: DataGridFilters;
  /** The sort, controlled; `null` is unsorted. Omit it to let the grid own the sort. */
  sort?: DataGridSort | null;
  /** Called with the new sort when a header is clicked, whether or not `sort` is passed. */
  onSortChange?: (sort: DataGridSort | null) => void;
  /** The sort to start with, when `sort` is omitted. Defaults to the order of `rows`. */
  initialSort?: DataGridSort;
  /** The page, controlled. Omit it to let the grid own the page. A `pageSize` over 100 is capped. */
  pagination?: DataGridPageState;
  /**
   * Called with the new page, whether or not `pagination` is passed: when the pager is used,
   * and when the grid moves the page itself:
   * to the first page when the filters or sort change, to the last one when the rows shrink.
   */
  onPaginationChange?: (pagination: DataGridPageState) => void;
  /** Rows per page to start with, when `pagination` is omitted. Defaults to 50; at most 100. */
  initialPageSize?: number;
  /**
   * The ids of the hidden columns, controlled. Omit it to let the grid own visibility,
   * starting from the columns' `hidden` option.
   */
  hiddenColumns?: readonly string[];
  /**
   * Called with the new hidden column ids when a column is shown or hidden, whether or not
   * `hiddenColumns` is passed.
   */
  onHiddenColumnsChange?: (hiddenColumns: string[]) => void;
  /** The grid's parts, such as `DataGrid.Table`, laid out as you like. */
  children: ReactNode;
}

function toColumnDef(
  column: DataGridColumn<ErasedRow>,
): ColumnDef<Features, ErasedRow, unknown> {
  const compare = column.compare ?? compareValues;
  return {
    id: getColumnId(column),
    // `null` becomes `undefined` so `sortUndefined` puts both last in either direction.
    accessorFn: (row) => getColumnValue(column, row) ?? undefined,
    enableSorting: column.sortable ?? true,
    sortUndefined: 'last',
    sortFn: (rowA, rowB, columnId) =>
      compare(rowA.getValue(columnId), rowB.getValue(columnId)),
    enableColumnFilter: column.filterFn !== undefined,
    filterFn: column.filterFn,
    meta: { column },
  };
}

/**
 * Holds a grid's rows, columns and state, and shares them with the parts rendered inside
 * it. Renders no markup of its own. It needs its rows: while they load, render
 * `DataGrid.Skeleton` instead (e.g. as a Suspense fallback), and handle load errors outside it.
 *
 * Sort, page and column visibility are each uncontrolled unless their prop is passed, and
 * survive changes to `rows`; the page index is clamped when the rows shrink. Filters come
 * only from `filters`.
 *
 * @example
 * <DataGrid.Root
 *   rows={events}
 *   getRowId={(event) => event.id}
 *   columns={columns}
 *   initialSort={{ columnId: 'occurredAt', direction: 'desc' }}
 * >
 *   <DataGrid.Table label="Events" />
 *   <DataGrid.Pagination />
 * </DataGrid.Root>
 */
export function DataGridRoot<TRow extends object>({
  rows,
  getRowId,
  columns,
  children,
  ...stateProps
}: DataGridRootProps<TRow>) {
  const erasedColumns = columns as readonly DataGridColumn<ErasedRow>[];
  const columnDefs = useMemo(
    () => erasedColumns.map(toColumnDef),
    [erasedColumns],
  );

  const { filtersKey, ...stateOptions } = useTableStateOptions(
    erasedColumns,
    stateProps,
  );

  const table = useTable({
    features,
    columns: columnDefs,
    data: rows as readonly ErasedRow[],
    getRowId: getRowId as (row: ErasedRow) => string,
    enableMultiSort: false,
    // Keep the page when `rows` change (create/edit); it is clamped below instead.
    autoResetPageIndex: false,
    ...stateOptions,
  });

  const { pageIndex } = table.state.pagination;
  const lastPageIndex = Math.max(0, table.getPageCount() - 1);
  const [sorted] = table.state.sorting;
  // Changes when the filters or the sort do, from a header click or from outside (e.g. the URL).
  const viewKey = `${filtersKey}|${sorted ? `${sorted.id}.${sorted.desc}` : ''}`;
  // Filters and sort set on mount (e.g. from a shared link) keep the page they came with.
  const appliedViewKey = useRef(viewKey);
  // A layout effect, so a page emptied by new filters or shrinking `rows` is never painted.
  useLayoutEffect(() => {
    if (viewKey !== appliedViewKey.current) {
      appliedViewKey.current = viewKey;
      if (pageIndex !== 0) table.setPageIndex(0);
    } else if (pageIndex > lastPageIndex) {
      table.setPageIndex(lastPageIndex);
    }
  }, [table, viewKey, pageIndex, lastPageIndex]);

  // `table` keeps its identity, so its state and rows are deps to re-render the parts.
  const { state } = table;
  const context = useMemo(
    () => ({ table }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, state, rows],
  );

  return <DataGridContext value={context}>{children}</DataGridContext>;
}
