import type { Event } from '@repo/ui/event-form';

/** An Event as JSON carries it: `occurredAt` is an ISO string. */
type WireEvent = Omit<Event, 'occurredAt'> & { occurredAt: string };

/** Turns a parsed wire Event into an Event in place; skips a copy per row at 100k rows. */
export function reviveEvent(wire: WireEvent): Event {
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

/** Stores a new Event and returns the server's copy. */
export async function postEvent(event: Event): Promise<Event> {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  return reviveEvent(await readJson<WireEvent>(response));
}

/** Replaces an existing Event and returns the server's copy. */
export async function patchEvent(event: Event): Promise<Event> {
  const response = await fetch(`/api/events/${encodeURIComponent(event.id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  return reviveEvent(await readJson<WireEvent>(response));
}
