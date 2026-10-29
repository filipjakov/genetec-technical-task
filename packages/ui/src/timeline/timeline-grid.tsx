'use client';

import { Box } from '@chakra-ui/react';
import {
  defaultRangeExtractor,
  useVirtualizer,
  type Range,
  type VirtualItem,
} from '@tanstack/react-virtual';
import { useCallback, useId, useRef, type ReactNode } from 'react';
import { useTimelineContext } from './timeline-context';
import { DAY_HEADER_HEIGHT, TimelineDayHeader } from './timeline-day-header';
import type { TimelineDay } from './timeline-model';
import { useTimelineFocus } from './use-timeline-focus';

/** Props for {@link TimelineGrid}. */
export interface TimelineGridProps<TItem = unknown> {
  /** Names the grid for assistive tech, e.g. `Events, last 30 days`. */
  label: string;
  /** Every item row's height in px; the content is clipped to it. Defaults to 56. */
  rowHeight?: number;
  /**
   * Renders an item's row content. It is hidden from assistive tech (the row is named by
   * `getLabel`), so it must not be interactive.
   */
  children: (item: TItem) => ReactNode;
}

const DEFAULT_ROW_HEIGHT = 56;

// Plain elements styled from the container: rows re-render on every scroll frame.
const styles = {
  '& [data-part=row]': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  '& [data-part=day], & [data-part=sticky-day]': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '3',
    height: `${DAY_HEADER_HEIGHT}px`,
    paddingInline: '3',
    bg: 'bg.muted',
    borderBottomWidth: '1px',
    fontSize: 'sm',
    fontWeight: 'semibold',
  },
  '& [data-part=day-count]': {
    color: 'fg.muted',
    fontWeight: 'normal',
  },
  '& [data-part=sticky]': {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    height: 0,
  },
  '& [data-part=cell]': {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingInline: '3',
    borderBottomWidth: '1px',
    borderColor: 'border.muted',
    overflow: 'hidden',
    cursor: 'pointer',
    focusVisibleRing: 'inside',
  },
  '& [data-part=content]': {
    flex: 1,
    minWidth: 0,
  },
} as const;

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
  rowHeight = DEFAULT_ROW_HEIGHT,
  children,
}: TimelineGridProps) {
  const { model, getLabel, cursor, tabStop, keyHintId } =
    useTimelineContext('Grid');
  const { entries } = model;
  const scrollRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const headerId = (day: TimelineDay) => `${id}-${day.key}`;

  const estimateSize = useCallback(
    (index: number) =>
      entries[index]!.kind === 'header' ? DAY_HEADER_HEIGHT : rowHeight,
    [entries, rowHeight],
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

  const focusHandlers = useTimelineFocus(scrollRef, virtualizer, rowHeight);

  if (entries.length === 0) {
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
  const push = nextHeader
    ? Math.max(0, DAY_HEADER_HEIGHT - (nextHeader.start - scrollOffset))
    : 0;

  return (
    <Box
      ref={scrollRef}
      role="grid"
      aria-label={label}
      aria-rowcount={entries.length}
      aria-describedby={keyHintId}
      height="full"
      overflowY="auto"
      borderWidth="1px"
      rounded="md"
      css={styles}
      {...focusHandlers}
    >
      {topDay && (
        <div data-part="sticky" aria-hidden="true">
          <div
            data-part="sticky-day"
            style={{ transform: `translateY(${-push}px)` }}
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
                      aria-label={`${day.label}, ${day.countLabel}`}
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
                          ? `${day.label}, ${day.countLabel}. ${getLabel(entry.item)}`
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
