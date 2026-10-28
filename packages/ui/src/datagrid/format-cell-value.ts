import { formatDateTime } from '../dates';

/** The text a cell shows when its column has no `cell` renderer. */
export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return formatDateTime(value);
  return String(value);
}
