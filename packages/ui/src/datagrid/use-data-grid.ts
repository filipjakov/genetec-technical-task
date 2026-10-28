'use client';

import { useDataGridContext } from './data-grid-context';

/** The grid's paging state and controls, as {@link useDataGrid} returns them. */
export interface DataGridPaginationState {
  /** The zero-based current page. */
  pageIndex: number;
  /** How many pages the filtered rows fill; 0 when none match. */
  pageCount: number;
  pageSize: number;
  setPageIndex: (pageIndex: number) => void;
  /** Changes the page size, moving to the page that keeps the current top row in view. */
  setPageSize: (pageSize: number) => void;
  /** Every row passed to `DataGrid.Root`. */
  rowCount: number;
  /** The rows left after filtering, across all pages. */
  filteredRowCount: number;
}

/** What {@link useDataGrid} returns. */
export interface DataGridApi {
  pagination: DataGridPaginationState;
}

/**
 * The grid's state and controls, for custom parts such as a pager. Call it anywhere under
 * `DataGrid.Root`.
 */
export function useDataGrid(): DataGridApi {
  const { table } = useDataGridContext('useDataGrid');
  const { pageIndex, pageSize } = table.state.pagination;
  return {
    pagination: {
      pageIndex,
      pageCount: table.getPageCount(),
      pageSize,
      setPageIndex: table.setPageIndex,
      setPageSize: table.setPageSize,
      rowCount: table.getCoreRowModel().rows.length,
      filteredRowCount: table.getRowCount(),
    },
  };
}
