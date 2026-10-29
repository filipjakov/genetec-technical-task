'use client';

import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRef, useState } from 'react';
import { CategoryField } from './category-field';
import { DateTimeField } from './date-time-field';
import type { Event, EventFormValues } from './event';
import {
  toEventDraft,
  toEventFormValues,
  validateEventDraft,
  type EventDraft,
} from './event-draft';
import { toFieldProps, type FieldFocusHandle } from './form-field';
import { OptionalTextField } from './optional-text-field';
import { SeverityField } from './severity-field';
import { TitleField } from './title-field';

/** Props for {@link EventForm}. */
export interface EventFormProps {
  /** The Event to edit; the form adds a new Event when absent. Remount (`key`) to switch Events. */
  event?: Event;
  /**
   * Called on a valid Save with trimmed values, empty optional fields left out. Called once
   * per mount, so a second click while the dialog closes can't save twice.
   */
  onSave: (values: EventFormValues) => void;
  /** Called on Cancel; the form discards its edits. */
  onCancel: () => void;
  /** The submit button's text. Defaults to `Save`. */
  saveLabel?: string;
}

/**
 * The Add / Edit form for one Event, with controlled inputs. Nothing is validated until the
 * first Save; from then on every field revalidates as it changes. A Save with errors focuses
 * the first invalid field and calls nothing. Renders the fields and the Cancel / Save row,
 * no heading, so it fits a dialog or a page.
 *
 * Render it on the client only (e.g. in a dialog): Add starts at the current minute in the
 * viewer's locale and time zone, which server HTML can't match.
 */
export function EventForm({
  event,
  onSave,
  onCancel,
  saveLabel = 'Save',
}: EventFormProps) {
  const [defaultValues] = useState(() => toEventDraft(event, new Date()));
  const titleRef = useRef<HTMLInputElement>(null);
  const occurredAtRef = useRef<FieldFocusHandle>(null);
  const categoryRef = useRef<HTMLButtonElement>(null);
  const savedRef = useRef(false);

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) => validateEventDraft(value, new Date()),
    },
    onSubmit: ({ value }) => {
      if (savedRef.current) return;
      savedRef.current = true;
      onSave(toEventFormValues(value));
    },
    onSubmitInvalid: ({ formApi }) => {
      // In form order; Severity always has a value, Location and Description never error.
      const targets: {
        name: keyof EventDraft;
        target: FieldFocusHandle | null;
      }[] = [
        { name: 'title', target: titleRef.current },
        { name: 'occurredAt', target: occurredAtRef.current },
        { name: 'category', target: categoryRef.current },
      ];
      const invalid = targets.find(
        ({ name }) => (formApi.getFieldMeta(name)?.errors.length ?? 0) > 0,
      );
      invalid?.target?.focus();
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <Stack gap="4">
        <Text fontSize="sm" color="fg.muted">
          <Text as="span" color="fg.error" aria-hidden>
            *
          </Text>{' '}
          Required
        </Text>

        <form.Field name="title">
          {(field) => (
            <TitleField
              ref={titleRef}
              {...toFieldProps(field)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>

        <form.Field name="occurredAt">
          {(field) => (
            <DateTimeField ref={occurredAtRef} {...toFieldProps(field)} />
          )}
        </form.Field>

        <form.Field name="category">
          {(field) => (
            <CategoryField ref={categoryRef} {...toFieldProps(field)} />
          )}
        </form.Field>

        <form.Field name="severity">
          {(field) => (
            <SeverityField
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </form.Field>

        <form.Field name="location">
          {(field) => (
            <OptionalTextField
              label="Location"
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <OptionalTextField
              label="Description"
              name={field.name}
              multiline
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>

        <HStack justify="flex-end" gap="2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{saveLabel}</Button>
        </HStack>
      </Stack>
    </form>
  );
}
