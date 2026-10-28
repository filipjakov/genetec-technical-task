'use client';

import { useTable, type ColumnDef } from '@tanstack/react-table';
import { useLayoutEffect, useMemo, type ReactNode } from 'react';
import { getColumnId, getColumnValue, type DataGridColumn } from './columns';
import { compareValues } from './compare-values';
import {
  DataGridContext,
  type DataGridView,
  type ErasedRow,
} from './data-grid-context';
import { features, type Features } from './table-features';

/** A sort direction: `asc` puts the smallest value first. */
export type SortDirection = 'asc' | 'desc';

/** The column the rows are sorted by, and in which direction. */
export interface DataGridSort {
  columnId: string;
  direction: SortDirection;
}

/** Props for {@link DataGridRoot}. */
export interface DataGridRootProps<TRow extends object> {
  /** Every row; the grid processes them in memory. Pass a stable array. */
  rows: readonly TRow[];
  /** A unique, stable id per row. */
  getRowId: (row: TRow) => string;
  /** The columns, in display order; see `createColumns`. Pass a stable array. */
  columns: readonly DataGridColumn<TRow>[];
  /** The sort to start with. Defaults to the order of `rows`. */
  initialSort?: DataGridSort;
  /** Rows per page to start with. Defaults to 50. */
  initialPageSize?: number;
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
  };
}

/**
 * Holds a grid's rows, columns and state, and shares them with the parts rendered inside
 * it. Renders no markup of its own. It needs its rows: while they load, render
 * `DataGrid.Skeleton` instead (e.g. as a Suspense fallback), and handle load errors outside it.
 *
 * Sort, page and column visibility are uncontrolled and survive changes to `rows`; the page
 * index is clamped when the rows shrink.
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
  initialSort,
  initialPageSize = 50,
  children,
}: DataGridRootProps<TRow>) {
  const erasedColumns = columns as readonly DataGridColumn<ErasedRow>[];
  const columnDefs = useMemo(
    () => erasedColumns.map(toColumnDef),
    [erasedColumns],
  );
  const columnsById = useMemo(
    () => new Map(erasedColumns.map((column) => [getColumnId(column), column])),
    [erasedColumns],
  );

  const table = useTable({
    features,
    columns: columnDefs,
    data: rows as readonly ErasedRow[],
    getRowId: getRowId as (row: ErasedRow) => string,
    enableMultiSort: false,
    // Keep the page when `rows` change (create/edit); it is clamped below instead.
    autoResetPageIndex: false,
    initialState: {
      columnVisibility: Object.fromEntries(
        erasedColumns
          .filter((column) => column.hidden)
          .map((column) => [getColumnId(column), false]),
      ),
      sorting: initialSort
        ? [
            {
              id: initialSort.columnId,
              desc: initialSort.direction === 'desc',
            },
          ]
        : [],
      pagination: { pageIndex: 0, pageSize: initialPageSize },
    },
  });

  const { pageIndex } = table.state.pagination;
  const lastPageIndex = Math.max(0, table.getPageCount() - 1);
  // A layout effect, so a page emptied by shrinking `rows` is never painted.
  useLayoutEffect(() => {
    if (pageIndex > lastPageIndex) table.setPageIndex(lastPageIndex);
  }, [table, pageIndex, lastPageIndex]);

  const view: DataGridView = rows.length === 0 ? 'empty' : 'rows';

  // `table` keeps its identity, so its state and rows are deps to re-render the parts.
  const { state } = table;
  const context = useMemo(
    () => ({ table, columnsById, view }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, state, rows, columnsById, view],
  );

  return <DataGridContext value={context}>{children}</DataGridContext>;
}
