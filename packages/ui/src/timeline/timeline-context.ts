'use client';

import { createContext, type RefObject } from 'react';
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

/** The cursor on `entry`. */
export function cursorFor(
  entry: TimelineItemEntry,
  announceDay: boolean,
): TimelineCursor {
  return { id: entry.id, position: entry.position, announceDay };
}

/** What a Timeline's `ref` and `useTimeline()` expose. */
export interface TimelineHandle {
  /**
   * Moves focus to the remembered item, scrolling it into view: the last one focused, else
   * the newest. If that item has left `items`, it is the item now at its old position (the
   * next older, else the next newer); with no items left, `Timeline.Empty`. Focus moves once
   * React has rendered, so `items` updated in the same tick are taken into account.
   */
  focus: () => void;
}

interface TimelineContextValue {
  model: TimelineModel;
  isEmpty: boolean;
  getLabel: (item: unknown) => string;
  onItemActivate: (item: unknown) => void;
  cursor: TimelineCursor;
  setCursor: (cursor: TimelineCursor) => void;
  /** The item that takes Tab: the remembered one, else the one now at its position. */
  tabStop: TimelineItemEntry | undefined;
  /** Counts `focus()` calls; the Grid focuses the tab stop after each new one renders. */
  focusRequest: number;
  requestFocus: () => void;
  /** `Timeline.Empty`'s element, which `focus()` falls back to with no items. */
  emptyRef: RefObject<HTMLDivElement | null>;
}

export const TimelineContext = createContext<TimelineContextValue | null>(null);
