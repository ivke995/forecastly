# Forecast Charts and Use My Location

## Change summary

Add two scanability/convenience features to the Forecastly home experience:

- Simple dependency-free temperature and precipitation trend visualizations for both hourly and daily forecasts.
- A browser geolocation-driven "Use my location" flow that fetches weather by coordinates, attempts to display a readable nearby/reverse-derived location name, and falls back to coordinate-based display when reverse display is unavailable.

## Success criteria

- Hourly forecast UI includes a simple accessible trend visualization for temperature and precipitation probability using CSS/SVG or plain React markup, with no new charting dependencies.
- Daily forecast UI includes a simple accessible trend visualization for min/max temperature and precipitation probability, with no new charting dependencies.
- Charts respect the selected Celsius/Fahrenheit display unit for temperature labels and do not refetch weather data when the unit changes.
- The home page offers a "Use my location" action near city search.
- On supported browsers, approving geolocation fetches a forecast using browser coordinates.
- The location flow attempts a readable display name using existing/no-new-dependency geocoding options where practical, then falls back to a clear coordinate display such as `Your location (12.34, 56.78)`.
- Permission denied, unsupported geolocation, timeout, reverse-display failure, and weather-fetch failure states are handled without crashing and with user-readable feedback.
- Existing city-search forecast behavior remains intact.

## Constraints and non-goals

- No new charting dependencies; prefer CSS/SVG/plain React.
- No app-wide routing or server API route is required unless implementation discovers a Next.js/browser constraint that makes it necessary.
- Keep weather/geocoding services UI-free and framework-light.
- Keep feature components display-only where possible; page-level/client orchestration owns browser geolocation and fetch state.
- Do not add persistence for last geolocated location in this plan.
- Do not add favorites integration for geolocated coordinates in this plan.
- Do not add maps, radar, severe weather alerts, or historical weather.

## Assumptions

- Both hourly and daily forecast charts are in scope.
- Reverse display should try a readable location lookup first and then fall back to coordinates.
- This is one combined plan so charts and geolocation can be validated together.
- Open-Meteo or the current geocoding integration should be preferred for reverse/nearby display before considering any additional service; if no reliable reverse endpoint is available, coordinate fallback still satisfies the fallback path.

## Task stack

- [x] T01: `Add forecast trend chart component` (status:done)
  - Task ID: T01
  - Goal: Create a reusable dependency-free forecast trend visualization component for small temperature/precipitation charts.
  - Boundaries (in/out of scope): In - component under `components/weather/`, typed props for plotted series, SVG/CSS rendering, accessible title/description/labels, selected temperature unit support through existing conversion helpers. Out - page integration, geolocation, provider request changes, new dependencies.
  - Done when: A reusable chart component can render temperature and precipitation series from normalized forecast values, handles empty/flat/single-point data safely, exposes accessible text for screen readers, and uses no chart library.
  - Verification notes (commands or checks): Run targeted TypeScript/lint checks available in the repo; manually inspect component props and confirm no new package dependency was added.
  - Completed: 2026-06-25
  - Files changed: `components/weather/ForecastTrendChart.tsx`
  - Evidence: `npm run lint` passed; `npx tsc --noEmit` passed; `npm run build` passed. Initial checks required `npm ci` because `node_modules` was absent; no package dependency files were changed.
  - Notes: Added a display-only SVG trend chart with typed temperature/precipitation series props, existing `convertTemperature()` unit conversion, accessible chart text, empty-data fallback, flat-series padding, and single-point markers.

- [x] T02: `Integrate hourly and daily trend charts` (status:done)
  - Task ID: T02
  - Goal: Add the trend visualizations to both `HourlyForecast` and `DailyForecast` displays.
  - Boundaries (in/out of scope): In - render hourly temperature/precipitation trends using the first displayed hourly rows, render daily min/max temperature and precipitation trends using displayed daily rows, preserve existing cards and list/grid content. Out - geolocation, weather service request changes, visual redesign beyond chart placement.
  - Done when: Hourly and daily forecast cards each show trend visuals alongside existing forecast details; chart labels update when the selected unit changes; missing precipitation values are handled gracefully; existing horizontal/mobile layouts remain usable.
  - Verification notes (commands or checks): Run targeted TypeScript/lint checks; manually test a searched city in Celsius and Fahrenheit at mobile and desktop widths.
  - Completed: 2026-06-26
  - Files changed: `components/weather/HourlyForecast.tsx`, `components/weather/DailyForecast.tsx`
  - Evidence: `npm run lint` passed; `npx tsc --noEmit` passed; `npm run build` passed.
  - Notes: Added `ForecastTrendChart` to hourly and daily cards with local data mapping from displayed rows, selected-unit temperature labels, daily high/low series, and precipitation series that omit missing probability values.

- [x] T03: `Add coordinate location helpers` (status:done)
  - Task ID: T03
  - Goal: Add UI-free helpers to convert browser coordinates into a Forecastly city-like object and attempt readable reverse/nearby display metadata with coordinate fallback.
  - Boundaries (in/out of scope): In - reusable helper/service code under `lib/` and/or `types/` for coordinate normalization, coordinate display formatting, best-effort reverse/nearby lookup using existing/no-new-dependency provider approach, typed error/fallback behavior. Out - React UI, browser permission prompts, weather chart code, persistence.
  - Done when: Given latitude/longitude/timezone, helper code can produce a valid `CitySearchResult`/`City` compatible object for `getWeatherForecast`; readable display lookup failures fall back to deterministic coordinate display without preventing weather fetch.
  - Verification notes (commands or checks): Run targeted TypeScript/lint checks; if tests exist or are added, verify success/failure paths for valid coordinates, invalid coordinates, readable lookup success, and readable lookup failure fallback.
  - Completed: 2026-06-26
  - Files changed: `lib/coordinate-location.ts`
  - Evidence: `npx eslint lib/coordinate-location.ts` passed; `npx tsc --noEmit` passed; `npm run build` passed.
  - Notes: Added UI-free coordinate helpers for validation, coordinate fallback display, stable coordinate-backed city objects, best-effort Open-Meteo reverse geocoding, and typed fallback behavior that preserves forecast compatibility when readable lookup fails.

- [ ] T04: `Add Use My Location flow to home page` (status:todo)
  - Task ID: T04
  - Goal: Add a browser geolocation button to `app/page.tsx` that fetches forecast data for the user's current coordinates.
  - Boundaries (in/out of scope): In - button placement near `CitySearch`, browser geolocation support/permission/loading/error states, reuse existing forecast loading/rendering path, readable/fallback display name from T03. Out - persistence, favorites integration, server routes, chart rendering changes beyond coexistence with existing forecast display.
  - Done when: Clicking "Use my location" requests geolocation, fetches forecast by coordinates on approval, displays a readable or coordinate fallback location name, handles denied/unsupported/timeout/weather errors, and does not regress city search selection.
  - Verification notes (commands or checks): Run targeted TypeScript/lint checks; manually test approved geolocation, denied permission, unsupported geolocation simulation if practical, and a normal city search after using the button.

- [ ] T05: `Sync feature context documentation` (status:todo)
  - Task ID: T05
  - Goal: Update durable context files to describe the current-state chart components and geolocation/coordinate-location behavior after implementation.
  - Boundaries (in/out of scope): In - update relevant `context/components/`, `context/services/`, `context/domain-models/`, `context/overview.md`, `context/architecture.md`, `context/glossary.md`, and `context/context-map.md` as needed. Out - application code changes and historical implementation narrative.
  - Done when: Context describes the implemented current state accurately, new files are discoverable from `context/context-map.md`, and stale statements are repaired.
  - Verification notes (commands or checks): Review changed context files against code truth; ensure no completed-work summary is placed in core context files.

- [ ] T06: `Final validation and cleanup` (status:todo)
  - Task ID: T06
  - Goal: Run final validation for the combined charts/geolocation plan and clean up temporary artifacts.
  - Boundaries (in/out of scope): In - full repo validation commands available in package scripts, manual acceptance checklist, temporary/debug artifact removal, final plan status/evidence updates, context sync verification. Out - new feature scope beyond defects found during validation.
  - Done when: Full lint/type/test/build checks available in the repo pass or documented blockers are captured; charts and geolocation success criteria are verified; no temporary scaffolding remains; context files match current code.
  - Verification notes (commands or checks): Run the repository's standard validation commands from `package.json` such as lint/typecheck/test/build where available; manually verify city search, unit toggle, hourly chart, daily chart, geolocation approval, geolocation denial, and coordinate fallback behavior.

## Open questions

- None blocking. During T03, implementation should confirm the best available no-new-dependency reverse/nearby display strategy and preserve coordinate fallback if provider support is limited.
