'use client';

import { useEffect, useState } from 'react';

/** The current time, refreshed at each viewer-local midnight, so `Today` labels stay true. */
export function useToday(): Date {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const midnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );
    const timeout = setTimeout(
      () => setToday(new Date()),
      midnight.getTime() - Date.now(),
    );
    return () => clearTimeout(timeout);
  }, [today]);

  return today;
}
