import type { ReactNode } from 'react';
import { TimelineEmpty } from './timeline-empty';
import { TimelineGrid, type TimelineGridProps } from './timeline-grid';
import { TimelineRoot, type TimelineRootProps } from './timeline-root';

/** The Timeline's item-typed parts, as {@link createTimeline} returns them. */
export interface TypedTimeline<TItem> {
  Root: (props: TimelineRootProps<TItem>) => ReactNode;
  Grid: (props: TimelineGridProps<TItem>) => ReactNode;
  Empty: typeof TimelineEmpty;
}

/**
 * Returns the Timeline's parts typed to `TItem`, so `Grid`'s children receive `TItem` rather
 * than `unknown` (compound parts can't infer the Root's item type). The parts are the same
 * components as `Timeline.*`, so call it anywhere, e.g. once at module scope.
 *
 * @example
 * const EventTimeline = createTimeline<Event>();
 *
 * <EventTimeline.Root items={events} getId={getEventId} …>
 *   <EventTimeline.Grid label="Events">{(event) => event.title}</EventTimeline.Grid>
 * </EventTimeline.Root>
 */
export function createTimeline<TItem>(): TypedTimeline<TItem> {
  return {
    Root: TimelineRoot,
    // Sound: the Grid only calls `children` with the items given to Root.
    Grid: TimelineGrid as TypedTimeline<TItem>['Grid'],
    Empty: TimelineEmpty,
  };
}
