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

/** How each Category reads on screen. */
export const CATEGORY_LABELS: Readonly<Record<Category, string>> = {
  access: 'Access',
  video: 'Video',
  intrusion: 'Intrusion',
  system: 'System',
};

/** How each Severity reads on screen. */
export const SEVERITY_LABELS: Readonly<Record<Severity, string>> = {
  info: 'Info',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

/** The longest `title` an Event may have, in characters. */
export const TITLE_MAX_LENGTH = 120;

/** Whether `value` is one of {@link CATEGORIES}. */
export const isCategory = (value: unknown): value is Category =>
  CATEGORIES.some((category) => category === value);

/** Whether `value` is one of {@link SEVERITIES}. */
export const isSeverity = (value: unknown): value is Severity =>
  SEVERITIES.some((severity) => severity === value);

/** A single dated occurrence; the one entity shown by both the DataGrid and the Timeline. */
export interface Event {
  /** Unique id, generated when the Event is created. */
  id: string;
  /** Short summary; never empty, at most {@link TITLE_MAX_LENGTH} characters. */
  title: string;
  /** The absolute instant the Event happened; never in the future. */
  occurredAt: Date;
  /** The subsystem it came from. */
  category: Category;
  /** How urgent it is. */
  severity: Severity;
  /** Where it happened; omitted rather than empty. */
  location?: string;
  /** Free-text detail; omitted rather than empty. */
  description?: string;
}

/** What the Event Form saves: every Event field except the generated `id`. */
export type EventFormValues = Omit<Event, 'id'>;
