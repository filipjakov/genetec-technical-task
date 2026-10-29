# The Timeline is a one-column grid, and Left / Right jump between days

The Timeline follows the APG grid pattern with a single column: `role="grid"`, a `rowgroup` per Day Group labelled by its header row, and one `row` > `gridcell` per item, with `aria-rowcount` / `aria-rowindex` so position survives virtualization. One cell takes Tab at a time (roving tabindex, tracked by item id). Up / Down move by item across days; Left / Right move to the older / newer day's newest item. Because Left and Right follow time, Left goes *down* the screen. A one-column grid has no horizontal movement for them to conflict with. Home / End stay within the day, Ctrl+Home / Ctrl+End reach the ends, and PageUp / PageDown move by a screenful.

## Considered Options

- **A `listbox` or `list`**: rejected, because neither has a standard way to group items under announced headings and also jump between groups, and listbox implies selection, which the Timeline doesn't have.
- **A tree (days as expandable parents)**: rejected, because collapsing days adds state nobody asked for, and Left / Right would mean collapse / expand rather than move.
- **Left / Right following the screen** (Left = newer): rejected, because the hint and the mental model are both about time ("older day"), and the screen direction would flip if the list were ever ordered oldest-first.

## Consequences

- The day is announced by folding it into the focused cell's name (`Tuesday 3 March, 14 events. 09:15, Door forced, …`) only when focus has just entered that day, by key or from outside the grid. There's no live region, so nothing races the focus announcement. React Aria's Calendar labels its cells the same way.
- Header rows aren't focus stops; their text is the rowgroup's label.
- The focused row is merged into the virtualizer's range so it never unmounts. A key commits the new focus target synchronously, which renders its row, then focuses it and scrolls it into view.
- Focus is uncontrolled. When the remembered item leaves `items`, the item now at its old position (the next older, else the next newer) takes its place, so one `focus()` call returns focus correctly after Cancel, an edit, or an edit that moves the item out.
- The visible hint (`Timeline.KeyHint`) is English, and the Grid also uses it as its `aria-describedby`.
