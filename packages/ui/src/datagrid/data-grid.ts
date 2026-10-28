import { DataGridEmpty } from './data-grid-empty';
import { DataGridNoMatches } from './data-grid-no-matches';
import { DataGridRoot } from './data-grid-root';
import { DataGridSkeleton } from './data-grid-skeleton';
import { DataGridTable } from './data-grid-table';

/**
 * A paginated table over in-memory rows of any type. Compose its parts under `Root`; while
 * the rows load, render `Skeleton` in its place.
 *
 * @example
 * <Suspense fallback={<DataGrid.Skeleton label="Loading Events" />}>
 *   <DataGrid.Root rows={events} getRowId={(event) => event.id} columns={columns}>
 *     <DataGrid.Table label="Events">
 *       <DataGrid.Empty>No Events yet.</DataGrid.Empty>
 *       <DataGrid.NoMatches>No Events match the filters.</DataGrid.NoMatches>
 *     </DataGrid.Table>
 *   </DataGrid.Root>
 * </Suspense>
 */
export const DataGrid = {
  Root: DataGridRoot,
  Table: DataGridTable,
  Empty: DataGridEmpty,
  NoMatches: DataGridNoMatches,
  Skeleton: DataGridSkeleton,
};
