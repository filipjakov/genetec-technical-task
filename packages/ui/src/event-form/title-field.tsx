'use client';

import { Field, Input } from '@chakra-ui/react';
import { TITLE_MAX_LENGTH } from './event';
import type { FormFieldProps } from './form-field';

interface TitleFieldProps extends FormFieldProps<string, HTMLInputElement> {
  onBlur: () => void;
}

/** The required `Title` input of the Event Form. */
export function TitleField({
  value,
  onChange,
  onBlur,
  error,
  ref,
}: TitleFieldProps) {
  return (
    <Field.Root invalid={error !== undefined} required>
      <Field.Label>
        Title
        <Field.RequiredIndicator />
      </Field.Label>
      <Input
        ref={ref}
        name="title"
        maxLength={TITLE_MAX_LENGTH}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  );
}
