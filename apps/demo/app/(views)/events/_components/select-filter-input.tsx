'use client';

import { createListCollection, Portal, Select } from '@chakra-ui/react';
import { useMemo } from 'react';

interface SelectFilterInputProps<TOption extends string> {
  /** Every choice, in display order. */
  options: readonly TOption[];
  /** How each option reads on screen. */
  labels: Readonly<Record<TOption, string>>;
  /** The picked options; `[]` when unfiltered. */
  value: readonly TOption[];
  onChange: (value: TOption[]) => void;
  label: string;
}

/** A multi-select that matches every Event while nothing is picked. */
export function SelectFilterInput<TOption extends string>({
  options,
  labels,
  value,
  onChange,
  label,
}: SelectFilterInputProps<TOption>) {
  const collection = useMemo(
    () =>
      createListCollection({
        items: options.map((option) => ({
          value: option,
          label: labels[option],
        })),
      }),
    [options, labels],
  );

  return (
    <Select.Root
      multiple
      collection={collection}
      size="xs"
      value={[...value]}
      // The collection holds only `options`, so every picked value is one of them.
      onValueChange={({ value: selected }) => onChange(selected as TOption[])}
    >
      <Select.HiddenSelect />
      <Select.Label textStyle="xs">{label}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="All" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
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
      </Portal>
    </Select.Root>
  );
}
