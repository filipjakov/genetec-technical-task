import { defineStyle } from '@chakra-ui/react';

// How the Timeline looks. The Skeleton shares the Grid's day header and row boxes, so the
// placeholder has the Grid's shape.

/** A day header's height in px. */
export const DAY_HEADER_HEIGHT = 36;

/** An item row's height in px; the row content is clipped to it. */
export const ROW_HEIGHT = 56;

/** A day header's box, in the Grid and its Skeleton. */
export const dayHeaderStyles = defineStyle({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '3',
  height: `${DAY_HEADER_HEIGHT}px`,
  paddingInline: '3',
  bg: 'bg.muted',
  borderBottomWidth: '1px',
  fontSize: 'sm',
  fontWeight: 'semibold',
});

/** An item row's box, in the Grid and its Skeleton. */
export const itemRowStyles = defineStyle({
  height: `${ROW_HEIGHT}px`,
  paddingInline: '3',
  borderBottomWidth: '1px',
  borderColor: 'border.muted',
});

/**
 * The Grid's container styles. Its rows are plain elements styled by `data-part` from here,
 * since they re-render on every scroll frame.
 */
export const gridStyles = defineStyle({
  '& [data-part=row]': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  '& [data-part=day], & [data-part=sticky-day]': dayHeaderStyles,
  '& [data-part=day-count]': {
    color: 'fg.muted',
    fontWeight: 'normal',
  },
  '& [data-part=sticky]': {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    height: 0,
  },
  '& [data-part=cell]': {
    ...itemRowStyles,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    cursor: 'pointer',
    focusVisibleRing: 'inside',
  },
  '& [data-part=content]': {
    flex: 1,
    minWidth: 0,
  },
});
