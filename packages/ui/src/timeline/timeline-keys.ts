import type { TimelineItemEntry, TimelineModel } from './timeline-model';

type KeyEvent = Pick<
  KeyboardEvent,
  'key' | 'ctrlKey' | 'altKey' | 'metaKey' | 'shiftKey'
>;

const MOVE_KEYS = [
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'Ctrl+Home',
  'Ctrl+End',
  'PageDown',
  'PageUp',
] as const;

/** A key that moves focus, as {@link targetPosition} takes it. */
export type TimelineMoveKey = (typeof MOVE_KEYS)[number];

/** A key the Timeline handles: one that moves focus, or Enter / Space to activate. */
export type TimelineKey = TimelineMoveKey | 'Enter' | ' ';

const KEYS = new Set<string>([...MOVE_KEYS, 'Enter', ' ']);

/**
 * The key as the Timeline names it, e.g. `Ctrl+Home` (Cmd counts as Ctrl, for Mac);
 * `undefined` for a key it doesn't handle, or with Alt or Shift held.
 */
export function keyName(event: KeyEvent): TimelineKey | undefined {
  if (event.altKey || event.shiftKey) {
    return undefined;
  }

  const name = event.ctrlKey || event.metaKey ? `Ctrl+${event.key}` : event.key;
  return KEYS.has(name) ? (name as TimelineKey) : undefined;
}

/**
 * Where `key` moves focus from `current`, as a position in `model.items`. The result is
 * clamped to the list, so at an edge a key keeps focus where it is (no wrap).
 */
export function targetPosition(
  model: TimelineModel,
  current: TimelineItemEntry,
  key: TimelineMoveKey,
  pageRows: number,
): number {
  const target = unclampedTarget(model, current, key, pageRows);
  return Math.min(Math.max(target, 0), model.items.length - 1);
}

/** Left and Right move by day in time, so Left (older) goes down the list. See ADR 0005. */
function unclampedTarget(
  model: TimelineModel,
  { position, day }: TimelineItemEntry,
  key: TimelineMoveKey,
  pageRows: number,
): number {
  switch (key) {
    case 'ArrowDown':
      return position + 1;
    case 'ArrowUp':
      return position - 1;
    case 'ArrowLeft':
      return model.days[day.position + 1]?.firstPosition ?? position;
    case 'ArrowRight':
      return model.days[day.position - 1]?.firstPosition ?? position;
    case 'Home':
      return day.firstPosition;
    case 'End':
      return day.lastPosition;
    case 'Ctrl+Home':
      return 0;
    case 'Ctrl+End':
      return model.items.length - 1;
    case 'PageDown':
      return position + pageRows;
    case 'PageUp':
      return position - pageRows;
  }
}
