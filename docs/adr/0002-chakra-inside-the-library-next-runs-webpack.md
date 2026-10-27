# Chakra UI inside the library, so Next runs `--webpack`

`@repo/ui` renders Chakra UI v3 and exports its theme and Provider, rather than shipping unstyled components for the app to skin; this gives the library accessible Dialog, Field, Menu, Select and Toaster parts and one set of Severity/Category tokens. Chakra styles through runtime Emotion, and Chakra's Next.js guide says Turbopack (Next 16's default) can hydrate Emotion CSS incorrectly (upstream vercel/next.js#91411 is open), so the demo runs `next dev --webpack` and `next build --webpack`.

## Consequences

- Webpack does not compile workspace packages from source on its own, so `apps/demo/next.config.ts` lists `@repo/ui` in `transpilePackages`. Drop both the flag and that entry once Turbopack hydrates Emotion correctly.
- Style props are resolved at runtime on every render (~5-7 µs per element), so hot paths (DataGrid body cells, virtualized Timeline rows) use plain elements instead of Chakra components.
