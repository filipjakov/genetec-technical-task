'use client';

import { HStack, Link, Text } from '@chakra-ui/react';
import { usePathname, useSearchParams } from 'next/navigation';

const STATES: { label: string; params: Record<string, string> }[] = [
  { label: 'Normal', params: {} },
  { label: 'Slow load', params: { delay: '3000' } },
  { label: 'Failing load', params: { fail: '1' } },
];

/**
 * Reloads the current page with a slow or failing Events load, keeping its view params. Full
 * page loads, since the Events are loaded once per page load.
 */
export function DemoStatesLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefFor = (params: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    next.delete('delay');
    next.delete('fail');
    for (const [name, value] of Object.entries(params)) {
      next.set(name, value);
    }

    return next.size > 0 ? `${pathname}?${next}` : pathname;
  };

  return (
    <HStack gap="3" wrap="wrap" textStyle="sm">
      <Text color="fg.muted">Demo states:</Text>
      {STATES.map(({ label, params }) => (
        <Link key={label} href={hrefFor(params)} variant="underline">
          {label}
        </Link>
      ))}
    </HStack>
  );
}
