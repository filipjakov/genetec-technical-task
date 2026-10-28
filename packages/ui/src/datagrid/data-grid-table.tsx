'use client';

import { VisuallyHidden } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { getColumnId } from './columns';
import { useDataGridContext } from './data-grid-context';
import { DataGridDefaultStates } from './data-grid-default-states';
import { DataGridFrame } from './data-grid-frame';
import { formatCellValue } from './format-cell-value';

const DEFAULT_COLUMN_WIDTH = '10rem';

// Until pagination lands, render only the first rows so 100k rows don't all mount.
const FIRST_PAGE_SIZE = 50;

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
 * The grid as a `<table>`: one header per visible column, then the rows or the state that
 * applies. Cells truncate with an ellipsis (the full text is in their `title`), and the
 * table scrolls horizontally inside its own container when the columns overflow.
 */
export function DataGridTable({ label, children }: DataGridTableProps) {
  const { table, columnsById, view } = useDataGridContext('Table');
  const columns = table
    .getVisibleLeafColumns()
    .map((column) => columnsById.get(column.id)!);
  const widths = columns.map((column) => column.width ?? DEFAULT_COLUMN_WIDTH);

  return (
    <DataGridFrame width={`calc(${widths.join(' + ')})`}>
      <VisuallyHidden as="caption">{label}</VisuallyHidden>
      <colgroup>
        {widths.map((width, index) => (
          <col key={index} style={{ width }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={getColumnId(column)} scope="col" title={column.label}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {view === 'rows' ? (
          // Plain cells on the hot path: Chakra style props cost ~5-7 µs each (ADR 0002).
          table
            .getRowModel()
            .rows.slice(0, FIRST_PAGE_SIZE)
            .map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const value = cell.getValue();
                  const render = columnsById.get(cell.column.id)!.cell;
                  const content = render
                    ? render(value, row.original)
                    : formatCellValue(value);
                  return (
                    <td
                      key={cell.column.id}
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
  );
}
