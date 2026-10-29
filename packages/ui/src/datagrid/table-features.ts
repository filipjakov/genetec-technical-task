import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrHas,
  filterFn_inDateRange,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  type Column,
} from '@tanstack/react-table';
import type { DataGridColumn, DataGridFilterFn } from './columns';

/** A row with its type erased at the Root boundary, so the parts need no generics. */
export type ErasedRow = Record<string, unknown>;

/** What each TanStack column carries: the `DataGridColumn` it was built from. */
interface DataGridColumnMeta {
  column: DataGridColumn<ErasedRow>;
}

/** The TanStack Table features the DataGrid registers; module-level so it stays stable. */
export const features = tableFeatures({
  columnVisibilityFeature,
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    arrHas: filterFn_arrHas,
    inDateRange: filterFn_inDateRange,
  } satisfies Record<DataGridFilterFn, unknown>,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnMeta: {} as DataGridColumnMeta,
});

export type Features = typeof features;

/** The `DataGridColumn` a TanStack column was built from. */
export function getSourceColumn(
  column: Column<Features, ErasedRow>,
): DataGridColumn<ErasedRow> {
  // Root sets `meta` on every column it builds.
  return column.columnDef.meta!.column;
}
