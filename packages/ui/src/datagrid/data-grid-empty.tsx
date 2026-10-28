'use client';

import type { ReactNode } from 'react';
import { useDataGridContext } from './data-grid-context';

/** Props for {@link DataGridEmpty}. */
export interface DataGridEmptyProps {
  children: ReactNode;
}

/**
 * What the table shows when `rows` is empty. Place it inside `DataGrid.Table`; it renders its
 * children only while that state applies.
 */
export function DataGridEmpty({ children }: DataGridEmptyProps) {
  const { view } = useDataGridContext('Empty');
  return view === 'empty' ? children : null;
}
