'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Catches a query error thrown by a suspending query below it and renders `fallback`.
 * Its `retry` resets the failed queries and re-renders the children, which refetch.
 */
export function QueryErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: (retry: () => void) => ReactNode;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) =>
            fallback(resetErrorBoundary)
          }
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
