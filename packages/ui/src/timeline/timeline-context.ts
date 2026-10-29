'use client';

import { createContext, useContext, type Ref } from 'react';
import type { TimelineItemEntry, TimelineModel } from './timeline-model';

/**
 * The remembered focus: the item that takes Tab, its position (taken by the next item if it
 * leaves `items`), and whether its accessible name starts with its day, because focus has
 * just crossed into that day.
 */
export interface TimelineCursor {
  id: string;
  position: number;
  announceDay: boolean;
}

/** What a Timeline's `ref` exposes. */
export interface TimelineHandle {
  /**
   * Moves focus to the remembered item, scrolling it into view: the last one focused, else
   * the newest. If that item has left `items`, it is the item now at its old position (the
   * next older, else the next newer). Does nothing while there are no items.
   */
  focus: () => void;
}

interface TimelineContextValue {
  model: TimelineModel;
  getLabel: (item: unknown) => string;
  onItemActivate: (item: unknown) => void;
  cursor: TimelineCursor;
  setCursor: (cursor: TimelineCursor) => void;
  /** The item that takes Tab: the remembered one, else the one now at its position. */
  tabStop: TimelineItemEntry | undefined;
  /** Root's `ref`, which the Grid fills, since only it can focus an item. */
  ref: Ref<TimelineHandle> | undefined;
  /** The id `Timeline.KeyHint` renders with, so the Grid can point `aria-describedby` at it. */
  keyHintId: string;
}

export const TimelineContext = createContext<TimelineContextValue | null>(null);

export function useTimelineContext(part: string): TimelineContextValue {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error(`Timeline.${part} must be rendered inside Timeline.Root.`);
  }
  return context;
}
