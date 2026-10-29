import type { CalendarDateTime } from '@internationalized/date';
import type { Category, Event, EventFormValues, Severity } from './event';
import { fromFormDateTime, toFormDateTime } from './form-date-time';

/** What the Event Form holds while it is edited: unvalidated and untrimmed. */
export interface EventDraft {
  title: string;
  /** `null` while the date input is cleared; a partly cleared input keeps its last date. */
  occurredAt: CalendarDateTime | null;
  /** `null` until a Category is chosen. */
  category: Category | null;
  severity: Severity;
  location: string;
  description: string;
}

/** Form-level validation result: a message per invalid field, none for a valid draft. */
export interface EventDraftErrors {
  fields: Partial<Record<keyof EventDraft, string>>;
}

const startOfMinute = (date: Date) => {
  const minute = new Date(date);
  minute.setSeconds(0, 0);
  return minute;
};

/** The draft for editing `event`, or for a new Event at `now` (to the minute) when absent. */
export function toEventDraft(event: Event | undefined, now: Date): EventDraft {
  return {
    title: event?.title ?? '',
    occurredAt: toFormDateTime(event?.occurredAt ?? now),
    category: event?.category ?? null,
    severity: event?.severity ?? 'info',
    location: event?.location ?? '',
    description: event?.description ?? '',
  };
}

/**
 * Checks `draft` against the Event rules: a non-blank title, a complete date-time no later
 * than `now`'s minute, and a Category. Severity always has a value.
 */
export function validateEventDraft(
  draft: EventDraft,
  now: Date,
): EventDraftErrors {
  const fields: EventDraftErrors['fields'] = {};

  if (draft.title.trim() === '') {
    fields.title = 'Enter a title.';
  }

  if (draft.occurredAt === null) {
    fields.occurredAt = 'Enter a valid date and time.';
  } else if (fromFormDateTime(draft.occurredAt) > startOfMinute(now)) {
    // Compared as instants, so a wall time a DST change skips can't save a future instant.
    // Minute precision on both sides, so the current minute still passes.
    fields.occurredAt = "The date can't be in the future.";
  }

  if (draft.category === null) {
    fields.category = 'Choose a category.';
  }

  return { fields };
}

/** The values a valid `draft` saves: text trimmed, empty optional fields left out. */
export function toEventFormValues(draft: EventDraft): EventFormValues {
  if (draft.occurredAt === null || draft.category === null) {
    throw new Error('toEventFormValues: the draft is invalid');
  }
  const location = draft.location.trim();
  const description = draft.description.trim();
  return {
    title: draft.title.trim(),
    occurredAt: fromFormDateTime(draft.occurredAt),
    category: draft.category,
    severity: draft.severity,
    ...(location && { location }),
    ...(description && { description }),
  };
}
