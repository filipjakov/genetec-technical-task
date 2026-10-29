'use client';

import { HStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

const VIEWS = [
  { href: '/events', label: 'Events grid' },
  { href: '/timeline', label: 'Timeline' },
];

/** Links to each view, marking the current one. Plain links: each view starts unfiltered. */
export function ViewsNav() {
  const pathname = usePathname();
  return (
    <HStack as="nav" aria-label="Views" gap="4">
      {VIEWS.map(({ href, label }) => {
        const current = pathname === href;
        return (
          <Link
            key={href}
            asChild
            fontWeight={current ? 'semibold' : 'normal'}
            textDecoration={current ? 'underline' : 'none'}
            textUnderlineOffset="4px"
          >
            <NextLink href={href} aria-current={current ? 'page' : undefined}>
              {label}
            </NextLink>
          </Link>
        );
      })}
    </HStack>
  );
}
