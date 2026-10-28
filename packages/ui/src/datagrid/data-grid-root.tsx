'use client';

import { useTable, type ColumnDef } from '@tanstack/react-table';
import { useMemo, type ReactNode } from 'react';
import { getColumnId, type DataGridColumn } from './columns';
import {
  DataGridContext,
  type DataGridView,
  type ErasedRow,
} from './data-grid-context';
import { features, type Features } from './table-features';

/** Props for {@link DataGridRoot}. */
export interface DataGridRootProps<TRow extends object> {
  /** Every row; the grid processes them in memory. Pass a stable array. */
  rows: readonly TRow[];
  /** A unique, stable id per row. */
  getRowId: (row: TRow) => string;
  /** The columns, in display order; see `createColumns`. Pass a stable array. */
  columns: readonly DataGridColumn<TRow>[];
  /** The grid's parts, such as `DataGrid.Table`, laid out as you like. */
  children: ReactNode;
}

function toColumnDef(
  column: DataGridColumn<ErasedRow>,
): ColumnDef<Features, ErasedRow, unknown> {
  const { accessor } = column;
  return {
    id: getColumnId(column),
    accessorFn:
      typeof accessor === 'function' ? accessor : (row) => row[accessor],
  };
}

/**
 * Holds a grid's rows, columns and state, and shares them with the parts rendered inside
 * it. Renders no markup of its own. It needs its rows: while they load, render
 * `DataGrid.Skeleton` instead (e.g. as a Suspense fallback), and handle load errors outside it.
 *
 * @example
 * <DataGrid.Root rows={events} getRowId={(event) => event.id} columns={columns}>
 *   <DataGrid.Table label="Events" />
 * </DataGrid.Root>
 */
export function DataGridRoot<TRow extends object>({
  rows,
  getRowId,
  columns,
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
    initialState: {
      columnVisibility: Object.fromEntries(
        erasedColumns
          .filter((column) => column.hidden)
          .map((column) => [getColumnId(column), false]),
      ),
    },
  });

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
