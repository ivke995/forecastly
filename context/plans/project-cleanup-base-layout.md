# Project Cleanup and Base Layout

## Change summary

Clean up the initialized Next.js starter project into the Forecastly base application shell. The implementation will replace starter/demo UI with a mobile-first Forecastly layout, configure app metadata, add a simple reusable header, and leave the app ready for future weather components.

Per clarification, the existing root App Router directory (`app/`) remains the active route tree. Do not migrate to `src/app/` for this task.

## Success criteria

- `app/layout.tsx` defines Forecastly metadata instead of Create Next App metadata.
- The root layout provides a clean mobile-first app shell with consistent spacing and a maximum content width around 1200px.
- A simple header appears in the shell and includes:
  - Forecastly logo text
  - App title: `Forecastly`
  - Small subtitle: `Smart Weather Forecasts`
- `app/page.tsx` contains no starter/demo content and temporarily displays:

  ```txt
  Forecastly

  Smart weather forecasts and recommendations.
  Search for a city to get started.
  ```

- Unused starter assets such as `public/next.svg` and `public/vercel.svg` are removed after references are gone.
- The project builds successfully without warnings or TypeScript errors.
- Linting succeeds.

## Constraints and non-goals

- Use the existing root `app/` directory; do not create or migrate to `src/app/` in this task.
- Keep the current Geist font setup and dark-mode-capable theme variables while replacing the starter UI.
- Use existing project dependencies; do not add new libraries.
- Do not implement weather functionality, city search, API calls, data fetching, recommendation logic, or weather components yet.
- Keep the layout ready for future weather components without introducing premature abstractions.
- Follow Next.js 16 App Router conventions; before editing code, consult the relevant local Next.js 16 docs under `node_modules/next/dist/docs/` per repository instructions.

## Task stack

- [x] T01: `Establish Forecastly root layout shell` (status:done)
  - Task ID: T01
  - Goal: Replace starter metadata and root layout structure with the Forecastly base shell, including the shared header and responsive content container.
  - Boundaries (in/out of scope): In scope — `app/layout.tsx` and narrowly scoped `app/globals.css` changes needed for background, foreground, font, and theme consistency. Out of scope — home page copy, public asset deletion, `src/app` migration, weather functionality, new dependencies.
  - Done when: Forecastly metadata replaces Create Next App metadata; the layout renders a clean mobile-first page shell; the header contains Forecastly logo text, `Forecastly`, and `Smart Weather Forecasts`; content is constrained to approximately 1200px with consistent horizontal and vertical spacing; Geist/theming support remains intact.
  - Verification notes (commands or checks): Review relevant Next.js 16 App Router/metadata docs before editing; inspect `app/layout.tsx` and `app/globals.css`; run `npm run lint` if available after the change.
  - Completed: 2026-06-03
  - Files changed: `app/layout.tsx`, `app/globals.css`
  - Evidence: Consulted local Next.js 16 docs for layouts/pages, Metadata API, and `layout` file conventions; `npm run lint` passed; `npm run build` passed.
  - Context sync classification: root-edit required because the root app shell and global theme defaults changed.

- [x] T02: `Replace starter home page with Forecastly placeholder copy` (status:done)
  - Task ID: T02
  - Goal: Replace the starter home page with the temporary Forecastly onboarding copy.
  - Boundaries (in/out of scope): In scope — `app/page.tsx` only. Out of scope — header/layout changes, global styling changes unless required by T01, asset deletion, weather search UI, weather data, links/buttons/images.
  - Done when: `app/page.tsx` no longer imports or renders `next/image`, Next.js/Vercel links, buttons, or starter instructions; the page displays `Forecastly`, `Smart weather forecasts and recommendations.`, and `Search for a city to get started.` with clean responsive spacing inside the layout shell.
  - Verification notes (commands or checks): Inspect rendered JSX for the exact placeholder copy; run `npm run lint` if not already run for T01.
  - Completed: 2026-06-03
  - Files changed: `app/page.tsx`
  - Evidence: Consulted local Next.js 16 docs for `page` and `layout` file conventions; inspected JSX for required placeholder copy and absence of starter imports/links/images; `npm run lint` passed; `npm run build` passed.
  - Context sync classification: root-edit required because the public home page state changed from starter UI to Forecastly placeholder copy.

- [x] T03: `Remove unused starter public assets` (status:done)
  - Task ID: T03
  - Goal: Delete unused starter/demo image assets once the page no longer references them.
  - Boundaries (in/out of scope): In scope — remove `public/next.svg` and `public/vercel.svg` if they are unreferenced. Out of scope — removing `app/favicon.ico`, adding new assets, changing branding beyond text-only Forecastly logo.
  - Done when: `public/next.svg` and `public/vercel.svg` are absent or otherwise confirmed unnecessary, and no application file references those assets.
  - Verification notes (commands or checks): Search for `next.svg` and `vercel.svg` references; run `npm run lint` if code changed since the last lint run.
  - Completed: 2026-06-03
  - Files changed: `public/next.svg`, `public/vercel.svg`
  - Evidence: Confirmed `public/` now contains only `file.svg`, `globe.svg`, and `window.svg`; searched `app/**/*.{ts,tsx,js,jsx,css}` for `next.svg`/`vercel.svg` and found no application references; `npm run lint` passed; `npm run build` passed.
  - Context sync classification: verify-only expected because removed assets were unused starter files and durable app-shell context already describes the current text-only Forecastly shell.

- [x] T04: `Validate build, cleanup, and sync context` (status:done)
  - Task ID: T04
  - Goal: Confirm the cleaned Forecastly shell is warning-free, type-safe, and accurately reflected in SCE context.
  - Boundaries (in/out of scope): In scope — final verification, removal of any leftover temporary/demo artifacts introduced during the work, plan evidence updates, and focused context sync if the base shell establishes durable architecture or pattern details. Out of scope — new product features, additional UI components, dependency changes, unrelated refactors.
  - Done when: `npm run lint` passes; `npm run build` passes with no warnings or TypeScript errors; no starter/demo references remain in `app/layout.tsx` or `app/page.tsx`; the route tree is confirmed to remain under root `app/`; `context/` is updated if needed or explicitly verified as current.
  - Verification notes (commands or checks): Run `npm run lint`; run `npm run build`; search for starter strings such as `Create Next App`, `Generated by create next app`, `Deploy Now`, `Documentation`, `next.svg`, and `vercel.svg`; update this plan with validation evidence.
  - Completed: 2026-06-03
  - Files changed: `context/plans/project-cleanup-base-layout.md`
  - Evidence: `npm run lint` passed; `npm run build` passed with successful compile, TypeScript, static generation, and no warnings in output; searched `app/**/*.{ts,tsx,js,jsx,css}` for `Create Next App`, `Generated by create next app`, `Deploy Now`, `Documentation`, `next.svg`, and `vercel.svg` and found no files; confirmed active route tree remains in repository-root `app/` (`favicon.ico`, `globals.css`, `layout.tsx`, `page.tsx`) and no `src/app/**` files exist; context sync verified `context/overview.md`, `context/architecture.md`, `context/glossary.md`, `context/patterns.md`, and `context/context-map.md` match code truth, with feature existence documented in shared context.
  - Context sync classification: verify-only expected because T04 validates the completed shell and does not introduce new behavior, architecture, or terminology.

## Open questions

None. Clarifications resolved:

- Keep the root `app/` route tree instead of migrating to `src/app/`.
- Remove unused starter assets such as `public/next.svg` and `public/vercel.svg`.
- Keep Geist font setup and dark-mode-capable theming while replacing starter UI.

## Validation Report

### Commands run

- `npm run lint` -> exit 0; ESLint completed with no reported issues.
- `npm run build` -> exit 0; Next.js 16.2.7 production build compiled successfully, TypeScript completed, static generation completed, and no warnings appeared in output.
- `npx biome check .` -> exit 0; Biome checked 1 configured file and reported no fixes applied.
- Test suite discovery -> no primary test command configured in `package.json`, no `Makefile` or CI workflow found, and no `*.test.*`/`*.spec.*` files found; no automated test suite was available to run.

### Cleanup and context verification

- Temporary scaffolding: `context/tmp/` contains only `.gitignore`; no debug or temporary scaffolding files were introduced for this plan.
- Starter/demo references: searched `app/**/*.{ts,tsx,js,jsx,css}` for `Create Next App`, `Generated by create next app`, `Deploy Now`, `Documentation`, `next.svg`, and `vercel.svg`; no files found.
- Route tree: repository-root `app/` contains `favicon.ico`, `globals.css`, `layout.tsx`, and `page.tsx`; no `src/app/**` files exist.
- Context sync: verified `context/overview.md`, `context/architecture.md`, `context/glossary.md`, `context/patterns.md`, and `context/context-map.md` match current code truth and document the Forecastly base shell.

### Success-criteria verification

- [x] `app/layout.tsx` defines Forecastly metadata instead of Create Next App metadata -> confirmed in `app/layout.tsx` metadata (`title: "Forecastly"`, `description: "Smart weather forecasts and recommendations."`).
- [x] Root layout provides a mobile-first app shell around 1200px maximum width -> confirmed via `max-w-[1200px]` header/main containers in `app/layout.tsx`.
- [x] Header includes Forecastly logo text, app title `Forecastly`, and subtitle `Smart Weather Forecasts` -> confirmed in `app/layout.tsx`.
- [x] `app/page.tsx` contains no starter/demo content and displays the required temporary Forecastly copy -> confirmed in `app/page.tsx` and starter-reference search.
- [x] Unused starter assets `public/next.svg` and `public/vercel.svg` are removed -> confirmed absent from `public/` and app source references.
- [x] Project builds successfully without warnings or TypeScript errors -> confirmed by `npm run build` exit 0.
- [x] Linting succeeds -> confirmed by `npm run lint` exit 0.

### Failed checks and follow-ups

- None.

### Residual risks

- No automated test suite is configured yet, so validation coverage is limited to lint, format/config check, production build, and source inspection.
