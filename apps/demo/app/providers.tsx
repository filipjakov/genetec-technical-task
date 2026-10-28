'use client';

import { UiProvider } from '@repo/ui';
import type { ReactNode } from 'react';
import { Toaster } from '../src/toaster';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UiProvider>
      {children}
      <Toaster />
    </UiProvider>
  );
}
