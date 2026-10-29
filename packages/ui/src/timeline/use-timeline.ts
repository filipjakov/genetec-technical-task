'use client';

import type { TimelineHandle } from './timeline-context';
import { useTimelineContext } from './use-timeline-context';

/**
 * The enclosing Timeline's `focus()`, as Root's `ref` exposes it, for components rendered
 * under `Timeline.Root`.
 */
export function useTimeline(): TimelineHandle {
  const { requestFocus } = useTimelineContext('useTimeline');
  return { focus: requestFocus };
}
