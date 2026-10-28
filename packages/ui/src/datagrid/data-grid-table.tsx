'use client';

import { VisuallyHidden } from '@chakra-ui/react';
import { useState, type ReactNode } from 'react';
import { getColumnId, getColumnValue } from './columns';
import { DataGridColumnHeader } from './data-grid-column-header';
import { useDataGridContext } from './data-grid-context';
import { DataGridDefaultStates } from './data-grid-default-states';
import { DataGridFrame } from './data-grid-frame';
import { formatCellValue } from './format-cell-value';

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
 * their `title`), and the table scrolls horizontally inside its own container when the
 * columns overflow.
 */
export function DataGridTable({ label, children }: DataGridTableProps) {
  const { table, columnsById } = useDataGridContext('Table');
  // Set on a header click only, so the initial sort isn't announced on mount.
  const [announcement, setAnnouncement] = useState('');

  const columns = table
    .getVisibleLeafColumns()
    .map((column) => columnsById.get(column.id)!);
  const widths = columns.map((column) => column.width ?? DEFAULT_COLUMN_WIDTH);
  const [sort] = table.state.sorting;

  const sortBy = (columnId: string, columnLabel: string) => {
    const current = sort?.id === columnId && (sort.desc ? 'desc' : 'asc');
    // none → ascending → descending → none
    const next = !current ? 'asc' : current === 'asc' ? 'desc' : false;
    table.setSorting(next ? [{ id: columnId, desc: next === 'desc' }] : []);
    table.setPageIndex(0);
    setAnnouncement(
      next
        ? `Sorted by ${columnLabel}, ${next === 'asc' ? 'ascending' : 'descending'}`
        : 'Not sorted',
    );
  };

  return (
    <>
      <DataGridFrame width={`calc(${widths.join(' + ')})`}>
        <VisuallyHidden as="caption">{label}</VisuallyHidden>
        <colgroup>
          {widths.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => {
              const id = getColumnId(column);
              return (
                <DataGridColumnHeader
                  key={id}
                  label={column.label}
                  sortable={column.sortable ?? true}
                  sorted={sort?.id === id && (sort.desc ? 'desc' : 'asc')}
                  onSort={() => sortBy(id, column.label)}
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
                  const content = column.cell
                    ? column.cell(value, row.original)
                    : formatCellValue(value);
                  return (
                    <td
                      key={getColumnId(column)}
                      title={typeof content === 'string' ? content : undefined}
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
