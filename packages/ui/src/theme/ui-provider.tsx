'use client';

import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { system } from './system';

/** Props for {@link UiProvider}. */
export interface UiProviderProps {
  children: ReactNode;
}

/**
 * Supplies the `@repo/ui` theme to every component below it. Mount it once, near the root of
 * a client tree; colour mode follows the OS setting, so there is no colour-mode state to pass.
 */
export function UiProvider({ children }: UiProviderProps) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
