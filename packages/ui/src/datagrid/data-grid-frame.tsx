'use client';

import { Table, type TableRootProps } from '@chakra-ui/react';
import type { Ref } from 'react';

const truncate = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

/** Props for {@link DataGridFrame}. */
interface DataGridFrameProps extends TableRootProps {
  /** The scrolling container, e.g. to reset its scroll position. */
  scrollRef?: Ref<HTMLDivElement>;
}

/**
 * The bordered, scrolling `<table>` shell shared by `DataGrid.Table` and
 * `DataGrid.Skeleton`, so the skeleton has the table's exact border, padding and row
 * heights and nothing shifts when the rows arrive. It scrolls horizontally when the columns
 * overflow and, when its parent caps its height, vertically under a sticky header row; in
 * a flex column it shrinks to the space left.
 */
export function DataGridFrame({ scrollRef, ...props }: DataGridFrameProps) {
  return (
    <Table.ScrollArea
      ref={scrollRef}
      borderWidth="1px"
      rounded="md"
      flex="0 1 auto"
      minHeight="0"
      maxHeight="full"
    >
      <Table.Root
        native
        size="sm"
        stickyHeader
        tableLayout="fixed"
        minWidth="full"
        css={{ '& th, & td': truncate }}
        {...props}
      />
    </Table.ScrollArea>
  );
}
