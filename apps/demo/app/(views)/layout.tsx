import { Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { ClientOnly } from './_components/client-only';
import { DemoStatesLinks } from './_components/demo-states-links';
import { ViewsNav } from './_components/views-nav';
import { EventDialogViewport } from './_components/event-dialog-viewport';

/**
 * The views' shell: header with the views nav, the page, and the Demo states footer, plus
 * the Event dialog's viewport that both pages open it into.
 */
export default function ViewsLayout({ children }: { children: ReactNode }) {
  return (
    <Flex
      direction="column"
      gap="6"
      minHeight="100dvh"
      maxWidth="1600px"
      marginInline="auto"
      paddingInline={{ base: '4', md: '6' }}
      paddingBlock="4"
    >
      <Flex
        as="header"
        align="center"
        justify="space-between"
        gap="4"
        wrap="wrap"
      >
        <Heading as="h1" size="lg">
          <Link asChild color="inherit" textDecoration="none">
            <NextLink href="/">Event Explorer</NextLink>
          </Link>
        </Heading>
        <ViewsNav />
      </Flex>
      {children}
      <EventDialogViewport />
      <footer>
        {/* Client-only: its links carry the current page's URL params. */}
        <ClientOnly fallback={null}>
          <DemoStatesLinks />
        </ClientOnly>
      </footer>
    </Flex>
  );
}
