# Agent rules

## File layout

- **kebab-case** for every file and folder name: `event-dialog.tsx`, `use-create-event.ts`, `events-query.ts`.
- **One component per file**, named after it (`EventDialog` → `event-dialog.tsx`). Hooks too: one per file, `use-<name>.ts`.
- **Colocate**: put a module in the nearest folder that covers every file importing it. When a new importer lands outside that folder, move the module up to the common ancestor.
- **Demo app** (`apps/demo`): all code lives under `app/`, in Next private folders named by kind:
  - `_components/` for React components
  - `_hooks/` for hooks
  - `_utils/` for plain functions and constants
  - `_server/` for server-only modules

  For example, `app/api/events/_server/events-db.ts` is used only by the events routes, and `app/_hooks/use-create-event.ts` is shared by the page.

- **Library** (`packages/ui`): code stays in `src/<entry>/` (`datagrid`, `timeline`, `event-form`, shared private `dates`, `theme`), with the same naming and one-component-per-file rules.

Where a planning ticket names an older path (`apps/demo/src/...`), follow this layout instead.
