'use client';

import { Button, Skeleton } from '@chakra-ui/react';

/** A real `xs` outline button under the skeleton, so the placeholder has its exact size. */
export function ButtonSkeleton({ label }: { label: string }) {
  return (
    <Skeleton>
      <Button size="xs" variant="outline" tabIndex={-1}>
        {label}
      </Button>
    </Skeleton>
  );
}
