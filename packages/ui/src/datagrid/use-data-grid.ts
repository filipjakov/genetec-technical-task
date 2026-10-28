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

/** One column as {@link useDataGrid} returns it, e.g. for a column visibility menu. */
export interface DataGridColumnState {
  id: string;
  label: string;
  visible: boolean;
  /** Shows or hides the column. The last visible column can't be hidden. */
  toggle: () => void;
}

/** What {@link useDataGrid} returns. */
export interface DataGridApi {
  /** Every column, hidden ones included, in display order. */
  columns: DataGridColumnState[];
  pagination: DataGridPaginationState;
}

/**
 * The grid's state and controls, for custom parts such as a pager or a column visibility
 * menu. Call it anywhere under `DataGrid.Root`.
 */
export function useDataGrid(): DataGridApi {
  const { table, columnsById } = useDataGridContext('useDataGrid');
  const { pageIndex, pageSize } = table.state.pagination;
  const visibleCount = table.getVisibleLeafColumns().length;

  return {
    columns: table.getAllLeafColumns().map((column) => {
      const visible = column.getIsVisible();
      return {
        id: column.id,
        label: columnsById.get(column.id)!.label,
        visible,
        toggle: () => {
          if (visible && visibleCount === 1) return;
          column.toggleVisibility(!visible);
        },
      };
    }),
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
