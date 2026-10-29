import { Heading, HStack, Link, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function HomePage() {
  return (
    <Stack
      as="main"
      gap="4"
      maxWidth="40rem"
      paddingInline={{ base: '4', md: '6' }}
      paddingBlock="8"
    >
      <Heading as="h1" size="2xl">
        Event Explorer
      </Heading>
      <Text>
        100,000 security Events, browsable as a sortable, filterable grid or as
        a day-by-day timeline of the last 30 days.
      </Text>
      <HStack as="ul" gap="6" listStyleType="none">
        <li>
          <Link asChild variant="underline">
            <NextLink href="/events">Events grid</NextLink>
          </Link>
        </li>
        <li>
          <Link asChild variant="underline">
            <NextLink href="/timeline">Timeline</NextLink>
          </Link>
        </li>
      </HStack>
    </Stack>
  );
}
