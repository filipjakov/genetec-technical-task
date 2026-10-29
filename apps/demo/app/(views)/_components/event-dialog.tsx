'use client';

import {
  CloseButton,
  createOverlay,
  Dialog,
  Portal,
  type CreateOverlayProps,
} from '@chakra-ui/react';
import { EventForm, type Event } from '@repo/ui/event-form';
import { useCreateEvent } from '../_hooks/use-create-event';
import { useUpdateEvent } from '../_hooks/use-update-event';

const DIALOG_ID = 'event';

type EventDialogProps = {
  /** The Event to edit; the dialog adds a new Event when absent. */
  event?: Event;
};

/**
 * The Add / Edit dialog around the Event Form; a Save writes through the optimistic
 * mutations and closes it with the saved Event. It never closes on an outside click, so a
 * stray click can't drop edits, and it leaves focus to the page (`restoreFocus={false}`),
 * since the element that opened it may be gone after a save.
 */
function EventDialog({
  event,
  open,
  onOpenChange,
  onExitComplete,
}: CreateOverlayProps<Event> & EventDialogProps) {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      onExitComplete={onExitComplete}
      closeOnInteractOutside={false}
      restoreFocus={false}
      scrollBehavior="inside"
      size={{ base: 'full', md: 'md' }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{event ? 'Edit event' : 'New event'}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body paddingBottom="6">
              <EventForm
                event={event}
                onSave={(values) => {
                  let saved: Event;
                  if (event) {
                    saved = { ...values, id: event.id };
                    updateEvent(saved);
                  } else {
                    saved = createEvent(values);
                  }
                  void eventDialog.close(DIALOG_ID, saved);
                }}
                onCancel={() => void eventDialog.close(DIALOG_ID)}
              />
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

/** The dialog's store; render `eventDialog.Viewport` once, inside the query client. */
export const eventDialog = createOverlay<EventDialogProps, Event>(EventDialog);

/**
 * Opens the Event dialog: Add without an Event, else Edit. Resolves once it has finished
 * closing, with the saved Event (`undefined` after Cancel), so the caller can move focus
 * and say where the Event went.
 */
export async function openEventDialog(
  event?: Event,
): Promise<Event | undefined> {
  const saved = await eventDialog.open(DIALOG_ID, { event });
  await eventDialog.waitForExit(DIALOG_ID);
  return saved;
}
