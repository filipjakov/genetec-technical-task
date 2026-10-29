'use client';

import { Box, Fieldset, HStack, SegmentGroup } from '@chakra-ui/react';
import { useId } from 'react';
import {
  isSeverity,
  SEVERITIES,
  SEVERITY_LABELS,
  type Severity,
} from './event';
import type { FieldFocusHandle, FormFieldProps } from './form-field';

type SeverityFieldProps = Pick<
  FormFieldProps<Severity, FieldFocusHandle>,
  'value' | 'onChange'
>;

const items = SEVERITIES.map((severity) => ({
  value: severity,
  label: (
    <HStack gap="1.5">
      <Box boxSize="2" borderRadius="full" bg={`severity.${severity}`} />
      {SEVERITY_LABELS[severity]}
    </HStack>
  ),
}));

/** The `Severity` choice of the Event Form; always has a value, so it never errors. */
export function SeverityField({ value, onChange }: SeverityFieldProps) {
  const legendId = useId();
  return (
    <Fieldset.Root>
      <Fieldset.Legend id={legendId}>Severity</Fieldset.Legend>
      <Fieldset.Content>
        <SegmentGroup.Root
          aria-labelledby={legendId}
          value={value}
          onValueChange={({ value: next }) => {
            if (isSeverity(next)) {
              onChange(next);
            }
          }}
          alignSelf="start"
          maxWidth="full"
          overflowX="auto"
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={items} />
        </SegmentGroup.Root>
      </Fieldset.Content>
    </Fieldset.Root>
  );
}
