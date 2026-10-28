import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './_components/providers';

export const metadata: Metadata = {
  title: 'Event Explorer',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
