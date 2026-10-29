'use client';

import { DateInput, Field, useDateInput } from '@chakra-ui/react';
import { CalendarDateTime } from '@internationalized/date';
import { useId, useImperativeHandle, type Ref } from 'react';

/** What the Event Form calls to move focus into a field. */
export interface FieldFocusHandle {
  focus(): void;
}

interface DateTimeFieldProps {
  value: CalendarDateTime | null;
  onChange: (value: CalendarDateTime | null) => void;
  error: string | undefined;
  /** `focus()` moves focus to the first segment. */
  ref: Ref<FieldFocusHandle>;
}

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
          <DateInput.Segments
            aria-describedby={error === undefined ? undefined : errorId}
          />
        </DateInput.Control>
      </DateInput.RootProvider>
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  );
}
