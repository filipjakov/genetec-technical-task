'use client';

import { useContext } from 'react';
import { TimelineContext } from './timeline-context';

/** The enclosing Root's context; throws if `part` is rendered outside `Timeline.Root`. */
export function useTimelineContext(part: string) {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error(`Timeline.${part} must be rendered inside Timeline.Root.`);
  }
  return context;
}
