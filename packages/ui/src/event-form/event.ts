/** Every Category, in display order. */
export const CATEGORIES = ['access', 'video', 'intrusion', 'system'] as const;

/** Every Severity, from least to most urgent. */
export const SEVERITIES = [
  'info',
  'low',
  'medium',
  'high',
  'critical',
] as const;

/** The kind of security subsystem an Event came from. */
export type Category = (typeof CATEGORIES)[number];

/** How urgently an Event needs an operator's attention. New Events default to `info`. */
export type Severity = (typeof SEVERITIES)[number];

/** A single dated occurrence; the one entity shown by both the DataGrid and the Timeline. */
export interface Event {
  /** Unique id, generated when the Event is created. */
  id: string;
  /** Short summary; never empty. */
  title: string;
  /** The absolute instant the Event happened; never in the future. */
  occurredAt: Date;
  category: Category;
  severity: Severity;
  location?: string;
  description?: string;
}

/** What the Event Form saves: every Event field except the generated `id`. */
export type EventFormValues = Omit<Event, 'id'>;
