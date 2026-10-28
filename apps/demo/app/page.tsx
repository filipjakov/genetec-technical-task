'use client';

// Scratch page until the demo shell slice: each component slice mounts its work here.
import { Badge, Button, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { CATEGORIES, SEVERITIES } from '@repo/ui/event-form';
import { EventsGridScratch } from './_components/events-grid-scratch';
import { EventsReadout } from './_components/events-readout';
import { EventsTimelineScratch } from './_components/events-timeline-scratch';
import { toaster } from './_components/toaster';

export default function Page() {
  return (
    <Stack as="main" gap="4" p="6">
      <Heading as="h1">Event Explorer</Heading>
      <EventsReadout />
      <EventsGridScratch />
      <EventsTimelineScratch />
      <Text color="fg.muted">
        Theme scratch page. Switch the OS colour mode to check dark.
      </Text>
      <HStack wrap="wrap">
        {SEVERITIES.map((severity) => (
          <Badge
            key={severity}
            variant="outline"
            color={`severity.${severity}`}
          >
            {severity}
          </Badge>
        ))}
      </HStack>
      <HStack wrap="wrap">
        {CATEGORIES.map((category) => (
          <Badge
            key={category}
            variant="outline"
            color={`category.${category}`}
          >
            {category}
          </Badge>
        ))}
      </HStack>
      <Button
        alignSelf="start"
        onClick={() =>
          toaster.create({
            type: 'success',
            title: 'Event saved.',
            closable: true,
            duration: 6000,
          })
        }
      >
        Show toast
      </Button>
    </Stack>
  );
}
