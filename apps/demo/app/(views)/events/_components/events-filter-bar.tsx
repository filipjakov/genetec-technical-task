'use client';

import { Box, Button, Flex, Stack } from '@chakra-ui/react';
import {
  CATEGORIES,
  CATEGORY_LABELS,
  SEVERITIES,
  SEVERITY_LABELS,
} from '@repo/ui/event-form';
import { useId, useState, type ReactNode } from 'react';
import { useClearEventsFilters } from '../_hooks/use-clear-events-filters';
import { useEventsView } from '../_hooks/use-events-view';
import { DateRangeFilterInput } from './date-range-filter-input';
import { SelectFilterInput } from './select-filter-input';
import { TextFilterInput } from './text-filter-input';

/**
 * The page's Event filters, kept in the URL; its view reads them from there. `children` are
 * trailing actions after Clear filters. Below `lg` the inputs collapse behind a Filters toggle
 * that always starts closed.
 */
export function EventsFilterBar({ children }: { children?: ReactNode }) {
  const [view, setView] = useEventsView();
  const clearFilters = useClearEventsFilters();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <Stack as="search" gap="3" align="start">
      <Button
        hideFrom="lg"
        size="xs"
        variant="outline"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        Filters
      </Button>
      <Flex
        id={panelId}
        display={{ base: open ? 'flex' : 'none', lg: 'flex' }}
        wrap="wrap"
        gap="4"
        align="end"
      >
        <DateRangeFilterInput
          label="Occurred"
          value={{ from: view.from, to: view.to }}
          onChange={({ from, to }) => setView({ from, to })}
        />
        <Box width="12rem">
          <TextFilterInput
            label="Title"
            value={view.title}
            onChange={(title) => setView({ title })}
          />
        </Box>
        <Box width="10rem">
          <SelectFilterInput
            label="Category"
            options={CATEGORIES}
            labels={CATEGORY_LABELS}
            value={view.category}
            onChange={(category) => setView({ category })}
          />
        </Box>
        <Box width="10rem">
          <SelectFilterInput
            label="Severity"
            options={SEVERITIES}
            labels={SEVERITY_LABELS}
            value={view.severity}
            onChange={(severity) => setView({ severity })}
          />
        </Box>
        <Box width="12rem">
          <TextFilterInput
            label="Location"
            value={view.location}
            onChange={(location) => setView({ location })}
          />
        </Box>
        <Box width="12rem">
          <TextFilterInput
            label="Description"
            value={view.description}
            onChange={(description) => setView({ description })}
          />
        </Box>
        <Button size="xs" variant="outline" onClick={clearFilters}>
          Clear filters
        </Button>
        {children}
      </Flex>
    </Stack>
  );
}
