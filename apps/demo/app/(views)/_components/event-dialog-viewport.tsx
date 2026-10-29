'use client';

import { eventDialog } from './event-dialog';

/**
 * Where the Event dialog renders. A client component, so the server layout can mount it
 * without dotting into `eventDialog`, which is only a client reference on the server.
 */
export function EventDialogViewport() {
  return <eventDialog.Viewport />;
}
