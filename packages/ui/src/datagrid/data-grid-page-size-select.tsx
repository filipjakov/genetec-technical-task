'use client';

import { createListCollection, Portal, Select } from '@chakra-ui/react';
import { useMemo } from 'react';
import { clampPageSize } from './view-state';

interface DataGridPageSizeSelectProps {
  pageSizes: readonly number[];
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

/** The "Rows per page" picker of `DataGrid.Pagination`. */
export function DataGridPageSizeSelect({
  pageSizes,
  pageSize,
  onPageSizeChange,
}: DataGridPageSizeSelectProps) {
  // Sizes over the cap are dropped, and the current one is always offered so the value
  // never shows blank, even when a controlled `pageSize` isn't in `pageSizes`.
  const collection = useMemo(() => {
    const sizes = new Set([
      ...pageSizes.filter((size) => size === clampPageSize(size)),
      pageSize,
    ]);
    return createListCollection({
      items: [...sizes]
        .sort((a, b) => a - b)
        .map((size) => ({ label: String(size), value: String(size) })),
    });
  }, [pageSizes, pageSize]);

  return (
    <Select.Root
      collection={collection}
      size="sm"
      width="auto"
      flexDirection="row"
      alignItems="center"
      gap="2"
      value={[String(pageSize)]}
      onValueChange={({ value: [size] }) => {
        if (size) {
          onPageSizeChange(Number(size));
        }
      }}
    >
      <Select.HiddenSelect />
      <Select.Label whiteSpace="nowrap">Rows per page</Select.Label>
      <Select.Control width="5rem">
        <Select.Trigger>
          <Select.ValueText />
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
