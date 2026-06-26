# Homepage Redesign and Favorites Integration

## Change summary

Redesign the Forecastly home page into a polished, responsive weather dashboard with an official shadcn navigation sidebar while completing the existing favorite-cities integration. The implementation should preserve the current weather data flow, Open-Meteo services, domain types, search behavior, geolocation behavior, temperature-unit persistence, recommendations, charts, and shadcn/ui foundation.

The redesign should focus on product presentation and usability: richer weather-themed visual tokens, a stronger sidebar-based app shell, a clearer search/hero area, a responsive forecast dashboard layout, integrated favorite-city controls, and improved weather-card hierarchy.

## Success criteria

- Forecastly home page has a cohesive weather-app visual identity instead of the current plain grayscale single-column presentation.
- `app/globals.css` contains weather-appropriate light/dark theme tokens while preserving Tailwind v4 and shadcn/ui compatibility.
- The official shadcn `sidebar` component is added through the shadcn CLI/registry workflow and lives under `components/ui/` with any generated support primitives.
- `app/layout.tsx` uses a sidebar-based shared Forecastly shell without moving route structure or changing app architecture.
- The sidebar provides sensible initial navigation for the single-page app:
  - Dashboard/Search as the primary active destination.
  - Forecast sections such as Current, Hourly, 7-Day, and Favorites as section-oriented navigation/shortcuts where practical.
  - Future/nonimplemented destinations such as Settings/About may be shown only if clearly disabled or non-navigating.
- Sidebar remains usable on mobile through the official shadcn sidebar responsive behavior/trigger pattern.
- `app/page.tsx` renders a responsive dashboard:
  - Search and `Use my location` are prominent primary entry actions.
  - Empty/onboarding state is visually stronger and explains what users can do.
  - Loading, error, and location-notice states remain accessible and readable.
  - Selected forecast view shows city/location name, unit toggle, favorite toggle, current conditions, recommendations, hourly forecast, daily forecast, charts, and favorite cities in a coherent responsive layout.
- Existing favorites work is completed:
  - Users can star/unstar the selected city.
  - Filled/outline star state reflects whether the selected city is favorited.
  - `FavoriteCities` is mounted on the home page and selecting a favorite loads its weather through the existing `handleCitySelect` path.
  - Coordinate-backed/geolocated fallback locations are not forced into a separate persistence model.
- Weather display components are visually refined without changing their data-fetching responsibilities.
- No new runtime dependencies are introduced unless explicitly approved later.
- Dependency/config changes produced by the official shadcn sidebar installation are allowed, but avoid unrelated package changes.
- Existing service modules under `lib/` and domain contracts under `types/` are not redesigned for this visual/product pass.
- Lint and production build pass.
- Context is synced after implementation so future sessions understand the redesigned home page and completed favorites integration.

## Constraints and non-goals

- Follow repository instruction: before implementation edits touching Next.js app files, consult the relevant local Next.js 16 docs under `node_modules/next/dist/docs/` if available; if local docs are not present, note that in task evidence.
- Keep active route tree in repository-root `app/`; do not migrate to `src/app/`.
- Do not rewrite weather, geocoding, coordinate-location, recommendation, weather-code, or risk-badge services.
- Do not change normalized domain models unless an implementation task discovers a blocking type issue.
- Add the official shadcn sidebar component through the shadcn CLI/registry workflow. Do not hand-copy or manually invent the sidebar primitive when the registry component is available.
- Do not edit shadcn-generated primitives in `components/ui/` after generation; compose them from feature/page/layout code instead.
- Do not add backend, database, map/radar UI, authentication, notification system, or forecast provider changes.
- Do not add a charting library; keep the dependency-free SVG chart approach unless explicitly approved later.
- Keep unit switching client-side and do not refetch forecasts when the user toggles Celsius/Fahrenheit.
- Keep favorite-city persistence in `localStorage` through existing `useFavorites()`.

## Task stack

- [x] T01: `Refresh Forecastly theme tokens` (status:done)
  - Task ID: T01
  - Goal: Update global CSS variables and base background treatment to establish a weather-specific visual identity while preserving Tailwind v4 and shadcn/ui compatibility.
  - Boundaries (in/out of scope): In scope — `app/globals.css` token values, chart colors, background/foreground/card/accent variables, non-invasive global background helpers if needed. Out of scope — component JSX restructuring, layout header changes, new dependencies, shadcn primitive edits.
  - Done when: Light and dark mode tokens no longer feel like default neutral starter values; cards, charts, accents, borders, and muted surfaces have a cohesive weather-app palette; existing `@theme inline`, shadcn imports, and base layer remain intact.
  - Verification notes (commands or checks): Inspect `app/globals.css`; run `npm run lint` after implementation; later full build in final validation.
  - Completed: 2026-06-26
  - Files changed: `app/globals.css`
  - Evidence: `npm run lint` passed. Local `node_modules/next/dist/docs/` docs were not present when checked before editing.
  - Notes: Replaced neutral starter shadcn tokens with light/dark weather-themed OKLCH palettes for backgrounds, foregrounds, cards, popovers, primary/secondary/accent, borders, inputs, rings, charts, and sidebar variables while preserving `@theme inline`, imports, radius, and base layer structure.

- [x] T02: `Add official shadcn sidebar primitives` (status:done)
  - Task ID: T02
  - Goal: Install the official shadcn `sidebar` component and any generated support primitives required by the registry.
  - Boundaries (in/out of scope): In scope — run the shadcn CLI/registry add command for `sidebar`; accept generated `components/ui/` files and required package/config updates produced by that command; inspect generated code for fit with project aliases. Out of scope — composing the app layout, manual edits to generated primitives, unrelated shadcn components, unrelated dependency upgrades.
  - Done when: Official sidebar primitives exist under `components/ui/`; generated imports resolve with existing aliases; any package/config changes are limited to shadcn sidebar requirements; no application layout behavior has been changed yet.
  - Verification notes (commands or checks): Use `npx shadcn@latest add sidebar` or the correct shadcn v4 equivalent; inspect generated files; run `npm run lint`; run `npx tsc --noEmit` if generated types need verification.
  - Completed: 2026-06-26
  - Files changed: `components/ui/input.tsx`, `components/ui/separator.tsx`, `components/ui/sheet.tsx`, `components/ui/sidebar.tsx`, `components/ui/skeleton.tsx`, `components/ui/tooltip.tsx`, `hooks/use-mobile.ts`
  - Evidence: `npx shadcn@latest add sidebar` completed and generated the official sidebar primitives/support components; `npm run lint` passed; `npx tsc --noEmit` passed. Local `node_modules/next/dist/docs/` docs were not present when checked before implementation.
  - Notes: shadcn reported `components/ui/button.tsx` as skipped/identical and reminded that app composition should wrap sidebar tooltip usage with `TooltipProvider`; this is deferred to T03 layout composition. The generated `hooks/use-mobile.ts` was minimally adjusted with approval so initial mobile state is computed in the state initializer instead of a synchronous effect state update, satisfying the repo lint rule without changing the public hook contract.

- [x] T03: `Compose sidebar-based root app shell` (status:done)
  - Task ID: T03
  - Goal: Replace the current top-header-only shell with a responsive Forecastly navigation sidebar using the official shadcn sidebar primitives.
  - Boundaries (in/out of scope): In scope — `app/layout.tsx` composition around `SidebarProvider`, `Sidebar`, sidebar trigger/header/content/footer patterns, accessible text-based brand, responsive main content wrapper, initial nav items/section shortcuts. Out of scope — adding real new pages/routes, changing weather page state, changing metadata behavior beyond existing Forecastly metadata, editing generated shadcn primitives.
  - Done when: The app has a shadcn sidebar with Forecastly branding; Dashboard/Search is the active primary item; Current, Hourly, 7-Day, and Favorites are represented as section-oriented shortcuts where practical; future items, if included, are clearly disabled/non-navigating; mobile users have an accessible sidebar trigger; `main` still provides a centered responsive content region; route tree stays under root `app/`.
  - Verification notes (commands or checks): Before editing, consult/attempt to consult relevant Next.js 16 layout/metadata docs and shadcn sidebar docs/registry output; inspect rendered JSX structure; run `npm run lint` after implementation.
  - Completed: 2026-06-26
  - Files changed: `app/layout.tsx`
  - Evidence: Local `node_modules/next/dist/docs/` layout/metadata docs were not present when checked before editing; generated `components/ui/sidebar.tsx` and `components/ui/tooltip.tsx` were inspected for composition API; `npm run lint` passed; `npx tsc --noEmit` passed.
  - Notes: Root layout now wraps routes with `TooltipProvider`, `SidebarProvider`, the official shadcn sidebar primitives, a Forecastly brand link, active Dashboard/Search navigation, section shortcuts for Current/Hourly/7-Day/Favorites, a disabled Settings item, accessible sidebar trigger, and centered responsive main content under the root `app/` route tree. Generated shadcn primitives were not edited.

- [x] T04: `Recompose home page dashboard layout` (status:done)
  - Task ID: T04
  - Goal: Refactor `app/page.tsx` presentation into a responsive weather-dashboard composition while preserving existing state and fetch behavior.
  - Boundaries (in/out of scope): In scope — `app/page.tsx` layout/classes/copy only; reorganize search, geolocation button, onboarding, loading, error, notice, selected-city header, and existing forecast components into a richer responsive layout. Out of scope — favorite toggle wiring, component internals, service changes, hook changes, new dependencies.
  - Done when: Empty state has a strong hero/search experience; selected forecast state uses responsive dashboard sections instead of a narrow single column; all existing calls to `getWeatherForecast`, `resolveCoordinateLocation`, `getWeatherRecommendations`, `getCurrentWeatherRiskBadges`, and `useTemperatureUnit` still work through the same data flow; loading/error/location-notice states remain visible and readable.
  - Verification notes (commands or checks): Before editing, consult/attempt to consult relevant Next.js 16 page/client-component docs; inspect `app/page.tsx` for unchanged data flow; run `npm run lint` after implementation.
  - Completed: 2026-06-26
  - Files changed: `app/page.tsx`
  - Evidence: Local `node_modules/next/dist/docs/` page/client docs were not present when checked before editing; `npm run lint` passed.
  - Notes: Reworked the home page JSX into a weather-dashboard composition with a hero/search panel, stronger onboarding cards, readable loading/error/location notice states, selected-forecast header with unit toggle, and responsive forecast sections. Existing state, handlers, service calls, recommendation/risk derivation, and temperature-unit flow remain unchanged. Favorite toggle/list wiring remains deferred to T05.

- [ ] T05: `Complete favorites integration on home page` (status:todo)
  - Task ID: T05
  - Goal: Wire the existing `useFavorites()` hook and `FavoriteCities` component into the redesigned home page.
  - Boundaries (in/out of scope): In scope — `app/page.tsx` imports and UI wiring for favorite state, star/unstar button next to selected city/location title, and mounted `FavoriteCities` section/panel that calls `handleCitySelect`. Out of scope — modifying `hooks/useFavorites.ts`, modifying `components/city/FavoriteCities.tsx` API, changing persistence key, adding confirmation dialogs, favorite reordering/editing.
  - Done when: Selected city view shows a star toggle; favorited state reflects `isFavorite(selectedCity.id)`; clicking the toggle adds/removes the selected city using existing hook methods; `FavoriteCities` appears in the redesigned layout; clicking a favorite loads weather via the same city-selection path; no favorite controls appear when no city/location is selected except the favorites list/empty state if intentionally shown by layout.
  - Verification notes (commands or checks): Inspect `app/page.tsx` imports and event handlers; manually reason through add/remove/select event paths; run `npm run lint`; run `npx tsc --noEmit` if available/appropriate.

- [ ] T06: `Upgrade current weather hero card` (status:todo)
  - Task ID: T06
  - Goal: Make `CurrentWeatherCard` the visual centerpiece of the selected forecast dashboard.
  - Boundaries (in/out of scope): In scope — `components/weather/CurrentWeatherCard.tsx` presentation/classes/semantic grouping; improved temperature hierarchy, icon treatment, condition summary, metric tiles, and risk-badge presentation using existing props. Out of scope — changing prop contract unless strictly necessary, fetching data, changing risk-badge derivation, changing temperature conversion logic.
  - Done when: Current conditions are scannable at a glance; risk badges remain accessible; humidity/wind/feels-like/description are visually grouped; selected unit display remains correct through `convertTemperature`; component remains display-only.
  - Verification notes (commands or checks): Inspect component prop usage; run `npm run lint`; run `npx tsc --noEmit` if available/appropriate.

- [ ] T07: `Polish forecast sections and charts` (status:todo)
  - Task ID: T07
  - Goal: Apply cohesive dashboard styling to recommendations, hourly forecast, daily forecast, and trend charts while preserving their existing contracts.
  - Boundaries (in/out of scope): In scope — presentation changes in `components/weather/WeatherRecommendations.tsx`, `HourlyForecast.tsx`, `DailyForecast.tsx`, and `ForecastTrendChart.tsx`; improved card hierarchy, scroll affordances, chart contrast, item spacing, and responsive behavior. Out of scope — new chart library, new forecast calculations, service/data changes, changing public prop contracts unless unavoidable.
  - Done when: Recommendation cards, hourly timeline, 7-day cards, and SVG charts visually match the redesigned page; horizontal scroll remains usable on small screens; chart accessible labels and hidden data list remain intact; temperature/precipitation display remains correct.
  - Verification notes (commands or checks): Inspect accessibility attributes in chart and forecast lists; run `npm run lint`; run `npx tsc --noEmit` if available/appropriate.

- [ ] T08: `Validate redesign, cleanup, and sync context` (status:todo)
  - Task ID: T08
  - Goal: Validate the completed redesign/favorites integration and update SCE context to current state.
  - Boundaries (in/out of scope): In scope — run full available checks, remove temporary/debug artifacts, update this plan with evidence, and sync durable context files that describe the home page, architecture/patterns if changed, favorites integration, and relevant components. Out of scope — new product features, additional visual redesign beyond bug fixes needed for validation, unrelated refactors.
  - Done when: `npm run lint` passes; `npm run build` passes; `npx tsc --noEmit` is run if useful and passes or its absence/duplication is documented; no temporary scaffolding remains; `context/overview.md`, `context/architecture.md`, `context/app/home-page.md`, `context/components/*`, `context/hooks/use-favorites.md`, `context/components/shadcn-ui.md`, and `context/context-map.md` are verified or updated as needed; the older `favorite-cities` plan no longer misrepresents remaining integration work.
  - Verification notes (commands or checks): `npm run lint`; `npm run build`; optional `npx tsc --noEmit`; inspect relevant context files; update validation evidence in this plan.

## Open questions

None blocking. Assumptions for implementation:

- Use the recommended scope selected by the user: full homepage redesign plus favorites integration.
- Use existing dependencies only.
- Add the official shadcn sidebar component as requested by the user; generated dependencies/config changes needed for that component are allowed.
- Navigation sidebar items should prioritize useful current single-page destinations/sections: Dashboard/Search, Current Weather, Hourly Forecast, 7-Day Forecast, Favorites. Settings/About should not become real routes in this plan unless explicitly requested later.
- Keep visual style weather-themed, modern, responsive, and accessible; exact color values and spacing can be chosen during implementation within existing Tailwind/shadcn conventions.
- Finish favorites integration in this plan rather than continuing it through the older `context/plans/favorite-cities.md` plan.
