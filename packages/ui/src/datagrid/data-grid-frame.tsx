'use client';

import { Table, type TableRootProps } from '@chakra-ui/react';

const truncate = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

/**
 * The bordered, horizontally scrolling `<table>` shell shared by `DataGrid.Table` and
 * `DataGrid.Skeleton`, so the skeleton has the table's exact border, padding and row
 * heights and nothing shifts when the rows arrive.
 */
export function DataGridFrame(props: TableRootProps) {
  return (
    <Table.ScrollArea borderWidth="1px" rounded="md">
      <Table.Root
        native
        size="sm"
        tableLayout="fixed"
        minWidth="full"
        css={{ '& th, & td': truncate }}
        {...props}
      />
    </Table.ScrollArea>
  );
}
