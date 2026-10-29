'use client';

import type { ReactNode } from 'react';
import { useDataGrid } from './use-data-grid';

/** Props for {@link DataGridNoMatches}. */
export interface DataGridNoMatchesProps {
  children: ReactNode;
}

/**
 * What the table shows when the filters match none of the rows. Place it inside `DataGrid.Table`; it renders its
 * children only while that state applies.
 */
export function DataGridNoMatches({ children }: DataGridNoMatchesProps) {
  const { rowCount, filteredRowCount } = useDataGrid().pagination;
  return rowCount > 0 && filteredRowCount === 0 ? children : null;
}
