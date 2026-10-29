'use client';

import { createListCollection, Field, Select } from '@chakra-ui/react';
import { useId } from 'react';
import {
  CATEGORIES,
  CATEGORY_LABELS,
  isCategory,
  type Category,
} from './event';
import type { FormFieldProps } from './form-field';

/** `ref` is the trigger button, which focus-first-invalid targets. */
type CategoryFieldProps = FormFieldProps<Category | null, HTMLButtonElement>;

const collection = createListCollection({
  items: CATEGORIES.map((category) => ({
    value: category,
    label: CATEGORY_LABELS[category],
  })),
});

/** The required `Category` picker of the Event Form. */
export function CategoryField({
  value,
  onChange,
  error,
  ref,
}: CategoryFieldProps) {
  const errorId = useId();
  return (
    <Field.Root
      invalid={error !== undefined}
      required
      ids={{ errorText: errorId }}
    >
      <Select.Root
        collection={collection}
        value={value === null ? [] : [value]}
        onValueChange={({ value: [next] }) =>
          onChange(isCategory(next) ? next : null)
        }
        positioning={{ sameWidth: true }}
      >
        <Select.HiddenSelect />
        <Select.Label>
          Category
          <Field.RequiredIndicator />
        </Select.Label>
        <Select.Control>
          {/* Ark's Select doesn't take `aria-describedby` from the Field, so it's set here. */}
          <Select.Trigger
            ref={ref}
            aria-describedby={error === undefined ? undefined : errorId}
          >
            <Select.ValueText placeholder="Choose a category" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        {/* No Portal: inside a modal Dialog, a portalled list would sit outside its focus trap. */}
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      <Field.ErrorText>{error}</Field.ErrorText>
    </Field.Root>
  );
}
