'use client';

import { Kbd, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useTimelineContext } from './timeline-context';

/** Props for {@link TimelineKeyHint}. */
export interface TimelineKeyHintProps {
  /** What one item is called, after `↑↓`. Defaults to `item`. */
  itemNoun?: string;
  /** What Enter does, e.g. `edit`. Defaults to `open`. */
  activateLabel?: string;
  /** Replaces the whole hint, e.g. to translate it. */
  children?: ReactNode;
}

/**
 * A visible line of the Timeline's keys, `↑↓ item · ← older day · newer day → · Enter open`,
 * which `Timeline.Grid` also uses as its accessible description. Place it anywhere under
 * `Timeline.Root`; it renders nothing while there are no items.
 */
export function TimelineKeyHint({
  itemNoun = 'item',
  activateLabel = 'open',
  children,
}: TimelineKeyHintProps) {
  const { model, keyHintId } = useTimelineContext('KeyHint');

  if (model.entries.length === 0) {
    return null;
  }

  // `Kbd` adds no text, so the Grid's accessible description still reads as one plain line.
  return (
    <Text id={keyHintId} fontSize="sm" color="fg.muted">
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
