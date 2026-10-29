'use client';

import { DateInput, Field, useDateInput } from '@chakra-ui/react';
import { CalendarDateTime } from '@internationalized/date';
import { useId, useImperativeHandle } from 'react';
import type { FieldFocusHandle, FormFieldProps } from './form-field';

/** `ref`'s `focus()` moves focus to the first segment. */
type DateTimeFieldProps = FormFieldProps<
  CalendarDateTime | null,
  FieldFocusHandle
>;

const viewerLocale = new Intl.DateTimeFormat().resolvedOptions().locale;

/** The required `Date and time` field of the Event Form, at minute granularity. */
export function DateTimeField({
  value,
  onChange,
  error,
  ref,
}: DateTimeFieldProps) {
  const errorId = useId();
  const dateInput = useDateInput({
    granularity: 'minute',
    locale: viewerLocale,
    value: value ? [value] : [],
    // No `max`: the input clamps to it on blur, which would hide the future-date message.
    onValueChange: ({ value: [next] }) =>
      onChange(next instanceof CalendarDateTime ? next : null),
    invalid: error !== undefined,
    required: true,
  });

  useImperativeHandle(ref, () => ({ focus: dateInput.focus }), [
    dateInput.focus,
  ]);

  return (
    <Field.Root
      invalid={error !== undefined}
      required
      ids={{ errorText: errorId }}
    >
      <DateInput.RootProvider value={dateInput} width="full">
        <DateInput.Label>
          Date and time
          <Field.RequiredIndicator />
        </DateInput.Label>
        <DateInput.Control>
          <DateInput.SegmentGroup
            // The segments aren't inputs, so Enter doesn't submit the form on its own.
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.closest('form')?.requestSubmit();
              }
            }}
          >
            {dateInput.getSegments().map((segment, index) => (
              <DateInput.Segment
                key={index}
                segment={segment}
                // On each segment, since focus lands on a segment, not on the group.
                aria-describedby={error === undefined ? undefined : errorId}
                aria-required={segment.type === 'literal' ? undefined : true}
              />
            ))}
          </DateInput.SegmentGroup>
        </DateInput.Control>
      </DateInput.RootProvider>
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  );
}
