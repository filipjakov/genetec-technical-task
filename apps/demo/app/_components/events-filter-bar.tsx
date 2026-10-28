'use client';

import { Box, Button, Flex } from '@chakra-ui/react';
import { CATEGORIES, SEVERITIES } from '@repo/ui/event-form';
import { useClearEventsFilters } from '../_hooks/use-clear-events-filters';
import { useEventsView } from '../_hooks/use-events-view';
import { ColumnsPopover } from './columns-popover';
import { DateRangeFilterInput } from './date-range-filter-input';
import { SelectFilterInput } from './select-filter-input';
import { TextFilterInput } from './text-filter-input';

/** The Events grid's filters and Columns popover, kept in the URL; the grid reads them from there. */
export function EventsFilterBar() {
  const [view, setView] = useEventsView();
  const clearFilters = useClearEventsFilters();

  return (
    <Flex as="search" wrap="wrap" gap="4" align="end">
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
          value={view.category}
          onChange={(category) => setView({ category })}
        />
      </Box>
      <Box width="10rem">
        <SelectFilterInput
          label="Severity"
          options={SEVERITIES}
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
      <ColumnsPopover />
    </Flex>
  );
}
