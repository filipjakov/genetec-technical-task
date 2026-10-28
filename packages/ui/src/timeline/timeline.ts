import { TimelineEmpty } from './timeline-empty';
import { TimelineGrid } from './timeline-grid';
import { TimelineRoot } from './timeline-root';
import { TimelineSkeleton } from './timeline-skeleton';

/**
 * A vertical list of dated items of any type, newest first, grouped by viewer-local day.
 * Compose its parts under `Root`; while the items load, render `Skeleton` in its place.
 * `Grid`'s children receive `unknown` items: use {@link createTimeline} to type them.
 *
 * @example
 * <Suspense fallback={<Timeline.Skeleton label="Loading Events" />}>
 *   <Timeline.Root
 *     items={events}
 *     getId={getEventId}
 *     getTimestamp={getOccurredAt}
 *     getLabel={getEventLabel}
 *     onItemActivate={openEvent}
 *   >
 *     <Timeline.Grid label="Events">{(event) => <EventRow event={event as Event} />}</Timeline.Grid>
 *     <Timeline.Empty />
 *   </Timeline.Root>
 * </Suspense>
 */
export const Timeline = {
  Root: TimelineRoot,
  Grid: TimelineGrid,
  Empty: TimelineEmpty,
  Skeleton: TimelineSkeleton,
};
