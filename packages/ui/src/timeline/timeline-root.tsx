'use client';

import { useId, useMemo, useState, type ReactNode, type Ref } from 'react';
import {
  TimelineContext,
  type TimelineCursor,
  type TimelineHandle,
} from './timeline-context';
import { buildTimelineModel } from './timeline-model';

/** Props for {@link TimelineRoot}. */
export interface TimelineRootProps<TItem> {
  /** The items to show, in any order. Pass a stable array: a new one re-sorts and regroups them. */
  items: readonly TItem[];
  /** A unique, stable id per item. Pass a stable function, as for every accessor below. */
  getId: (item: TItem) => string;
  /** When the item happened; it is placed in the viewer-local day of this instant. */
  getTimestamp: (item: TItem) => Date;
  /**
   * The item's accessible name, e.g. `09:15, Door forced, high severity, access, Lobby`.
   * The rendered row content is hidden from assistive tech, so this is all it hears, plus
   * its day (`Tuesday 3 March, 14 items.`) when focus has just entered that day.
   */
  getLabel: (item: TItem) => string;
  /** Called when an item is activated with Enter, Space or a click. */
  onItemActivate: (item: TItem) => void;
  /** Words a day's item count, in its header. Defaults to `1 item` / `N items`. */
  formatCount?: (count: number) => string;
  /** Exposes `focus()`, e.g. to return focus to the Timeline when a dialog closes. */
  ref?: Ref<TimelineHandle>;
  /** The Timeline's parts, such as `Timeline.Grid`, laid out as you like. */
  children: ReactNode;
}

const defaultFormatCount = (count: number) =>
  count === 1 ? '1 item' : `${count} items`;

/**
 * Holds a Timeline's items, sorted newest-first and grouped by viewer-local day, and shares
 * them with the parts rendered inside it. Renders no markup of its own. While the items
 * load, render `Timeline.Skeleton` instead.
 *
 * It remembers which item has focus, so Tab returns to it and `focus()` (through `ref`) can
 * bring focus back, e.g. after a dialog opened from an item closes.
 *
 * @example
 * <Timeline.Root
 *   ref={timelineRef}
 *   items={events}
 *   getId={(event) => event.id}
 *   getTimestamp={(event) => event.occurredAt}
 *   getLabel={(event) => event.title}
 *   onItemActivate={openEvent}
 * >
 *   <Timeline.KeyHint activateLabel="edit" />
 *   <Timeline.Grid label="Events">{(event) => event.title}</Timeline.Grid>
 *   <Timeline.Empty />
 * </Timeline.Root>
 */
export function TimelineRoot<TItem>({
  items,
  getId,
  getTimestamp,
  getLabel,
  onItemActivate,
  formatCount = defaultFormatCount,
  ref,
  children,
}: TimelineRootProps<TItem>) {
  const model = useMemo(
    () =>
      buildTimelineModel(
        items,
        getId as (item: unknown) => string,
        getTimestamp as (item: unknown) => Date,
        formatCount,
      ),
    [items, getId, getTimestamp, formatCount],
  );

  const [cursor, setCursor] = useState<TimelineCursor>({
    id: '',
    position: 0,
    announceDay: true,
  });
  // When the remembered item leaves `items`, the one now at its old position takes Tab.
  const tabStop =
    model.itemsById.get(cursor.id) ??
    model.items[Math.min(cursor.position, model.items.length - 1)];

  const keyHintId = useId();

  const context = useMemo(
    () => ({
      model,
      getLabel: getLabel as (item: unknown) => string,
      onItemActivate: onItemActivate as (item: unknown) => void,
      cursor,
      setCursor,
      tabStop,
      ref,
      keyHintId,
    }),
    [model, getLabel, onItemActivate, cursor, tabStop, ref, keyHintId],
  );

  return <TimelineContext value={context}>{children}</TimelineContext>;
}
