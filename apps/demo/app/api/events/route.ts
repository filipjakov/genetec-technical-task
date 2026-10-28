import type { NextRequest } from 'next/server';
import { create, list } from './_server/events-db';
import { parseEventInput } from './_server/parse-event-input';

// `now` dates the generated Events and bounds validation, so never cache.
export const dynamic = 'force-dynamic';

const MAX_DELAY_MS = 10_000;

/** Every Event. `?delay=<ms>` (capped 10 s) and `?fail=1` simulate a slow or failing load. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const delayMs = Math.min(Number(params.get('delay')) || 0, MAX_DELAY_MS);
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  if (params.get('fail') === '1') {
    return Response.json({ error: 'Simulated failure' }, { status: 500 });
  }
  return Response.json(list());
}

/** Creates an Event from a full Event body, client-generated id included. */
export async function POST(request: NextRequest) {
  const json: unknown = await request.json().catch(() => undefined);
  const result = parseEventInput(json, new Date());
  if (!result.ok) {
    return Response.json(
      { error: 'Invalid Event', fields: result.fields },
      { status: 400 },
    );
  }
  const created = create(result.event);
  if (!created) {
    return Response.json(
      { error: `Event ${result.event.id} already exists` },
      { status: 409 },
    );
  }
  return Response.json(created, { status: 201 });
}
