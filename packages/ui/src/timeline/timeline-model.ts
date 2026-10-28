import { formatDayLabel, toDayKey } from '../dates';

/** One Day Group: a viewer-local calendar day with at least one item. */
export interface TimelineDay {
  /** `YYYY-MM-DD`, viewer-local. */
  key: string;
  /** `Today`, `Yesterday` or e.g. `Tuesday 3 March`. */
  label: string;
  /** The day's item count, as `formatCount` words it. */
  countLabel: string;
  /** The index of the day's header in {@link TimelineModel.entries}. */
  headerIndex: number;
}

/** A row of the Timeline: a day's header, or one item under it. */
export type TimelineEntry =
  | { kind: 'header'; day: TimelineDay }
  | { kind: 'item'; day: TimelineDay; item: unknown; id: string };

/** The Timeline's rows in display order: each day's header, then its items, newest first. */
export interface TimelineModel {
  entries: TimelineEntry[];
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

  const groups: { key: string; date: Date; rows: typeof sorted }[] = [];

  for (const row of sorted) {
    const key = toDayKey(row.date);
    const last = groups.at(-1);
    if (last?.key === key) last.rows.push(row);
    else groups.push({ key, date: row.date, rows: [row] });
  }

  const entries: TimelineEntry[] = [];
  for (const { key, date, rows } of groups) {
    const day: TimelineDay = {
      key,
      label: formatDayLabel(date, now),
      countLabel: formatCount(rows.length),
      headerIndex: entries.length,
    };
    entries.push({ kind: 'header', day });
    for (const { item, id } of rows) {
      entries.push({ kind: 'item', day, item, id });
    }
  }

  return { entries };
}
