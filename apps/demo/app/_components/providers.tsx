'use client';

import { UiProvider } from '@repo/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { Toaster } from './toaster';

export function Providers({ children }: { children: ReactNode }) {
  // One client per browser session; created in state so re-renders keep it.
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <UiProvider>
        {children}
        <Toaster />
      </UiProvider>
      {/* Renders nothing in production builds. */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
