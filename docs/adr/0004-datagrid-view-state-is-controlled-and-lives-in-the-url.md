# The DataGrid draws no filter controls; its view state is controlled and the demo keeps it in the URL

The DataGrid keeps TanStack's filter → sort → page engine but draws no filter controls: consumers build their own filter UI and pass the values in through a one-way `filters` prop on `DataGrid.Root`, keyed by column id. Sort, pagination and hidden columns can each be controlled the same way through optional value/`on…Change` pairs, uncontrolled when omitted. The demo keeps the whole view (filters, sort, page, page size, hidden columns) in the URL with nuqs, so a link reproduces exactly what the sender saw.

## Considered Options

- **Filter inputs inside the grid** (a filter row in the header): rejected, because a library can't know which controls a consumer wants, and its state couldn't be shared through a link.
- **The consumer pre-filters `rows`**: rejected, because the grid would lose "No matching rows", the reset to page 1 and the filtered count, and the brief asks the DataGrid itself for column filtering.

## Consequences

- The grid still owns the page rules: it reports a reset to page 1 when filters or sort change, and a clamp when the rows shrink, through `onPaginationChange`. Clamping runs in an effect, so the URL is briefly out of range before it's corrected.
- A filter applies whether or not its column is visible, and the built-in `NoMatches` has no Clear filters button, because the grid can't write filters.
- The demo's Columns popover sits in the filter bar, outside `DataGrid.Root`, and writes hidden columns to the URL directly rather than through `useDataGrid().columns`, so the demo repeats the grid's rule that the last visible column can't be hidden.
- Default sort and default hidden columns are the demo's nuqs parser defaults, not column options, and params equal to their default are dropped from the URL.
