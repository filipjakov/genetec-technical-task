'use client';

import { Button, Text } from '@chakra-ui/react';
import type { SortDirection } from './data-grid-root';

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;

const SORT_INDICATOR = { asc: '↑', desc: '↓' } as const;

interface DataGridColumnHeaderProps {
  label: string;
  sortable: boolean;
  /** The column's current direction, or `false` when it isn't the sorted column. */
  sorted: SortDirection | false;
  onSort: () => void;
}

/** One `<th>`: the label, as a sort toggle when the column is sortable. */
export function DataGridColumnHeader({
  label,
  sortable,
  sorted,
  onSort,
}: DataGridColumnHeaderProps) {
  return (
    <th
      scope="col"
      title={label}
      aria-sort={sorted ? ARIA_SORT[sorted] : undefined}
    >
      {sortable ? (
        <Button
          variant="plain"
          size="sm"
          height="auto"
          maxWidth="full"
          px="0"
          gap="1"
          fontWeight="inherit"
          onClick={onSort}
        >
          <Text as="span" truncate>
            {label}
          </Text>
          <Text
            as="span"
            aria-hidden="true"
            color={sorted ? undefined : 'fg.subtle'}
          >
            {sorted ? SORT_INDICATOR[sorted] : '↕'}
          </Text>
        </Button>
      ) : (
        label
      )}
    </th>
  );
}
