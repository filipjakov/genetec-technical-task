'use client';

import { Box, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useTimelineContext } from './use-timeline-context';

/** Props for {@link TimelineEmpty}. */
export interface TimelineEmptyProps {
  /** What to show. Defaults to `No items`. */
  children?: ReactNode;
}

/**
 * What the Timeline shows when `items` is empty, in place of `Timeline.Grid` (which then
 * renders nothing). Place it anywhere under `Timeline.Root`; it renders only in that state,
 * and takes focus from `focus()` then.
 */
export function TimelineEmpty({ children }: TimelineEmptyProps) {
  const { isEmpty, emptyRef } = useTimelineContext('Empty');

  if (!isEmpty) {
    return null;
  }

  return (
    <Box ref={emptyRef} tabIndex={-1} outline="none">
      {children ?? <Text color="fg.muted">No items</Text>}
    </Box>
  );
}
