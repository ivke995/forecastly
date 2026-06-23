# Favorite Cities

## Change summary

Add a "favorite cities" feature that lets users star/unstar cities and revisit them quickly. Persistence is in `localStorage` — no backend or database.

This plan adds:
- A `useFavorites()` custom hook (`hooks/useFavorites.ts`) for localStorage-backed read/write of `FavoriteCity[]`
- A `FavoriteCities` component (`components/city/FavoriteCities.tsx`) that displays the user's favorite cities and lets them click to load weather or remove a favorite
- Integration in `app/page.tsx`: a star toggle button on the selected city and the favorites list rendered on the page

## Success criteria

- `hooks/useFavorites.ts` exists, exports `useFavorites`, and manages `FavoriteCity[]` in localStorage under key `forecastly-favorites`
- Hook returns `{ favorites, addFavorite, removeFavorite, isFavorite }` with correct types
- Hook is SSR-safe (no `window is not defined` errors during server rendering)
- `components/city/FavoriteCities.tsx` exists and renders a list of favorited cities inside a shadcn Card
- Each favorite item shows city name, country/admin1, and a remove button
- Clicking a favorite city calls `onSelect` with a reconstructed `CitySearchResult` to load its weather
- `app/page.tsx` shows a filled/outline star button next to the selected city name to toggle favorite state
- `app/page.tsx` renders `<FavoriteCities>` below the search/forecast area
- TypeScript compiles without errors
- Linting passes
- Build succeeds

## Constraints and non-goals

- No database — all persistence via `localStorage` only
- No new npm dependencies — `lucide-react` (already installed) provides the `Star` icon
- Do not modify existing context files except `context/context-map.md` (add new entries) and `context/components/` (add new component doc)
- Do not modify `types/city.ts` — `FavoriteCity` interface already exists and is used as-is
- Do not add a test framework or write tests (none installed in project)
- No confirmation dialog on remove — remove is instant
- No reordering or editing of favorites

## Task stack

- [x] T01: `Create hooks/useFavorites.ts custom hook` (status:done)
  - Task ID: T01
  - Goal: Implement a reusable `useFavorites()` hook that reads/writes `FavoriteCity[]` to localStorage, with SSR-safe initialization and mutation helpers.
  - Boundaries (in/out of scope):
    - In — `hooks/useFavorites.ts`; localStorage key `forecastly-favorites`; SSR guard (`typeof window`); `crypto.randomUUID()` for IDs; functions `addFavorite`, `removeFavorite`, `isFavorite`.
    - Out — UI components, page integration, modifying existing files.
  - Done when:
    - `hooks/useFavorites.ts` exists with `"use client"` directive.
    - Returns `{ favorites: FavoriteCity[], addFavorite: (city: CitySearchResult | City) => void, removeFavorite: (cityId: string) => void, isFavorite: (cityId: string) => boolean }`.
    - `addFavorite` stores a new `FavoriteCity` with a generated `id`, the city's `id` as `cityId`, a snapshot of name/country/admin1/coordinates/timezone, and `createdAt` as `new Date().toISOString()`.
    - `removeFavorite` removes by `cityId`.
    - `isFavorite` returns `true` if `cityId` exists in the list.
    - localStorage is read once on mount and synced after every mutation.
    - SSR-safe: no `window`/`localStorage` access outside `useEffect` or guarded by `typeof window` check.
    - Export includes a helper `toCitySearchResult(fav: FavoriteCity): CitySearchResult` mapping for hydrating a search-result-compatible object.
    - TypeScript compiles without errors.
  - Verification notes (commands or checks): `npx tsc --noEmit` passes; inspect the hook export shape and localStorage interactions.
  - **Completed:** 2026-06-11
  - **Files changed:** `hooks/useFavorites.ts`
  - **Evidence:** `npm run lint` clean, `npx tsc --noEmit` passed

- [x] T02: `Create FavoriteCities component` (status:done)
  - Task ID: T02
  - Goal: Build a `FavoriteCities` display/list component that renders the user's saved favorites inside a shadcn Card with click-to-select and remove actions.
  - Boundaries (in/out of scope):
    - In — `components/city/FavoriteCities.tsx`; shadcn Card shell; uses `useFavorites()` hook; `onSelect` prop; star icon from `lucide-react`; empty state.
    - Out — page integration, modifying existing components, changing `app/page.tsx`.
  - Done when:
    - `components/city/FavoriteCities.tsx` exists with `"use client"` directive.
    - Props: `onSelect: (city: CitySearchResult) => void`.
    - Uses `useFavorites()` internally for data and remove action.
    - Renders a shadcn Card with title "Favorite Cities".
    - Each favorite row displays: city name, country/admin1 context, and a remove button (star icon or X icon).
    - Clicking the row calls `onSelect` with a `CitySearchResult` reconstructed from the `FavoriteCity` fields.
    - Clicking the remove button calls `removeFavorite` and does NOT trigger `onSelect`.
    - Empty state: "No favorite cities yet. Search for a city and star it!" when list is empty.
    - TypeScript compiles without errors.
  - Verification notes (commands or checks): `npx tsc --noEmit` passes; `npm run lint` passes; review the component rendering.
  - **Completed:** 2026-06-11
  - **Files changed:** `components/city/FavoriteCities.tsx`
  - **Evidence:** `npx tsc --noEmit` clean, `npm run lint` clean

- [ ] T03: `Integrate favorites into app/page.tsx` (status:todo)
  - Task ID: T03
  - Goal: Wire the `useFavorites` hook and `FavoriteCities` component into the home page so users can star/unstar the selected city and see their favorites list.
  - Boundaries (in/out of scope):
    - In — `app/page.tsx` edits only; add star toggle button next to selected city name; render `<FavoriteCities>` below the main content; import `useFavorites` and `FavoriteCities`.
    - Out — modifying any other file; changing hook or component APIs.
  - Done when:
    - A star button (filled `Star` icon when favorited, outline `Star` icon when not) is rendered next to the selected city's `displayName`.
    - Clicking the star toggles favorite state for the selected city.
    - `<FavoriteCities onSelect={handleCitySelect} />` is rendered below the forecast content.
    - The star button is hidden when no city is selected.
    - TypeScript compiles without errors; linting passes.
  - Verification notes (commands or checks): `npx tsc --noEmit` passes; `npm run lint` passes; `npm run build` passes; manual review.

- [ ] T04: `Validate build, cleanup, and sync context` (status:todo)
  - Task ID: T04
  - Goal: Confirm the project builds cleanly with all changes, no regressions, and context files are updated to reflect the new hook and component.
  - Boundaries (in/out of scope):
    - In — `npx tsc --noEmit`, `npm run lint`, `npm run build`; update `context/context-map.md` (add entries for `hooks/` and new component); create `context/components/favorite-cities.md`.
    - Out — new features, modifying existing components, adding tests.
  - Done when: All three commands pass; `context/context-map.md` includes `hooks/useFavorites.md` and `components/city/FavoriteCities.md` entries; `context/components/favorite-cities.md` exists documenting the component.
  - Verification notes (commands or checks): `npm run lint`; `npx tsc --noEmit`; `npm run build`; inspect `context/context-map.md`; inspect `context/components/favorite-cities.md`.

## Open questions

None — design decisions documented below:

- **Hook location**: `hooks/useFavorites.ts` (matches `components.json` alias `@/hooks`).
- **Component location**: `components/city/FavoriteCities.tsx` (city-domain component, consistent with `CitySearch`).
- **Icon**: `lucide-react` `Star` icon for favorite toggle (already a dependency).
- **Toggle button**: Inline next to the selected city name in `app/page.tsx`.
- **Click behavior**: Clicking a favorite city row loads its weather via `onSelect`.
- **Remove confirmation**: None — instant remove.
- **Favorites list placement**: Below the main forecast content on the home page.
- **Empty state**: Informational text directing users to search and star a city.
- **Conversions**: The hook exports a `toCitySearchResult` helper to reconstruct a `CitySearchResult` from `FavoriteCity` fields (computes `displayName` from stored name/admin1/country).
