# The DataGrid paginates its 100k rows instead of virtualizing them

The brief asks for pagination, so the DataGrid pages through its rows (25, 50 or 100 at a time) and mounts at most 100 body rows. Large pages with virtualized rows and infinite scroll were both rejected: the Timeline already covers the scrolling case, and infinite scroll over in-memory data is hard to use with a keyboard or screen reader (no stable end, no "page 3 of 40" to come back to). The 100k-row cost therefore sits in the in-memory filter → sort → slice pipeline, not in the DOM.

## Consequences

- Each stage of the pipeline is memoised by TanStack Table, so changing the page only re-slices, and changing the rows (create/edit) keeps sort, filters and page, with the page index clamped.
- A sort over 100k rows takes ~65–105 ms from click to paint (~190–440 ms at 4× CPU throttle), mostly TanStack calling the comparator ~1.7M times. That is acceptable for this brief, so the grid uses TanStack's sorted row model as is. If it ever needs to be faster, sort by one precomputed numeric key per row (the timestamp for Dates; for strings, the rank among the column's distinct values, so the `Intl.Collator` runs once per distinct value): a prototype of that took ~40–65 ms (~100–175 ms at 4×), but it had to read TanStack internals and supported only one sort column.
- No `onRowActivate`: rows aren't focusable, and row actions are ordinary buttons in a column.
