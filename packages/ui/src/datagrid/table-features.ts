import { columnVisibilityFeature, tableFeatures } from '@tanstack/react-table';

/** The TanStack Table features the DataGrid registers; module-level so it stays stable. */
export const features = tableFeatures({ columnVisibilityFeature });

export type Features = typeof features;
