'use client';

import {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react';
import {
  cursorFor,
  TimelineContext,
  type TimelineCursor,
  type TimelineHandle,
} from './timeline-context';
import { buildTimelineModel } from './timeline-model';
import { useToday } from './use-today';

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
  /**
   * Exposes `focus()`, e.g. to return focus to the Timeline when a dialog closes. Parts
   * rendered under Root can call `useTimeline().focus()` instead.
   */
  ref?: Ref<TimelineHandle>;
  /** The Timeline's parts, such as `Timeline.Grid`, laid out as you like. */
  children: ReactNode;
}

const countFormat = new Intl.NumberFormat();

const defaultFormatCount = (count: number) =>
  count === 1 ? '1 item' : `${countFormat.format(count)} items`;

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
 *   <Timeline.KeyHint id="timeline-keys" activateLabel="edit" />
 *   <Timeline.Grid label="Events" describedBy="timeline-keys">{(event) => event.title}</Timeline.Grid>
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
  const today = useToday();
  const model = useMemo(
    () =>
      buildTimelineModel(
        items,
        {
          getId: getId as (item: unknown) => string,
          getTimestamp: getTimestamp as (item: unknown) => Date,
          formatCount,
        },
        today,
      ),
    [items, getId, getTimestamp, formatCount, today],
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
  // Remembers the tab stop as it now is, so a re-targeted item stays the tab stop if the
  // old one comes back, and a later removal re-targets from its current position.
  if (
    tabStop &&
    (tabStop.id !== cursor.id || tabStop.position !== cursor.position)
  ) {
    setCursor(
      cursorFor(tabStop, cursor.announceDay || tabStop.id !== cursor.id),
    );
  }

  const [focusRequest, setFocusRequest] = useState(0);
  const requestFocus = useCallback(() => setFocusRequest((n) => n + 1), []);
  useImperativeHandle(ref, () => ({ focus: requestFocus }), [requestFocus]);

  const emptyRef = useRef<HTMLDivElement>(null);

  const context = useMemo(
    () => ({
      model,
      isEmpty: model.items.length === 0,
      getLabel: getLabel as (item: unknown) => string,
      onItemActivate: onItemActivate as (item: unknown) => void,
      cursor,
      setCursor,
      tabStop,
      focusRequest,
      requestFocus,
      emptyRef,
    }),
    [
      model,
      getLabel,
      onItemActivate,
      cursor,
      tabStop,
      focusRequest,
      requestFocus,
    ],
  );

  return <TimelineContext value={context}>{children}</TimelineContext>;
}
