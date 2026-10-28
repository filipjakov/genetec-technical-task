'use client';

import { Text } from '@chakra-ui/react';
import { DataGridEmpty } from './data-grid-empty';
import { DataGridNoMatches } from './data-grid-no-matches';

/** The states `DataGrid.Table` shows when it is given no state parts of its own. */
export function DataGridDefaultStates() {
  return (
    <>
      <DataGridEmpty>
        <Text color="fg.muted">No rows</Text>
      </DataGridEmpty>
      <DataGridNoMatches>
        <Text color="fg.muted">No matching rows</Text>
      </DataGridNoMatches>
    </>
  );
}
