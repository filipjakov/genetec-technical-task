import { formatDayLabel, toDayKey } from '../dates';

/** One Day Group: a viewer-local calendar day with at least one item. */
export interface TimelineDay {
  /** `YYYY-MM-DD`, viewer-local. */
  key: string;
  /** `Today`, `Yesterday` or e.g. `Tuesday 3 March`. */
  label: string;
  /** The day's item count, as `formatCount` words it. */
  countLabel: string;
  /** The day's position in {@link TimelineModel.days}, newest first. */
  position: number;
  /** The index of the day's header in {@link TimelineModel.entries}. */
  headerIndex: number;
  /** The positions of the day's first (newest) and last item in {@link TimelineModel.items}. */
  firstItem: number;
  lastItem: number;
}

/** An item's row in the Timeline. */
export interface TimelineItemEntry {
  kind: 'item';
  day: TimelineDay;
  item: unknown;
  id: string;
  /** The item's position in {@link TimelineModel.items}. */
  position: number;
  /** The row's index in {@link TimelineModel.entries}. */
  index: number;
}

/** A row of the Timeline: a day's header, or one item under it. */
export type TimelineEntry =
  { kind: 'header'; day: TimelineDay } | TimelineItemEntry;

/** The Timeline's rows in display order: each day's header, then its items, newest first. */
export interface TimelineModel {
  entries: TimelineEntry[];
  /** The item rows alone, in display order. */
  items: TimelineItemEntry[];
  days: TimelineDay[];
  itemsById: Map<string, TimelineItemEntry>;
}

/**
 * Sorts `items` newest-first (ties by id, so the order is stable) and groups them by
 * viewer-local day. Day labels are fixed at `now`.
 */
export function buildTimelineModel(
  items: readonly unknown[],
  getId: (item: unknown) => string,
  getTimestamp: (item: unknown) => Date,
  formatCount: (count: number) => string,
  now: Date = new Date(),
): TimelineModel {
  const sorted = items
    .map((item) => {
      const date = getTimestamp(item);
      return { item, id: getId(item), date, time: date.getTime() };
    })
    .sort(
      (a, b) => b.time - a.time || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    );

  // Sorted input, so the groups come out newest day first.
  const groups = [
    ...Map.groupBy(sorted, (row) => toDayKey(row.date)).entries(),
  ];

  let firstItem = 0;
  const days = groups.map(([key, rows], position): TimelineDay => {
    const day = {
      key,
      label: formatDayLabel(rows[0]!.date, now),
      countLabel: formatCount(rows.length),
      position,
      // Each earlier day put one header in front of its items.
      headerIndex: firstItem + position,
      firstItem,
      lastItem: firstItem + rows.length - 1,
    };
    firstItem += rows.length;
    return day;
  });

  const itemEntries = groups.flatMap(([, rows], dayPosition) =>
    rows.map(({ item, id }, i): TimelineItemEntry => {
      const day = days[dayPosition]!;
      const position = day.firstItem + i;
      return {
        kind: 'item',
        day,
        item,
        id,
        position,
        index: position + dayPosition + 1,
      };
    }),
  );

  return {
    days,
    items: itemEntries,
    entries: days.flatMap((day): TimelineEntry[] => [
      { kind: 'header', day },
      ...itemEntries.slice(day.firstItem, day.lastItem + 1),
    ]),
    itemsById: new Map(itemEntries.map((entry) => [entry.id, entry])),
  };
}
