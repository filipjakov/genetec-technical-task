'use client';

import { Field, Input, Textarea } from '@chakra-ui/react';

interface OptionalTextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  /** A `Textarea` that keeps newlines, instead of a single-line `Input`. */
  multiline?: boolean;
}

/** An optional free-text field of the Event Form; it never errors. */
export function OptionalTextField({
  label,
  name,
  value,
  onChange,
  onBlur,
  multiline = false,
}: OptionalTextFieldProps) {
  const inputProps = {
    name,
    value,
    onBlur,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  };
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      {multiline ? (
        <Textarea rows={4} {...inputProps} />
      ) : (
        <Input autoComplete="off" {...inputProps} />
      )}
    </Field.Root>
  );
}
