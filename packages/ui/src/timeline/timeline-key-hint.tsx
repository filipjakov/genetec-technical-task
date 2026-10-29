'use client';

import { Kbd, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useTimelineContext } from './use-timeline-context';

/** Props for {@link TimelineKeyHint}. */
export interface TimelineKeyHintProps {
  /** The hint's element id; pass it to `Timeline.Grid`'s `describedBy` to describe the grid. */
  id?: string;
  /** What one item is called, after `↑↓`. Defaults to `item`. */
  itemNoun?: string;
  /** What Enter does, e.g. `edit`. Defaults to `open`. */
  activateLabel?: string;
  /** Replaces the whole hint, e.g. to translate it. */
  children?: ReactNode;
}

/**
 * A visible line of the Timeline's keys, `↑↓ item · ← older day · newer day → · Enter open`,
 * which can also be `Timeline.Grid`'s accessible description (see `describedBy`). Place it anywhere under
 * `Timeline.Root`; it renders nothing while there are no items.
 */
export function TimelineKeyHint({
  id,
  itemNoun = 'item',
  activateLabel = 'open',
  children,
}: TimelineKeyHintProps) {
  const { isEmpty } = useTimelineContext('KeyHint');

  if (isEmpty) {
    return null;
  }

  // `Kbd` adds no text, so the Grid's accessible description still reads as one plain line.
  return (
    <Text id={id} fontSize="sm" color="fg.muted">
      {children ?? (
        <>
          <Kbd size="sm">↑↓</Kbd> {itemNoun} · <Kbd size="sm">←</Kbd> older day
          · newer day <Kbd size="sm">→</Kbd> · <Kbd size="sm">Enter</Kbd>{' '}
          {activateLabel}
        </>
      )}
    </Text>
  );
}
