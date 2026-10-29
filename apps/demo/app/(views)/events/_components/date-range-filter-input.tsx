'use client';

import {
  chakra,
  DatePicker,
  Fieldset,
  parseDate,
  Portal,
  VisuallyHidden,
  type DateValue,
} from '@chakra-ui/react';
import { useId } from 'react';
import { toDayKey } from '../_utils/day-keys';

/** Viewer-local `YYYY-MM-DD` days, both included; `null` leaves that end open. */
export interface DayRange {
  from: string | null;
  to: string | null;
}

interface DateRangeFilterInputProps {
  value: DayRange;
  onChange: (value: DayRange) => void;
  label: string;
}

// The picker's own dates carry no time zone; ours are viewer-local `YYYY-MM-DD` keys. The
// picker fills the start first, so a To-only range (from a link) shows its day as From.
const toDateValues = ({ from, to }: DayRange) =>
  [from, to].filter((key) => key !== null).map((key) => parseDate(key));
const fromDateValue = (date: DateValue) => date.toString().slice(0, 10);

/**
 * "From" and "To" inputs over a range calendar, up to today, grouped under `label`. A
 * From-only range is kept.
 */
export function DateRangeFilterInput({
  value,
  onChange,
  label,
}: DateRangeFilterInputProps) {
  const id = useId();
  const inputId = (index: number) => `${id}-input-${index}`;
  const today = new Date();

  const bounds = [
    {
      index: 0,
      text: 'From',
      indicator: <DatePicker.Trigger>📅</DatePicker.Trigger>,
    },
    {
      index: 1,
      text: 'To',
      indicator: <DatePicker.ClearTrigger>✕</DatePicker.ClearTrigger>,
    },
  ];

  return (
    <Fieldset.Root width="auto">
      <Fieldset.Legend textStyle="sm" fontWeight="medium">
        {label}
      </Fieldset.Legend>
      <DatePicker.Root
        selectionMode="range"
        ids={{ input: inputId }}
        size="xs"
        gap="1"
        max={parseDate(toDayKey(today))}
        value={toDateValues(value)}
        onValueChange={(details) => {
          const [from = null, to = null] = details.value
            .filter(Boolean)
            .map(fromDateValue);
          onChange({ from, to });
        }}
      >
        {bounds.map(({ index, text, indicator }) => (
          <DatePicker.Control key={index}>
            {/* The picker's own Label only names the first input. */}
            <chakra.label
              htmlFor={inputId(index)}
              width="2rem"
              flexShrink="0"
              textStyle="xs"
            >
              <VisuallyHidden>{label} </VisuallyHidden>
              {text}
            </chakra.label>
            <DatePicker.Input index={index} pe="7" />
            <DatePicker.IndicatorGroup>{indicator}</DatePicker.IndicatorGroup>
          </DatePicker.Control>
        ))}
        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content
              maxW="100dvw"
              w="fit-content"
              overflow="auto"
              p={{ base: '3', sm: '4' }}
            >
              <DatePicker.View view="day">
                <DatePicker.Header />
                <DatePicker.DayTable />
              </DatePicker.View>
              <DatePicker.View view="month">
                <DatePicker.Header />
                <DatePicker.MonthTable />
              </DatePicker.View>
              <DatePicker.View view="year">
                <DatePicker.Header />
                <DatePicker.YearTable />
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>
    </Fieldset.Root>
  );
}
