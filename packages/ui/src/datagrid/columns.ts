import type { ReactNode } from 'react';

interface ColumnOptions<TRow, TValue> {
  /** Header text; also how the column is named to assistive tech and in visibility menus. */
  label: string;
  /** Start hidden. Users can show it again through `useDataGrid().columns`. */
  hidden?: boolean;
  /** Any CSS length, e.g. `'12rem'`. Defaults to `10rem`; the table scrolls horizontally when the widths overflow. */
  width?: string;
  /**
   * Renders the cell content inside a plain `<td>`. Defaults to strings and numbers as-is,
   * Dates as the viewer's local date and time, and `null`/`undefined` as empty. Keep it light:
   * it runs for every visible cell, and each Chakra component costs ~5-7 µs per render.
   */
  cell?: (value: TValue, row: TRow) => ReactNode;
}

/** A column that reads one property of the row; its `id` defaults to the key. */
export interface KeyColumn<
  TRow,
  TKey extends ColumnKey<TRow>,
> extends ColumnOptions<TRow, TRow[TKey]> {
  accessor: TKey;
  id?: string;
}

/** A column that derives its value from the row; it needs an explicit `id`. */
export interface FunctionColumn<TRow, TValue> extends ColumnOptions<
  TRow,
  TValue
> {
  accessor: (row: TRow) => TValue;
  id: string;
}

/** The string keys of `TRow`, which a {@link KeyColumn} may read. */
export type ColumnKey<TRow> = Extract<keyof TRow, string>;

/**
 * One column of a `DataGrid` over `TRow`, as `DataGrid.Root` accepts it. Build these with
 * {@link createColumns} so each column's `cell` is typed by its own accessor.
 */
export type DataGridColumn<TRow> =
  KeyColumn<TRow, ColumnKey<TRow>> | FunctionColumn<TRow, unknown>;

/** Defines one column, inferring its value type from `accessor`. */
export interface ColumnFactory<TRow> {
  <TKey extends ColumnKey<TRow>>(
    column: KeyColumn<TRow, TKey>,
  ): DataGridColumn<TRow>;
  <TValue>(column: FunctionColumn<TRow, TValue>): DataGridColumn<TRow>;
}

/**
 * Returns a column factory for rows of type `TRow`. Each call infers the column's value
 * type from its `accessor`, so `cell` receives the right type, and widens the result so
 * columns of different value types fit in one array.
 *
 * Define the columns once (at module scope or in a memo): a new array re-processes every row.
 *
 * @example
 * const col = createColumns<Event>();
 * const columns = [
 *   col({ accessor: 'title', label: 'Title', width: '16rem' }),
 *   col({ id: 'day', accessor: (event) => event.occurredAt.getDay(), label: 'Weekday' }),
 * ];
 */
export function createColumns<TRow>(): ColumnFactory<TRow> {
  // Sound: a column's `cell` is only ever called with its own accessor's value.
  return (column: object) => column as DataGridColumn<TRow>;
}

/** The column's id: its `id`, else its key accessor. */
export function getColumnId<TRow>(column: DataGridColumn<TRow>): string {
  return column.id ?? (column.accessor as string);
}
