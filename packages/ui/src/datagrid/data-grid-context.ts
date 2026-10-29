'use client';

import type { ReactTable } from '@tanstack/react-table';
import { createContext } from 'react';
import type { ErasedRow, Features } from './table-features';

export interface DataGridContextValue {
  table: ReactTable<Features, ErasedRow>;
}

export const DataGridContext = createContext<DataGridContextValue | null>(null);
