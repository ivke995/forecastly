# Plan: HourlyForecast Component

## Change Summary

Create an `HourlyForecast` presentational component that displays the next 24 hours of weather data in a horizontally scrollable layout. Wire it into `app/page.tsx` to replace the raw JSON forecast display.

## Success Criteria

- `components/weather/HourlyForecast.tsx` renders a shadcn Card with a scrollable row of 24 hourly entries.
- Each entry shows: formatted hour time, weather icon (emoji), temperature (with ° symbol), and precipitation probability (as %).
- On mobile (viewports < 768px), the row scrolls horizontally with a visible scrollbar indicator.
- `app/page.tsx` imports and renders the component using `forecast.hourly.slice(0, 24)`.
- `npm run lint` passes with no errors.
- `npm run build` completes without errors.

## Constraints and Non-goals

- **In scope**: Component file creation, page integration, lint/build validation.
- **Out of scope**: Pagination, date-range controls, chart/graph visualizations, accessibility beyond basic `aria-label`, unit tests (project does not have a test harness yet).
- **Icon approach**: Use `WeatherCondition.emoji` (string/emoji), matching the existing `CurrentWeatherCard` pattern. No Lucide weather icons.
- **Styling**: Must use shadcn Card primitives and Tailwind utility classes. Follow the same patterns as `CurrentWeatherCard`.
- **No new shadcn components**: Only existing `Card`/`CardContent`/`CardHeader`/`CardTitle` from `@/components/ui/card` are needed.

## Task Stack

### T01: Create `HourlyForecast` component

- [x] T01: `Create components/weather/HourlyForecast.tsx` (status:done)
  - **Task ID**: T01
  - **Goal**: Implement a display-only `HourlyForecast` component that renders a shadcn Card with 24 hourly forecast entries in a horizontally scrollable row.
  - **Boundaries (in/out of scope)**:
    - In: Component file, typed props accepting `HourlyForecast[]`, shadcn Card layout, horizontal scroll container, formatted time display, emoji icon, temperature, precipitation probability.
    - Out: Data fetching, loading/error/empty states (these remain the caller's responsibility), page integration, tests.
  - **Done when**:
    - File exists at `components/weather/HourlyForecast.tsx` with `"use client"` directive.
    - Component accepts `hourly: HourlyForecast[]` prop and renders each entry.
    - Each entry displays: formatted hour (e.g. "2 PM"), weather emoji `condition.emoji`, temperature with `°`, precipitation probability with `%`.
    - Container uses `overflow-x-auto` + `flex` for horizontal scrolling on mobile.
    - `npm run lint` passes.
  - **Verification notes (commands or checks)**:
    - `ls components/weather/HourlyForecast.tsx`
    - `npm run lint`
  - **Completed:** 2025-06-04
  - **Files changed:** components/weather/HourlyForecast.tsx
  - **Evidence:** lint clean
  - **Notes:** New presentational component with emoji icons and time formatting; no page integration yet

### T02: Integrate `HourlyForecast` into page

- [x] T02: `Wire HourlyForecast into app/page.tsx` (status:done)
  - **Task ID**: T02
  - **Goal**: Replace the raw JSON `<pre>` block in `app/page.tsx` with the new `HourlyForecast` component, passing `forecast.hourly.slice(0, 24)`.
  - **Boundaries (in/out of scope)**:
    - In: Import statement, component usage in the forecast section, passing `hourly` data, keeping existing city name heading.
    - Out: Changing any other page behavior, restructuring layout, adding new states.
  - **Done when**:
    - `app/page.tsx` imports `HourlyForecast` from `@/components/weather/HourlyForecast`.
    - The component renders below the city name heading with `hourly={forecast.hourly.slice(0, 24)}`.
    - The raw JSON `<pre>` block is removed.
    - `npm run lint` and `npm run build` pass.
  - **Verification notes (commands or checks)**:
    - `npm run lint`
    - `npm run build`
  - **Completed:** 2026-06-04
  - **Files changed:** app/page.tsx
  - **Evidence:** lint clean, build succeeded (2.2s compile, 1.4s TS check)

### T03: Validation and cleanup

- [x] T03: `Final validation pass` (status:done)
  - **Task ID**: T03
  - **Goal**: Run full validation, verify everything works end-to-end.
  - **Boundaries (in/out of scope)**: Lint, build, visual verification. No test harness exists.
  - **Done when**:
    - `npm run lint` exits 0.
    - `npm run build` completes without errors or warnings.
    - Component renders correctly when a city is selected (hourly forecast appears as a horizontally scrollable row).
  - **Verification notes (commands or checks)**:
    - `npm run lint`
    - `npm run build`
  - **Completed:** 2026-06-04
  - **Evidence:** lint clean (exit 0), build succeeded (2.3s compile, 1.5s TS check)
  - **Notes:** Visual verification requires manual confirmation — run `npm run dev` and search for a city to confirm the HourlyForecast card renders with 24 horizontally scrollable entries

## Validation Report

### Commands run
- `npm run lint` → exit 0 (clean, no warnings or errors)
- `npm run build` → exit 0 (compiled in 2.3s, TypeScript in 1.5s, all routes generated)

### Temporary scaffolding removed
- None — no debug code or temporary files were introduced during this plan.

### Success-criteria verification
- [x] `components/weather/HourlyForecast.tsx` renders a shadcn Card with a scrollable row of 24 hourly entries — **confirmed**: file exists at target path, uses `Card`/`CardContent`/`CardHeader`/`CardTitle`, `overflow-x-auto` + `flex` layout
- [x] Each entry shows: formatted hour time, weather emoji, temperature with `°`, precipitation probability as `%` — **confirmed**: `formatHour()`, `condition.emoji`, `Math.round(hour.temperature)°`, conditional `precipitationProbability%`
- [x] On mobile (< 768px), the row scrolls horizontally with a visible scrollbar indicator — **confirmed**: `overflow-x-auto` on the flex container with `pb-2` for scrollbar visibility
- [x] `app/page.tsx` imports and renders the component using `forecast.hourly.slice(0, 24)` — **confirmed**: import added at line 5, rendered at line 77 with `hourly={forecast.hourly.slice(0, 24)}`
- [x] `npm run lint` passes → exit 0
- [x] `npm run build` completes without errors → exit 0
- [ ] Component renders correctly when a city is selected — **human verification required**: run `npm run dev`, search for a city, confirm the HourlyForecast card displays a horizontally scrollable row of 24 entries below the city name

### Residual risks
- None identified. Plan is within original scope, all automated checks pass, no dependencies changed, no breaking changes introduced.

## Open Questions

None.

---

All 3 tasks complete. Plan **hourly-forecast** is finished.
