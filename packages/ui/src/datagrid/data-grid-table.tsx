'use client';

import { VisuallyHidden } from '@chakra-ui/react';
import type { Column } from '@tanstack/react-table';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { getColumnId, getColumnValue } from './columns';
import { DataGridColumnHeader } from './data-grid-column-header';
import { DataGridDefaultStates } from './data-grid-default-states';
import { DataGridFrame } from './data-grid-frame';
import { formatCellValue } from './format-cell-value';
import {
  getSourceColumn,
  type ErasedRow,
  type Features,
} from './table-features';
import { useDataGridContext } from './use-data-grid-context';
import { SORT_DIRECTION_NAMES } from './view-state';

const DEFAULT_COLUMN_WIDTH = '10rem';

/** Props for {@link DataGridTable}. */
export interface DataGridTableProps {
  /** Names the table for assistive tech, as a visually hidden `<caption>`. */
  label: string;
  /**
   * The state parts: `DataGrid.Empty` and `DataGrid.NoMatches`. With neither, the table
   * shows built-in ones; with either, you own both and a missing one shows nothing.
   */
  children?: ReactNode;
}

/**
 * The grid as a `<table>`: one header per visible column, then the current page of rows or
 * the state that applies. Sortable headers are buttons that cycle ascending → descending →
 * unsorted and announce the new order. Cells truncate with an ellipsis (the full text is in
 * their `title`). The table scrolls inside its own container: horizontally when the columns
 * overflow, and vertically under a sticky header row when its parent caps its height. A new
 * page, sort or filter scrolls it back to the top.
 */
export function DataGridTable({ label, children }: DataGridTableProps) {
  const { table } = useDataGridContext('Table');
  // Set on a header click only, so the initial sort isn't announced on mount.
  const [announcement, setAnnouncement] = useState('');

  const tableColumns = table.getVisibleLeafColumns();
  const columns = tableColumns.map(getSourceColumn);
  const widths = columns.map((column) => column.width ?? DEFAULT_COLUMN_WIDTH);
  const [sort] = table.state.sorting;
  const { pageIndex, pageSize } = table.state.pagination;
  const { columnFilters } = table.state;

  // A new page, sort or filter starts at the top; editing a row keeps the scroll position.
  const scrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageIndex, pageSize, sort?.id, sort?.desc, columnFilters]);

  const sortBy = (column: Column<Features, ErasedRow>, columnLabel: string) => {
    const current = column.getIsSorted();
    // none → ascending → descending → none
    const next = !current ? 'asc' : current === 'asc' ? 'desc' : false;
    table.setSorting(next ? [{ id: column.id, desc: next === 'desc' }] : []);
    table.setPageIndex(0);
    setAnnouncement(
      next
        ? `Sorted by ${columnLabel}, ${SORT_DIRECTION_NAMES[next]}`
        : 'Not sorted',
    );
  };

  return (
    <>
      <DataGridFrame
        scrollRef={scrollRef}
        width={`calc(${widths.join(' + ')})`}
      >
        <VisuallyHidden as="caption">{label}</VisuallyHidden>
        <colgroup>
          {widths.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {tableColumns.map((column, index) => {
              const { label } = columns[index]!;
              return (
                <DataGridColumnHeader
                  key={column.id}
                  label={label}
                  sortable={column.getCanSort()}
                  sorted={column.getIsSorted()}
                  onSort={() => sortBy(column, label)}
                />
              );
            })}
          </tr>
        </thead>
        <tbody>
          {table.getRowCount() > 0 ? (
            // Plain cells on the hot path: Chakra style props cost ~5-7 µs each (ADR 0002).
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => {
                  // The raw value: the table's accessor turns `null` into `undefined` for sorting.
                  const value = getColumnValue(column, row.original);
                  const text = formatCellValue(value);
                  const content = column.cell
                    ? column.cell(value, row.original)
                    : text;
                  return (
                    <td
                      key={getColumnId(column)}
                      // A custom `cell` may truncate too; its title falls back to the value's text.
                      title={
                        (typeof content === 'string' ? content : text) ||
                        undefined
                      }
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ whiteSpace: 'normal' }}>
                {children ?? <DataGridDefaultStates />}
              </td>
            </tr>
          )}
        </tbody>
      </DataGridFrame>
      <VisuallyHidden aria-live="polite">{announcement}</VisuallyHidden>
    </>
  );
}
