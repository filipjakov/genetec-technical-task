import type { NextRequest } from 'next/server';
import { update } from '../../../../src/server/events-db';
import { parseEventInput } from '../../../../src/server/parse-event-input';

export const dynamic = 'force-dynamic';

/** Replaces an Event with a full Event body whose id matches the path. */
export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<'/api/events/[id]'>,
) {
  const { id } = await ctx.params;
  const json: unknown = await request.json().catch(() => undefined);
  const result = parseEventInput(json, new Date());
  if (!result.ok || result.event.id !== id) {
    return Response.json(
      { error: 'Invalid Event', fields: result.ok ? ['id'] : result.fields },
      { status: 400 },
    );
  }
  const updated = update(result.event);
  if (!updated) {
    return Response.json({ error: `Event ${id} not found` }, { status: 404 });
  }
  return Response.json(updated);
}
