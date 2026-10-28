import type { DataGridFilters } from '@repo/ui/datagrid';
import { endOfDay, startOfDay } from './day-keys';
import type { EventsFilterValues } from './events-view-params';

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
}: EventsFilterValues): DataGridFilters {
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
