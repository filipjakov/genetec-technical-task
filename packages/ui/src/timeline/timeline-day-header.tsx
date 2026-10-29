import type { TimelineDay } from './timeline-model';

/** A day header's visible text; the Grid gives it its row and styles. */
export function TimelineDayHeader({ day }: { day: TimelineDay }) {
  return (
    <>
      <span>{day.label}</span>
      <span data-part="day-count">{day.countLabel}</span>
    </>
  );
}
