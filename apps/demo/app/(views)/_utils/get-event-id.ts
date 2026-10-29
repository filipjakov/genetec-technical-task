import type { Event } from '@repo/ui/event-form';

/** An Event's id, as the DataGrid's `getRowId` and the Timeline's `getId` take it. */
export const getEventId = (event: Event) => event.id;
