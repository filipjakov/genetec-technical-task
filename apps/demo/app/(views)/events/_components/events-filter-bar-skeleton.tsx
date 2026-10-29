'use client';

import {
  Box,
  Field,
  Fieldset,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react';
import { ButtonSkeleton } from './button-skeleton';

const FIELDS = [
  { label: 'Title', width: '12rem' },
  { label: 'Category', width: '10rem' },
  { label: 'Severity', width: '10rem' },
  { label: 'Location', width: '12rem' },
  { label: 'Description', width: '12rem' },
];

/**
 * A placeholder for `EventsFilterBar` while it waits for the client, laid out like it (same
 * labels, widths and wrapping) so the page doesn't jump when it arrives. `actions` are the
 * labels of the trailing buttons the bar is given as children.
 */
export function EventsFilterBarSkeleton({
  actions = [],
}: {
  actions?: readonly string[];
}) {
  return (
    <Box role="status" aria-busy="true">
      <VisuallyHidden>Loading filters</VisuallyHidden>
      <Stack gap="3" align="start" aria-hidden="true">
        <Box hideFrom="lg">
          <ButtonSkeleton label="Filters" />
        </Box>
        <Flex hideBelow="lg" wrap="wrap" gap="4" align="end">
          <Fieldset.Root width="auto">
            <Fieldset.Legend textStyle="sm">Occurred</Fieldset.Legend>
            <Stack gap="1">
              {['From', 'To'].map((text) => (
                <HStack key={text} gap="2">
                  <Text width="2rem" flexShrink="0" textStyle="xs">
                    {text}
                  </Text>
                  <Skeleton height="8" width="12rem" />
                </HStack>
              ))}
            </Stack>
          </Fieldset.Root>
          {FIELDS.map(({ label, width }) => (
            <Field.Root key={label} width={width}>
              <Field.Label textStyle="xs">{label}</Field.Label>
              <Skeleton height="8" width="full" />
            </Field.Root>
          ))}
          <ButtonSkeleton label="Clear filters" />
          {actions.map((label) => (
            <ButtonSkeleton key={label} label={label} />
          ))}
        </Flex>
      </Stack>
    </Box>
  );
}
