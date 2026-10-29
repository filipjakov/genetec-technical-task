'use client';

import type { ReactNode } from 'react';
import { useDataGrid } from './use-data-grid';

/** Props for {@link DataGridEmpty}. */
export interface DataGridEmptyProps {
  children: ReactNode;
}

/**
 * What the table shows when `rows` is empty. Place it inside `DataGrid.Table`; it renders its
 * children only while that state applies.
 */
export function DataGridEmpty({ children }: DataGridEmptyProps) {
  const { rowCount } = useDataGrid().pagination;
  return rowCount === 0 ? children : null;
}
