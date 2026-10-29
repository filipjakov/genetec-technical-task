'use client';

import { Box, Skeleton, VisuallyHidden } from '@chakra-ui/react';
import { dayHeaderStyles, itemRowStyles } from './timeline-styles';

/** Props for {@link TimelineSkeleton}. */
export interface TimelineSkeletonProps {
  /** What assistive tech announces while it shows, e.g. `Loading Events`. */
  label: string;
  /** How many placeholder rows to draw. Defaults to 8. */
  rowCount?: number;
}

/**
 * A placeholder for `Timeline.Grid` while the items load: a day header and a few rows in the
 * Grid's frame. Render it instead of `Timeline.Root`, typically as a Suspense fallback; it
 * needs no Root.
 *
 * @example
 * <Suspense fallback={<Timeline.Skeleton label="Loading Events" />}>
 *   <EventsTimeline />
 * </Suspense>
 */
export function TimelineSkeleton({
  label,
  rowCount = 8,
}: TimelineSkeletonProps) {
  return (
    <Box role="status" aria-busy="true">
      <VisuallyHidden>{label}</VisuallyHidden>
      <Box aria-hidden="true" borderWidth="1px" rounded="md" overflow="hidden">
        <Box css={dayHeaderStyles}>
          <Skeleton width="8rem" height="3" />
        </Box>
        {Array.from({ length: rowCount }, (_, index) => (
          <Box
            key={index}
            css={itemRowStyles}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap="2"
          >
            <Skeleton width="60%" height="3" />
            <Skeleton width="35%" height="3" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
