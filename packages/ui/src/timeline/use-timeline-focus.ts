'use client';

import type { Virtualizer } from '@tanstack/react-virtual';
import {
  useImperativeHandle,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react';
import { flushSync } from 'react-dom';
import { useTimelineContext } from './timeline-context';
import { keyName, targetPosition } from './timeline-keys';

/**
 * The Grid's roving focus and activation, as handlers for its `role="grid"` element: keys
 * move the cursor (see `timeline-keys.ts`), focus by click or Tab follows it, Enter, Space
 * or a click activate an item, and Root's `ref` gets `focus()`. See ADR 0005.
 *
 * Relies on the Grid keeping the tab stop's row rendered, so it can always take focus.
 */
export function useTimelineFocus(
  scrollRef: RefObject<HTMLDivElement | null>,
  virtualizer: Virtualizer<HTMLDivElement, Element>,
  rowHeight: number,
) {
  const { model, onItemActivate, cursor, setCursor, tabStop, ref } =
    useTimelineContext('Grid');
  const { entries } = model;

  // Rows have fixed heights, so the tab stop can take focus before the scroll has
  // re-rendered the view.
  const focusTabStop = (index: number) => {
    virtualizer.scrollToIndex(index);
    scrollRef.current
      ?.querySelector<HTMLElement>('[data-part=cell][tabindex="0"]')
      ?.focus({ preventScroll: true });
  };

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (tabStop) {
        focusTabStop(tabStop.index);
      }
    },
  }));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = keyName(event);
    if (!tabStop || key === undefined) return;
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      onItemActivate(tabStop.item);
      return;
    }
    const viewport = scrollRef.current?.clientHeight ?? 0;
    const pageRows = Math.max(1, Math.floor(viewport / rowHeight));
    const position = targetPosition(model, tabStop, key, pageRows);
    if (position === undefined) return;
    event.preventDefault();
    const target = model.items[position]!;
    if (target === tabStop) return;
    // Commits the new tab stop now, so its row is rendered before it takes focus.
    flushSync(() =>
      setCursor({
        id: target.id,
        position: target.position,
        announceDay: target.day !== tabStop.day,
      }),
    );
    focusTabStop(target.index);
  };

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const cell = (event.target as Element).closest<HTMLElement>(
      '[data-part=cell]',
    );
    const entry = cell && entries[Number(cell.dataset.index)];
    if (entry?.kind === 'item') onItemActivate(entry.item);
  };

  // Follows focus that arrives by click or Tab; keys move the cursor before focus.
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const entry = entries[Number(event.target.dataset.index)];
    if (entry?.kind !== 'item' || entry.id === cursor.id) return;
    const fromOutside = !event.currentTarget.contains(event.relatedTarget);
    setCursor({
      id: entry.id,
      position: entry.position,
      announceDay: fromOutside || entry.day !== tabStop?.day,
    });
  };

  // Focus coming back from outside always hears its day first.
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget) || cursor.announceDay)
      return;
    setCursor({ ...cursor, announceDay: true });
  };

  return { onKeyDown, onClick, onFocus, onBlur };
}
