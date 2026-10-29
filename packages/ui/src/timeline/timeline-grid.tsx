'use client';

import { Box } from '@chakra-ui/react';
import {
  defaultRangeExtractor,
  useVirtualizer,
  type Range,
  type VirtualItem,
} from '@tanstack/react-virtual';
import { useCallback, useId, useRef, type ReactNode } from 'react';
import { TimelineDayHeader } from './timeline-day-header';
import { DAY_HEADER_HEIGHT, gridStyles, ROW_HEIGHT } from './timeline-styles';
import type { TimelineDay } from './timeline-model';
import { useTimelineContext } from './use-timeline-context';
import { useTimelineFocus } from './use-timeline-focus';

/** Props for {@link TimelineGrid}. */
export interface TimelineGridProps<TItem = unknown> {
  /** Names the grid for assistive tech, e.g. `Events, last 30 days`. */
  label: string;
  /**
   * The ids of elements that describe the grid, as `aria-describedby`, typically a
   * `Timeline.KeyHint`'s `id`.
   */
  describedBy?: string;
  /**
   * Renders an item's row content, clipped to a fixed 56px row. It is hidden from assistive
   * tech (the row is named by `getLabel`), so it must not be interactive.
   */
  children: (item: TItem) => ReactNode;
}

/**
 * The Timeline as a one-column `role="grid"`: a `rowgroup` per day, labelled by its header
 * row (the day and its item count), then a row per item. The current day's header sticks
 * to the top while you scroll. Only the rows in view are rendered.
 *
 * One item takes Tab at a time (the last focused, else the newest). Up / Down move by item,
 * Left / Right to the older / newer day, Home / End to the day's first / last item,
 * Ctrl+Home / Ctrl+End to the first / last item, PageUp / PageDown by a screenful, and
 * Enter, Space or a click activate the item. See `Timeline.KeyHint`.
 *
 * It fills its parent's height and scrolls inside it, so give the parent a height. Renders
 * nothing when there are no items; see `Timeline.Empty`.
 */
export function TimelineGrid({
  label,
  describedBy,
  children,
}: TimelineGridProps) {
  const { model, isEmpty, getLabel, cursor, tabStop } =
    useTimelineContext('Grid');
  const { entries } = model;
  const scrollRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const headerId = (day: TimelineDay) => `${id}-${day.key}`;

  const estimateSize = useCallback(
    (index: number) =>
      entries[index]!.kind === 'header' ? DAY_HEADER_HEIGHT : ROW_HEIGHT,
    [entries],
  );
  const getItemKey = useCallback(
    (index: number) => {
      const entry = entries[index]!;
      return entry.kind === 'header' ? `day:${entry.day.key}` : entry.id;
    },
    [entries],
  );
  // Keeps the tab stop mounted wherever it is, so focus never lands on an unmounted row,
  // and the first rendered day's header and the tab stop's, so their rowgroup labels resolve.
  const rangeExtractor = useCallback(
    (range: Range) => {
      const indexes = defaultRangeExtractor(range);
      const first = entries[indexes[0]!];
      const extra = [
        first?.day.headerIndex,
        tabStop?.index,
        tabStop?.day.headerIndex,
      ];
      const all = new Set(indexes);
      for (const index of extra) if (index !== undefined) all.add(index);
      return all.size === indexes.length
        ? indexes
        : [...all].sort((a, b) => a - b);
    },
    [entries, tabStop],
  );

  // The virtualizer re-renders this component on scroll; it must not be memoized.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => scrollRef.current,
    estimateSize,
    getItemKey,
    rangeExtractor,
    overscan: 8,
    // Keeps a row scrolled to from the top out from under the sticky day header.
    scrollPaddingStart: DAY_HEADER_HEIGHT,
    useFlushSync: false,
  });

  const focusHandlers = useTimelineFocus(scrollRef, virtualizer);

  if (isEmpty) {
    return null;
  }

  const virtualItems = virtualizer.getVirtualItems();
  const groups: { day: TimelineDay; rows: VirtualItem[] }[] = [];
  for (const virtualItem of virtualItems) {
    const { day } = entries[virtualItem.index]!;
    const last = groups.at(-1);
    if (last?.day === day) last.rows.push(virtualItem);
    else groups.push({ day, rows: [virtualItem] });
  }

  // The sticky header shows the day at the top of the view, pushed up by the next one.
  const scrollOffset = virtualizer.scrollOffset ?? 0;
  const top = virtualItems.find((item) => item.end > scrollOffset);
  const topDay = top && entries[top.index]!.day;
  const nextHeader =
    top &&
    virtualItems.find(
      (item) =>
        item.index > top.index && entries[item.index]!.kind === 'header',
    );
  const stickyOffset = nextHeader
    ? Math.max(0, DAY_HEADER_HEIGHT - (nextHeader.start - scrollOffset))
    : 0;

  return (
    <Box
      ref={scrollRef}
      role="grid"
      aria-label={label}
      aria-rowcount={entries.length}
      aria-describedby={describedBy}
      height="full"
      overflowY="auto"
      borderWidth="1px"
      rounded="md"
      css={gridStyles}
      {...focusHandlers}
    >
      {topDay && (
        <div data-part="sticky" aria-hidden="true">
          <div
            data-part="sticky-day"
            style={{ transform: `translateY(${-stickyOffset}px)` }}
          >
            <TimelineDayHeader day={topDay} />
          </div>
        </div>
      )}
      <div style={{ position: 'relative', height: virtualizer.getTotalSize() }}>
        {groups.map(({ day, rows }) => (
          <div key={day.key} role="rowgroup" aria-labelledby={headerId(day)}>
            {rows.map((virtualItem) => {
              const entry = entries[virtualItem.index]!;
              return (
                <div
                  key={virtualItem.key}
                  data-part="row"
                  role="row"
                  aria-rowindex={virtualItem.index + 1}
                  style={{
                    height: virtualItem.size,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {entry.kind === 'header' ? (
                    <div
                      data-part="day"
                      role="rowheader"
                      id={headerId(day)}
                      aria-label={day.accessibleName}
                    >
                      <TimelineDayHeader day={day} />
                    </div>
                  ) : (
                    <div
                      data-part="cell"
                      data-index={virtualItem.index}
                      role="gridcell"
                      tabIndex={entry === tabStop ? 0 : -1}
                      aria-label={
                        entry === tabStop && cursor.announceDay
                          ? `${day.accessibleName}. ${getLabel(entry.item)}`
                          : getLabel(entry.item)
                      }
                    >
                      <div data-part="content" aria-hidden="true">
                        {children(entry.item)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Box>
  );
}
