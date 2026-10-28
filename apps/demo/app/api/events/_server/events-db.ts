import 'server-only';
import type { Event } from '@repo/ui/event-form';
import { generateEvents } from './generate-events';

// Cached on globalThis so dev HMR keeps the store; it resets only on server restart.
const globalStore = globalThis as typeof globalThis & { eventsDb?: Event[] };

function events(): Event[] {
  globalStore.eventsDb ??= generateEvents(new Date());
  return globalStore.eventsDb;
}

/** Every stored Event, generated on first access. */
export function list(): readonly Event[] {
  return events();
}

/** Stores a new Event; returns `null` when its id is already taken. */
export function create(event: Event): Event | null {
  const all = events();
  if (all.some((stored) => stored.id === event.id)) return null;
  all.push(event);
  return event;
}

/** Replaces the Event with the same id; returns `null` when there is none. */
export function update(event: Event): Event | null {
  const all = events();
  const index = all.findIndex((stored) => stored.id === event.id);
  if (index === -1) return null;
  all[index] = event;
  return event;
}
