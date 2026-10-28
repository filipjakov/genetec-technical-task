// Created once: an `Intl.Collator` is costly to construct, and a 100k-row sort compares ~1.7M pairs.
const collator = new Intl.Collator(undefined, { numeric: true });

/** The default ascending order for a column without `compare`. */
export function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return collator.compare(String(a), String(b));
}
