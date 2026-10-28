'use client';

import type { ReactTable } from '@tanstack/react-table';
import { createContext, useContext } from 'react';
import type { DataGridColumn } from './columns';
import type { Features } from './table-features';

/** A row with its type erased at the Root boundary, so the parts need no generics. */
export type ErasedRow = Record<string, unknown>;

interface DataGridContextValue {
  table: ReactTable<Features, ErasedRow>;
  columnsById: ReadonlyMap<string, DataGridColumn<ErasedRow>>;
}

export const DataGridContext = createContext<DataGridContextValue | null>(null);

export function useDataGridContext(part: string): DataGridContextValue {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error(`DataGrid.${part} must be rendered inside DataGrid.Root.`);
  }
  return context;
}
