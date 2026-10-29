import type { Ref } from 'react';

/** What the Event Form calls to move focus into a field. */
export interface FieldFocusHandle {
  focus(): void;
}

/** The props every validated field of the Event Form takes. */
export interface FormFieldProps<TValue, THandle extends FieldFocusHandle> {
  value: TValue;
  onChange: (value: TValue) => void;
  error: string | undefined;
  /** What focus-first-invalid focuses. */
  ref: Ref<THandle>;
}

/** The part of a TanStack Form field that {@link toFieldProps} reads. */
interface FormFieldApi<TValue> {
  state: { value: TValue; meta: { errors: readonly unknown[] } };
  handleChange: (value: TValue) => void;
}

/** A TanStack Form field as `value`, `onChange` and its first error message. */
export function toFieldProps<TValue>(field: FormFieldApi<TValue>) {
  const [error] = field.state.meta.errors;
  return {
    value: field.state.value,
    onChange: field.handleChange,
    error: typeof error === 'string' ? error : undefined,
  };
}
