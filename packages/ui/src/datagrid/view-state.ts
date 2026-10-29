/** A sort direction: `asc` puts the smallest value first. */
export type SortDirection = 'asc' | 'desc';

/** How assistive tech names each direction, as in `aria-sort`. */
export const SORT_DIRECTION_NAMES = {
  asc: 'ascending',
  desc: 'descending',
} as const satisfies Record<SortDirection, string>;

/** The column the rows are sorted by, and in which direction. */
export interface DataGridSort {
  columnId: string;
  direction: SortDirection;
}

/** The current page and its size. */
export interface DataGridPageState {
  /** Zero-based. */
  pageIndex: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 50;

/** The most body rows the grid mounts at once (ADR 0003). */
export const MAX_PAGE_SIZE = 100;

/** Keeps a page size between 1 and {@link MAX_PAGE_SIZE}. */
export function clampPageSize(pageSize: number): number {
  return Math.min(Math.max(1, Math.floor(pageSize)), MAX_PAGE_SIZE);
}
