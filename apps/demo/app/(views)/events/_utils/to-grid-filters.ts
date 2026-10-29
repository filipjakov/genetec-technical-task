import type { DateRange } from '@repo/ui/datagrid';
import type { Category, Severity } from '@repo/ui/event-form';
import { endOfDay, startOfDay } from './day-keys';
import type { EventsFilterValues } from './events-view-params';

/** The Events grid's filters by column id, as `DataGrid.Root` takes them. */
type EventGridFilters = {
  occurredAt: DateRange;
  title: string;
  category: Category[];
  severity: Severity[];
  location: string;
  description: string;
};

/**
 * The URL's filter values as the grid's filters, by column id; days span their whole local
 * day and text is trimmed.
 */
export function toGridFilters({
  from,
  to,
  title,
  category,
  severity,
  location,
  description,
}: EventsFilterValues): EventGridFilters {
  return {
    occurredAt: [
      from ? startOfDay(from) : undefined,
      to ? endOfDay(to) : undefined,
    ],
    title: title.trim(),
    category,
    severity,
    location: location.trim(),
    description: description.trim(),
  };
}
