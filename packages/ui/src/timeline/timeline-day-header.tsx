import type { TimelineDay } from './timeline-model';

/** A day header's height in px, in the Grid and its Skeleton. */
export const DAY_HEADER_HEIGHT = 36;

/** A day header's visible text; the Grid gives it its row and styles. */
export function TimelineDayHeader({ day }: { day: TimelineDay }) {
  return (
    <>
      <span>{day.label}</span>
      <span data-part="day-count">{day.countLabel}</span>
    </>
  );
}
