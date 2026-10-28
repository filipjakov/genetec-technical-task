'use client';

import { Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useTimelineContext } from './timeline-context';

/** Props for {@link TimelineEmpty}. */
export interface TimelineEmptyProps {
  /** What to show. Defaults to `No events in this period`. */
  children?: ReactNode;
}

/**
 * What the Timeline shows when `items` is empty, in place of `Timeline.Grid` (which then
 * renders nothing). Place it anywhere under `Timeline.Root`; it renders only in that state.
 */
export function TimelineEmpty({ children }: TimelineEmptyProps) {
  const { model } = useTimelineContext('Empty');

  if (model.entries.length > 0) {
    return null;
  }

  return children ?? <Text color="fg.muted">No events in this period</Text>;
}
