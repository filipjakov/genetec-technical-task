'use client';

import {
  Button,
  Field,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRef, useState } from 'react';
import { CategoryField } from './category-field';
import { DateTimeField, type FieldFocusHandle } from './date-time-field';
import type { Event, EventFormValues } from './event';
import {
  toEventDraft,
  toEventFormValues,
  validateEventDraft,
  type EventDraft,
} from './event-draft';
import { SeverityField } from './severity-field';

/** Props for {@link EventForm}. */
export interface EventFormProps {
  /** The Event to edit; the form adds a new Event when absent. Remount (`key`) to switch Events. */
  event?: Event;
  /** Called on a valid Save with trimmed values, empty optional fields left out. */
  onSave: (values: EventFormValues) => void;
  /** Called on Cancel; the form discards its edits. */
  onCancel: () => void;
  /** The submit button's text. Defaults to `Save`. */
  saveLabel?: string;
}

const firstError = (errors: readonly unknown[]) =>
  typeof errors[0] === 'string' ? errors[0] : undefined;

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

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) => validateEventDraft(value, new Date()),
    },
    onSubmit: ({ value }) => onSave(toEventFormValues(value)),
    onSubmitInvalid: ({ formApi }) => {
      // In form order; Severity always has a value, Location and Description never error.
      const targets: [keyof EventDraft, FieldFocusHandle | null][] = [
        ['title', titleRef.current],
        ['occurredAt', occurredAtRef.current],
        ['category', categoryRef.current],
      ];
      const invalid = targets.find(
        ([name]) => (formApi.getFieldMeta(name)?.errors.length ?? 0) > 0,
      );
      invalid?.[1]?.focus();
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
          {(field) => {
            const error = firstError(field.state.meta.errors);
            return (
              <Field.Root invalid={error !== undefined} required>
                <Field.Label>
                  Title
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  ref={titleRef}
                  name={field.name}
                  maxLength={120}
                  autoComplete="off"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <Field.ErrorText>{error}</Field.ErrorText>
              </Field.Root>
            );
          }}
        </form.Field>

        <form.Field name="occurredAt">
          {(field) => (
            <DateTimeField
              ref={occurredAtRef}
              value={field.state.value}
              onChange={field.handleChange}
              error={firstError(field.state.meta.errors)}
            />
          )}
        </form.Field>

        <form.Field name="category">
          {(field) => (
            <CategoryField
              ref={categoryRef}
              value={field.state.value}
              onChange={field.handleChange}
              error={firstError(field.state.meta.errors)}
            />
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
            <Field.Root>
              <Field.Label>Location</Field.Label>
              <Input
                name={field.name}
                autoComplete="off"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </Field.Root>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <Field.Root>
              <Field.Label>Description</Field.Label>
              <Textarea
                name={field.name}
                rows={4}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </Field.Root>
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
