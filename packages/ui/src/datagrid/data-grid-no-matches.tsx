'use client';

import type { ReactNode } from 'react';
import { useDataGridContext } from './data-grid-context';

/** Props for {@link DataGridNoMatches}. */
export interface DataGridNoMatchesProps {
  children: ReactNode;
}

/**
 * What the table shows when the filters match none of the rows. Place it inside `DataGrid.Table`; it renders its
 * children only while that state applies.
 */
export function DataGridNoMatches({ children }: DataGridNoMatchesProps) {
  const { view } = useDataGridContext('NoMatches');
  return view === 'no-matches' ? children : null;
}
