import { Stack } from '@chakra-ui/react';
import type { Metadata } from 'next';
import { EventsTimelineSection } from './_components/events-timeline-section';

export const metadata: Metadata = { title: 'Timeline' };

export default function TimelinePage() {
  return (
    // Fills the viewport's remaining height without growing past it, so the Timeline
    // scrolls inside the page rather than the page scrolling.
    <Stack as="main" gap="4" flex="1" minHeight="0">
      <EventsTimelineSection />
    </Stack>
  );
}
