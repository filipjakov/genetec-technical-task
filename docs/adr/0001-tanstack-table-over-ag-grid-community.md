# TanStack Table v9 inside the DataGrid, not AG Grid Community

The DataGrid is built on TanStack Table v9 (headless, MIT) and renders its own markup, rather than wrapping AG Grid Community, which covers sort, filters, pagination and virtualisation for free. The brief asks for a reusable component, so its API, `<table>` semantics and states are the deliverable: AG Grid would own the DOM, theming and API shape, and costs ~377 kB gzip against ~25 kB for TanStack. MUI X DataGrid was ruled out by its free-tier caps (one active filter, no multi-sort, at most 100 rows per page).

## Consequences

- TanStack types stay internal: consumers configure columns through our own `createColumns<TRow>()`, so the engine can be swapped without breaking callers.
- Column filters are named after TanStack's built-in filter functions (`includesString`, `arrHas`, `inDateRange`), limited to the three whose value shapes `DataGridFilters` types. They're our own string union, not TanStack types, so swapping engines means mapping three names, not rewriting callers.
- We write the rendering and pagination UI ourselves; filter controls are the consumer's (ADR 0004).
- v9 shipped in 2026-08; most examples online target v8 (`useReactTable`), so check the installed package's types and bundled skills rather than tutorials.
