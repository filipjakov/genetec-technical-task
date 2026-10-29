'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

const subscribe = () => () => {};

/**
 * Renders `fallback` on the server and during hydration, then `children`. Wraps the
 * Event-reading sections: their suspending query reads `window` and must not run (or
 * serialise 100k Events into the HTML) on the server.
 */
export function ClientOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return isClient ? children : fallback;
}
