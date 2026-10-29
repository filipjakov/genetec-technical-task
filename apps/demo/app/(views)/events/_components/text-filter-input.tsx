'use client';

import { Field, Input } from '@chakra-ui/react';

interface TextFilterInputProps {
  /** The typed text; `''` when unfiltered. */
  value: string;
  onChange: (value: string) => void;
  label: string;
}

/** A search box for a "contains" filter; the URL param it writes is debounced. */
export function TextFilterInput({
  value,
  onChange,
  label,
}: TextFilterInputProps) {
  return (
    <Field.Root>
      <Field.Label textStyle="xs">{label}</Field.Label>
      <Input
        type="search"
        size="xs"
        placeholder="Contains…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field.Root>
  );
}
