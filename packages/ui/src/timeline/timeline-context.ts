'use client';

import { createContext, useContext } from 'react';
import type { TimelineModel } from './timeline-model';

interface TimelineContextValue {
  model: TimelineModel;
  getLabel: (item: unknown) => string;
  onItemActivate: (item: unknown) => void;
}

export const TimelineContext = createContext<TimelineContextValue | null>(null);

export function useTimelineContext(part: string): TimelineContextValue {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error(`Timeline.${part} must be rendered inside Timeline.Root.`);
  }
  return context;
}
