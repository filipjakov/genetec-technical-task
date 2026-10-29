import type { Event } from '@repo/ui/event-form';

/** An Event as JSON carries it: `occurredAt` is an ISO string. */
type WireEvent = Omit<Event, 'occurredAt'> & { occurredAt: string };

/** Turns a parsed wire Event into an Event in place; skips a copy per Event at 100k Events. */
function reviveEvent(wire: WireEvent): Event {
  const event = wire as unknown as Event;
  event.occurredAt = new Date(wire.occurredAt);
  return event;
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`.trim());
  }
  return (await response.json()) as T;
}

/**
 * Fetches every Event. The page's `?delay=<ms>` and `?fail=1` are forwarded to
 * the API so the loading and error states can be demoed from the address bar.
 */
export async function loadEvents(): Promise<Event[]> {
  const pageParams = new URLSearchParams(window.location.search);
  const apiParams = new URLSearchParams();
  for (const name of ['delay', 'fail']) {
    const value = pageParams.get(name);
    if (value !== null) apiParams.set(name, value);
  }
  const query = apiParams.size > 0 ? `?${apiParams}` : '';
  const wire = await readJson<WireEvent[]>(await fetch(`/api/events${query}`));
  return wire.map(reviveEvent);
}

/** Sends `event` as the JSON body and returns the server's copy. */
async function sendEvent(
  method: 'POST' | 'PATCH',
  url: string,
  event: Event,
): Promise<Event> {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  return reviveEvent(await readJson<WireEvent>(response));
}

/** Stores a new Event and returns the server's copy. */
export function postEvent(event: Event): Promise<Event> {
  return sendEvent('POST', '/api/events', event);
}

/** Replaces an existing Event and returns the server's copy. */
export function patchEvent(event: Event): Promise<Event> {
  return sendEvent(
    'PATCH',
    `/api/events/${encodeURIComponent(event.id)}`,
    event,
  );
}
