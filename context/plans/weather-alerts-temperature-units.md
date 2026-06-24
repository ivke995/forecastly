# Weather Alerts and Temperature Units Plan

## Change summary

Add two user-facing weather usefulness improvements:

1. Severe weather/risk badges on `CurrentWeatherCard` only, highlighting heavy rain, storms, fog, snow, strong wind, and extreme temperatures.
2. A Celsius/Fahrenheit preference toggle persisted in `localStorage`, with displayed temperatures converted client-side.

Client-side conversion is the preferred approach for this iteration because Forecastly already receives normalized Celsius forecasts, avoids refetching when users toggle units, keeps Open-Meteo request behavior stable, and makes the preference a pure display concern.

## Success criteria

- Current weather can display one or more concise risk badges when current conditions indicate heavy rain, storm, fog, snow, strong wind, or extreme heat/cold.
- Risk badges use existing normalized forecast fields where possible, including `WeatherCondition.severity`, weather code/description, current wind speed, and current/apparent temperature.
- Risk badge logic is deterministic and UI-free enough to test independently or inspect clearly.
- Users can switch displayed temperatures between Celsius and Fahrenheit.
- Temperature unit preference persists in `localStorage` and is restored on reload without breaking SSR/client hydration.
- Current weather card, hourly forecast, and daily forecast display temperatures in the selected unit consistently.
- Open-Meteo service request shape remains unchanged unless a later decision explicitly moves unit conversion server/provider-side.

## Constraints and non-goals

- Severe/risk badges are scoped to `CurrentWeatherCard` only for now; no hourly or daily risk badges in this plan.
- No new weather provider, alert API, push notification, map layer, or geolocation feature.
- No new UI dependency unless an existing shadcn/ui primitive is already available or explicitly added in a task.
- Do not change the canonical Open-Meteo normalization service to return Fahrenheit; normalized weather data remains in Celsius/km/h.
- Keep display components side-effect-free where practical; persistence belongs in a page-level hook/helper or similarly focused client concern.
- Follow existing Forecastly patterns: `lib/` for UI-free helpers, `components/weather/` for weather UI, app/page orchestration for client state.

## Assumptions

- Risk badge thresholds can be deterministic product defaults for this iteration and adjusted later. Suggested defaults: `WeatherCondition.severity` of `high`/`severe`, storm weather codes/descriptions, fog weather codes, snow weather codes, heavy rain/showers, wind speed at or above a clear threshold, and extreme apparent/current temperatures.
- Client-side Fahrenheit conversion should use standard `°F = °C * 9/5 + 32`, rounded consistently with existing temperature display style.
- Unit preference should default to Celsius when no stored preference exists or when stored data is invalid.

## Task stack

- [x] T01: `Add weather risk badge derivation helper` (status:done)
  - Task ID: T01
  - Goal: Introduce a focused UI-free helper that derives current-weather risk badges from normalized `CurrentWeather` data.
  - Boundaries (in/out of scope): In - helper types, deterministic rules, labels/icons/tone metadata, and targeted tests if the project has a test pattern. Out - rendering badges in React components, hourly/daily badge support, provider/API changes.
  - Done when: A helper can identify heavy rain, storms, fog, snow, strong wind, extreme temperatures, and severity-driven high/severe risks from current weather fields without duplicating provider fetch logic.
  - Verification notes (commands or checks): Run the project's relevant typecheck/lint/test command if available; inspect representative inputs for each badge category and no-badge normal weather.
  - Completed: 2026-06-24
  - Files changed: `lib/weather-risk-badges.ts`
  - Evidence: `npx tsc --noEmit` passed; `npm run lint` passed; `npm run build` passed.
  - Notes: Added deterministic, UI-free current-weather risk badge helper with exported badge metadata/types and thresholds for heavy precipitation, strong wind/gusts, and extreme heat/cold. No React rendering, hourly/daily support, or provider/API changes.

- [x] T02: `Render current-weather risk badges` (status:done)
  - Task ID: T02
  - Goal: Extend `CurrentWeatherCard` to accept and render risk badges in a compact, accessible way.
  - Boundaries (in/out of scope): In - prop additions, card layout update, styling using existing Tailwind/shadcn patterns, app/page wiring from current forecast to badge helper. Out - alerts outside the current weather card, notification behavior, hourly/daily rendering changes.
  - Done when: Current weather card shows readable badges only when derived current risks exist and preserves existing layout when there are no badges.
  - Verification notes (commands or checks): Run targeted lint/typecheck; manually verify current card layout with no risks and multiple risks at mobile and desktop widths.
  - Completed: 2026-06-24
  - Files changed: `components/weather/CurrentWeatherCard.tsx`, `app/page.tsx`
  - Evidence: `npx tsc --noEmit` passed; `npm run lint` passed; `npm run build` passed.
  - Notes: Added optional `riskBadges` prop and compact accessible current-risk badge region inside `CurrentWeatherCard`; `app/page.tsx` derives badges from `forecast.current` via `getCurrentWeatherRiskBadges`. No hourly/daily badge rendering, notifications, or provider/API changes.

- [x] T03: `Add temperature unit preference state` (status:done)
  - Task ID: T03
  - Goal: Add a Celsius/Fahrenheit preference contract and SSR-safe localStorage persistence for the selected unit.
  - Boundaries (in/out of scope): In - small type/helper or hook for `celsius`/`fahrenheit`, localStorage key handling, invalid stored-value fallback, app/page state integration. Out - provider-side unit params, non-temperature unit preferences such as wind speed or precipitation units.
  - Done when: The app defaults to Celsius, persists a Fahrenheit selection, restores it after reload, and handles missing/invalid localStorage values safely.
  - Verification notes (commands or checks): Run lint/typecheck; verify in browser/devtools that the localStorage key updates and reload restores the selected unit.
  - Completed: 2026-06-24
  - Files changed: `hooks/useTemperatureUnit.ts`, `app/page.tsx`
  - Evidence: `npx tsc --noEmit` passed; `npm run lint` passed (2 expected unused-variable warnings); `npm run build` passed.
  - Notes: Added `hooks/useTemperatureUnit.ts` with SSR-safe localStorage persistence following the `useFavorites` pattern — lazy useState initializer, typeof window guard, try/catch for storage errors, invalid-value fallback to celsius. Exports `TemperatureUnit` type, `useTemperatureUnit()` hook returning `{ unit, setUnit, toggleUnit }`, and defaults to "celsius". Wired `unit` and `toggleUnit` into `app/page.tsx` for downstream use in T04/T05.

- [x] T04: `Apply selected unit to forecast temperature displays` (status:done)
  - Task ID: T04
  - Goal: Convert and label displayed temperatures consistently across current, hourly, and daily forecast UI.
  - Boundaries (in/out of scope): In - display conversion helpers, unit label/formatting, props or wiring changes for `CurrentWeatherCard`, `HourlyForecast`, and `DailyForecast`. Out - changing stored domain model units, changing Open-Meteo request params, changing wind speed units.
  - Done when: Current temperature, feels-like temperature, hourly temperatures, and daily min/max temperatures all reflect the selected unit with correct labels/symbols.
  - Verification notes (commands or checks): Run lint/typecheck; manually compare a sample Celsius value with its Fahrenheit conversion in all three forecast sections.
  - Completed: 2026-06-24
  - Files changed: `hooks/useTemperatureUnit.ts`, `components/weather/CurrentWeatherCard.tsx`, `components/weather/HourlyForecast.tsx`, `components/weather/DailyForecast.tsx`, `app/page.tsx`
  - Evidence: `npx tsc --noEmit` passed; `npm run lint` passed (1 expected unused-variable warning for `toggleUnit`); `npm run build` passed.
  - Notes: Added `convertTemperature()` helper to `hooks/useTemperatureUnit.ts`, exported alongside `TemperatureUnit` type and `useTemperatureUnit` hook. Added `unit` prop to `CurrentWeatherCard`, `HourlyForecast`, and `DailyForecast`; each component converts Celsius to the selected unit and displays `°C`/`°F` suffix. Wired `unit` from `page.tsx` into all three forecast display components.

- [ ] T05: `Add temperature unit toggle UI` (status:todo)
  - Task ID: T05
  - Goal: Provide an obvious, accessible control for switching Celsius/Fahrenheit in the forecast view.
  - Boundaries (in/out of scope): In - toggle placement near forecast/current weather controls, accessible labels, state update wiring, styling with existing UI primitives. Out - account-level preferences, server persistence, broader settings page.
  - Done when: Users can switch units from the weather page without losing the selected city/forecast state, and all temperature displays update immediately.
  - Verification notes (commands or checks): Run lint/typecheck; manually verify keyboard/mouse operation, persistence after reload, and no refetch requirement solely for unit switching.

- [ ] T06: `Validation and cleanup` (status:todo)
  - Task ID: T06
  - Goal: Validate the completed feature set, remove temporary scaffolding, and sync durable context for future sessions.
  - Boundaries (in/out of scope): In - full relevant checks, UI smoke testing, context updates for changed components/helpers/patterns/glossary. Out - new feature expansion beyond current-weather risk badges and temperature units.
  - Done when: All implemented tasks pass verification, no temporary debug code remains, plan statuses/evidence are current, and `context/` reflects the resulting current state.
  - Verification notes (commands or checks): Run the repository's full lint/typecheck/test/build checks as available; verify current-weather badges and Celsius/Fahrenheit persistence manually; update relevant context files such as `overview.md`, component docs, patterns, glossary, and any new helper docs.

## Open questions

- None blocking. Thresholds for risk badge categories are implementation details for T01 and should be documented in the helper/context once chosen.
