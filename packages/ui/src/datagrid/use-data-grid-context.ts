'use client';

import { useContext } from 'react';
import {
  DataGridContext,
  type DataGridContextValue,
} from './data-grid-context';

/** The enclosing `DataGrid.Root`'s context; `part` names the caller in the error. */
export function useDataGridContext(part: string): DataGridContextValue {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error(`DataGrid.${part} must be rendered inside DataGrid.Root.`);
  }
  return context;
}
