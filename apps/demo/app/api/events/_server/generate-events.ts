import { faker } from '@faker-js/faker/locale/en';
import { CATEGORIES, type Category, type Event } from '@repo/ui/event-form';
import { TIMELINE_WINDOW_DAYS as WINDOW_DAYS } from '../../../_utils/timeline-window';

const SEED = 20_261_027;
const EVENT_COUNT = 100_000;
const SPAN_DAYS = 300;
const WINDOW_EVENT_COUNT = 12_000;
const OLDER_INCIDENT_DAYS = 3;

const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;

const TITLES: Record<Category, readonly string[]> = {
  access: [
    'Access granted',
    'Access denied',
    'Door forced open',
    'Door held open',
    'Badge not recognised',
    'Tailgating detected',
    'Anti-passback violation',
  ],
  video: [
    'Motion detected',
    'Camera offline',
    'Camera tampering',
    'Video signal lost',
    'Loitering detected',
    'Line crossing detected',
    'Recording stopped',
  ],
  intrusion: [
    'Zone alarm',
    'Glass break detected',
    'Perimeter breach',
    'Panel armed',
    'Panel disarmed',
    'Sensor tamper',
    'Duress code entered',
  ],
  system: [
    'Server restarted',
    'Disk space low',
    'Certificate expiring',
    'Unit disconnected',
    'Firmware updated',
    'Backup completed',
    'License warning',
  ],
};

const BUILDINGS = [
  'HQ',
  'Building A',
  'Building B',
  'Warehouse',
  'Data centre',
  'Parking garage',
];

const AREAS = [
  'Main entrance',
  'Lobby',
  'Loading dock',
  'Server room',
  'Stairwell 2',
  'Floor 3 east',
  'Gate 1',
  'Roof access',
  'Cafeteria',
  'Elevator bank',
];

const DESCRIPTIONS = [
  'Operator acknowledged; no further action.',
  'Reported by the night shift guard.',
  'Recurring issue, ticket opened with facilities.',
  'Verified on video: false alarm.',
  'Escalated to the security supervisor.',
  'Patrol dispatched to check the area.',
  'Cleared after the unit was power-cycled.',
];

const SEVERITY_WEIGHTS = [
  { value: 'info', weight: 40 },
  { value: 'low', weight: 30 },
  { value: 'medium', weight: 18 },
  { value: 'high', weight: 9 },
  { value: 'critical', weight: 3 },
] as const;

/**
 * Generates the mock Event collection: always the same content for the fixed
 * seed, dated as offsets back from `now` so the Timeline Window never empties.
 * Index 0 is the newest day; no Event is less than a minute old.
 */
export function generateEvents(now: Date): Event[] {
  faker.seed(SEED);
  const counts = countsPerDay(now);
  const nowMs = now.getTime();
  const events: Event[] = [];

  counts.forEach((count, day) => {
    const dayStartMs = day * DAY_MS;
    const minOffsetMs = day === 0 ? MINUTE_MS : dayStartMs;
    for (let i = 0; i < count; i++) {
      const offsetMs = faker.number.int({
        min: minOffsetMs,
        max: dayStartMs + DAY_MS - 1,
      });
      events.push(generateEvent(nowMs - offsetMs));
    }
  });

  return events;
}

function generateEvent(occurredAtMs: number): Event {
  const category = faker.helpers.arrayElement(CATEGORIES);
  const event: Event = {
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement(TITLES[category]),
    // Seconds are kept, milliseconds dropped; flooring never moves into the future.
    occurredAt: new Date(Math.floor(occurredAtMs / 1000) * 1000),
    category,
    severity: faker.helpers.weightedArrayElement(SEVERITY_WEIGHTS),
  };
  if (faker.datatype.boolean(0.7)) {
    event.location = `${faker.helpers.arrayElement(BUILDINGS)}, ${faker.helpers.arrayElement(AREAS)}`;
  }
  if (faker.datatype.boolean(0.2)) {
    event.description = faker.helpers.arrayElement(DESCRIPTIONS);
  }
  return event;
}

/** Events per day back from `now`: the Window and the older days each get a fixed total, spread by seeded per-day weights. */
function countsPerDay(now: Date): number[] {
  const windowIncidentDay = faker.number.int({ min: 1, max: WINDOW_DAYS - 1 });
  const olderIncidentDays = new Set(
    faker.helpers.uniqueArray(
      () => faker.number.int({ min: WINDOW_DAYS, max: SPAN_DAYS - 1 }),
      OLDER_INCIDENT_DAYS,
    ),
  );

  const weights = Array.from({ length: SPAN_DAYS }, (_, day) => {
    const weekday = new Date(now.getTime() - day * DAY_MS).getDay();
    const isIncident = day === windowIncidentDay || olderIncidentDays.has(day);
    return (
      (weekday === 0 || weekday === 6 ? 0.6 : 1) *
      faker.number.float({ min: 0.7, max: 1.3 }) *
      (isIncident ? faker.number.float({ min: 2, max: 3 }) : 1)
    );
  });

  return [
    ...spread(weights.slice(0, WINDOW_DAYS), WINDOW_EVENT_COUNT),
    ...spread(weights.slice(WINDOW_DAYS), EVENT_COUNT - WINDOW_EVENT_COUNT),
  ];
}

/** Splits `total` into integers proportional to `weights` that sum to exactly `total`. */
function spread(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  let allocated = 0;
  return weights.map((weight) => {
    cumulative += weight;
    const upTo = Math.round((cumulative / sum) * total);
    const count = upTo - allocated;
    allocated = upTo;
    return count;
  });
}
