'use client';

import { Button, Checkbox, Popover, Portal, Stack } from '@chakra-ui/react';
import { useEventsView } from '../_hooks/use-events-view';
import { getEventColumnLabel } from '../_utils/event-columns';
import {
  EVENT_COLUMN_IDS,
  type EventColumnId,
} from '../_utils/events-view-params';

/**
 * Shows and hides the Events grid's columns through the URL, which the grid reads. The last
 * visible column can't be hidden.
 */
export function ColumnsPopover() {
  const [view, setView] = useEventsView();
  const visibleCount = EVENT_COLUMN_IDS.length - view.hidden.length;

  // Kept in display order, so the default set serializes to the default and leaves the URL.
  const toggle = (id: EventColumnId) =>
    setView({
      hidden: EVENT_COLUMN_IDS.filter((columnId) =>
        columnId === id
          ? !view.hidden.includes(columnId)
          : view.hidden.includes(columnId),
      ),
    });

  return (
    <Popover.Root size="xs">
      <Popover.Trigger asChild>
        <Button size="xs" variant="outline">
          Columns
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content maxW="15rem">
            <Popover.Body>
              <Stack gap="3">
                <Popover.Title textStyle="sm" fontWeight="medium">
                  Columns
                </Popover.Title>
                {EVENT_COLUMN_IDS.map((id) => {
                  const visible = !view.hidden.includes(id);
                  return (
                    <Checkbox.Root
                      key={id}
                      size="xs"
                      checked={visible}
                      disabled={visible && visibleCount === 1}
                      onCheckedChange={() => toggle(id)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>{getEventColumnLabel(id)}</Checkbox.Label>
                    </Checkbox.Root>
                  );
                })}
              </Stack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
