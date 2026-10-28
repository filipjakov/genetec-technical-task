'use client';

import { Box, Skeleton, VisuallyHidden } from '@chakra-ui/react';
import { DataGridFrame } from './data-grid-frame';

/** Props for {@link DataGridSkeleton}. */
export interface DataGridSkeletonProps {
  /** What assistive tech announces while it shows, e.g. `Loading Events`. */
  label: string;
  /** How many placeholder rows to draw; match the grid's page size. Defaults to 50. */
  rowCount?: number;
}

/**
 * A placeholder for `DataGrid.Table` while the rows load, drawn in the same table shell so
 * the page doesn't jump when they arrive. Render it instead of `DataGrid.Root`, typically
 * as a Suspense fallback; it needs no Root.
 *
 * @example
 * <Suspense fallback={<DataGrid.Skeleton label="Loading Events" />}>
 *   <EventsGrid />
 * </Suspense>
 */
export function DataGridSkeleton({
  label,
  rowCount = 50,
}: DataGridSkeletonProps) {
  return (
    <Box role="status" aria-busy="true">
      <VisuallyHidden>{label}</VisuallyHidden>
      <DataGridFrame aria-hidden="true">
        <thead>
          <tr>
            <th>
              {/* A non-breaking space gives each bar the height of a line of text. */}
              <Skeleton width="8rem">&nbsp;</Skeleton>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, index) => (
            <tr key={index}>
              <td>
                <Skeleton>&nbsp;</Skeleton>
              </td>
            </tr>
          ))}
        </tbody>
      </DataGridFrame>
    </Box>
  );
}
