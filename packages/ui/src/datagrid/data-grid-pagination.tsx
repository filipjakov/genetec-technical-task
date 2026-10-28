'use client';

import {
  ButtonGroup,
  HStack,
  IconButton,
  Pagination,
  Text,
} from '@chakra-ui/react';
import { DataGridPageSizeSelect } from './data-grid-page-size-select';
import { useDataGrid, type DataGridPaginationState } from './use-data-grid';

const DEFAULT_PAGE_SIZES = [25, 50, 100] as const;

const countFormat = new Intl.NumberFormat();

/** E.g. `1–50 of 1,234 (filtered from 100,000)`. */
function formatRange({
  pageIndex,
  pageSize,
  rowCount,
  filteredRowCount,
}: DataGridPaginationState): string {
  const filteredFrom =
    filteredRowCount < rowCount
      ? ` (filtered from ${countFormat.format(rowCount)})`
      : '';

  if (filteredRowCount === 0) {
    return `No rows${filteredFrom}`;
  }

  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, filteredRowCount);
  return `${countFormat.format(start)}–${countFormat.format(end)} of ${countFormat.format(filteredRowCount)}${filteredFrom}`;
}

/** Props for {@link DataGridPagination}. */
export interface DataGridPaginationProps {
  /** The choices in the "Rows per page" picker. Defaults to 25, 50 and 100. */
  pageSizes?: readonly number[];
}

/**
 * The grid's pager: the visible range (announced politely as it changes), a "Rows per page"
 * picker, and page buttons. Place it anywhere under `DataGrid.Root`; for a custom pager,
 * use `useDataGrid().pagination` instead.
 */
export function DataGridPagination({
  pageSizes = DEFAULT_PAGE_SIZES,
}: DataGridPaginationProps) {
  const { pagination } = useDataGrid();
  const { pageIndex, pageSize, filteredRowCount, setPageIndex, setPageSize } =
    pagination;

  return (
    <HStack justify="space-between" wrap="wrap" gap="3">
      <Text aria-live="polite" textStyle="sm" color="fg.muted">
        {formatRange(pagination)}
      </Text>
      <HStack wrap="wrap" gap="3">
        <DataGridPageSizeSelect
          pageSizes={pageSizes}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <Pagination.Root
          count={filteredRowCount}
          pageSize={pageSize}
          page={pageIndex + 1}
          onPageChange={({ page }) => setPageIndex(page - 1)}
        >
          <ButtonGroup variant="ghost" size="sm" attached={false}>
            <Pagination.PrevTrigger asChild>
              <IconButton>‹</IconButton>
            </Pagination.PrevTrigger>
            <Pagination.Items
              render={(page) => (
                <IconButton variant={{ base: 'ghost', _selected: 'outline' }}>
                  {page.value}
                </IconButton>
              )}
            />
            <Pagination.NextTrigger asChild>
              <IconButton>›</IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </HStack>
    </HStack>
  );
}
