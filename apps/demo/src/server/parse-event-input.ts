import { CATEGORIES, SEVERITIES, type Event } from '@repo/ui/event-form';
import { z } from 'zod';

const CLOCK_SKEW_MS = 5 * 60_000;

/** Trimmed text, `undefined` when absent, null or blank. */
const optionalText = z
  .string()
  .trim()
  .nullish()
  .transform((value) => value || undefined);

function eventInputSchema(now: Date) {
  return z.object({
    id: z.uuid(),
    title: z.string().trim().min(1),
    occurredAt: z.iso
      .datetime({ offset: true })
      .transform((value) => new Date(value))
      .refine((date) => date.getTime() <= now.getTime() + CLOCK_SKEW_MS),
    category: z.enum(CATEGORIES),
    severity: z.enum(SEVERITIES),
    location: optionalText,
    description: optionalText,
  });
}

/** The parsed Event, or the names of the fields that failed. */
export type ParseEventResult =
  { ok: true; event: Event } | { ok: false; fields: (keyof Event)[] };

/**
 * Validates a request body as a full Event. Mirrors the Event Form's rules on
 * a different input shape (ISO string dates), plus a clock-skew allowance on
 * the not-in-the-future rule. Unknown keys are dropped; optional text that
 * trims to empty is omitted.
 */
export function parseEventInput(json: unknown, now: Date): ParseEventResult {
  const result = eventInputSchema(now).safeParse(json);
  if (!result.success) {
    const fields = result.error.issues.map((issue) => issue.path[0]);
    // A non-object body fails at the root (no path): every required field is missing.
    const failed = fields.includes(undefined)
      ? (['id', 'title', 'occurredAt', 'category', 'severity'] as const)
      : fields;
    return { ok: false, fields: [...new Set(failed)] as (keyof Event)[] };
  }

  const { location, description, ...required } = result.data;
  const event: Event = required;
  if (location) event.location = location;
  if (description) event.description = description;
  return { ok: true, event };
}
