'use client';

// Throwaway scratch Event Form for the form slice; replaced by the demo shell's dialog.
import { Button, Code, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { EventForm, type EventFormValues } from '@repo/ui/event-form';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { eventsQueryOptions } from '../_utils/events-query';
import { ClientOnly } from './client-only';
export function EventFormScratch() {
  const events = useQuery(eventsQueryOptions);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [result, setResult] = useState<EventFormValues | 'cancelled'>();
  const event = mode === 'edit' ? events.data?.[0] : undefined;

  return (
    <Stack gap="3" maxWidth="32rem">
      <Heading as="h2" size="md">
        Event Form scratch
      </Heading>
      <HStack>
        <Button
          variant={mode === 'add' ? 'solid' : 'outline'}
          onClick={() => setMode('add')}
        >
          Add
        </Button>
        <Button
          variant={mode === 'edit' ? 'solid' : 'outline'}
          disabled={!events.data?.length}
          onClick={() => setMode('edit')}
        >
          Edit first Event
        </Button>
      </HStack>
      <ClientOnly fallback={null}>
        <EventForm
          key={event?.id ?? 'new'}
          event={event}
          onSave={setResult}
          onCancel={() => setResult('cancelled')}
        />
      </ClientOnly>
      <Text fontSize="sm">Last result:</Text>
      <Code as="pre" whiteSpace="pre-wrap" p="2">
        {result === undefined
          ? '–'
          : result === 'cancelled'
            ? 'Cancelled'
            : JSON.stringify(result, null, 2)}
      </Code>
    </Stack>
  );
}
