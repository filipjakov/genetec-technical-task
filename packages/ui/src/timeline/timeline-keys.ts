import type { TimelineItemEntry, TimelineModel } from './timeline-model';

type KeyEvent = Pick<
  KeyboardEvent,
  'key' | 'ctrlKey' | 'altKey' | 'metaKey' | 'shiftKey'
>;

/** The key as {@link targetPosition} names it, e.g. `Ctrl+Home`; `undefined` with Alt, Meta or Shift held. */
export function keyName(event: KeyEvent): string | undefined {
  if (event.altKey || event.metaKey || event.shiftKey) {
    return undefined;
  }

  return event.ctrlKey ? `Ctrl+${event.key}` : event.key;
}

/**
 * Where `key` moves focus from `current`, as a position in `model.items`; `undefined` for a
 * key the Timeline doesn't handle. The result is clamped to the list, so at an edge a key
 * keeps focus where it is (no wrap).
 */
export function targetPosition(
  model: TimelineModel,
  current: TimelineItemEntry,
  key: string,
  pageRows: number,
): number | undefined {
  const target = move(model, current, key, pageRows);

  if (target === undefined) {
    return undefined;
  }

  return Math.min(Math.max(target, 0), model.items.length - 1);
}

/** Left and Right move by day in time, so Left (older) goes down the list. See ADR 0005. */
function move(
  model: TimelineModel,
  { position, day }: TimelineItemEntry,
  key: string,
  pageRows: number,
): number | undefined {
  switch (key) {
    case 'ArrowDown':
      return position + 1;
    case 'ArrowUp':
      return position - 1;
    case 'ArrowLeft':
      return model.days[day.position + 1]?.firstItem ?? position;
    case 'ArrowRight':
      return model.days[day.position - 1]?.firstItem ?? position;
    case 'Home':
      return day.firstItem;
    case 'End':
      return day.lastItem;
    case 'Ctrl+Home':
      return 0;
    case 'Ctrl+End':
      return model.items.length - 1;
    case 'PageDown':
      return position + pageRows;
    case 'PageUp':
      return position - pageRows;
    default:
      return undefined;
  }
}
