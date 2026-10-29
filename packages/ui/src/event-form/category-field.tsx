'use client';

import { createListCollection, Field, Select } from '@chakra-ui/react';
import type { Ref } from 'react';
import { CATEGORIES, type Category } from './event';

interface CategoryFieldProps {
  value: '' | Category;
  onChange: (value: '' | Category) => void;
  error: string | undefined;
  /** The trigger button, which focus-first-invalid targets. */
  ref: Ref<HTMLButtonElement>;
}

const collection = createListCollection({
  items: CATEGORIES.map((category) => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  })),
});

const isCategory = (value: string | undefined): value is Category =>
  CATEGORIES.some((category) => category === value);

/** The required `Category` picker of the Event Form. */
export function CategoryField({
  value,
  onChange,
  error,
  ref,
}: CategoryFieldProps) {
  return (
    <Field.Root invalid={error !== undefined} required>
      <Select.Root
        collection={collection}
        value={value === '' ? [] : [value]}
        onValueChange={({ value: [next] }) =>
          onChange(isCategory(next) ? next : '')
        }
        positioning={{ sameWidth: true }}
      >
        <Select.HiddenSelect />
        <Select.Label>
          Category
          <Field.RequiredIndicator />
        </Select.Label>
        <Select.Control>
          <Select.Trigger ref={ref}>
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
