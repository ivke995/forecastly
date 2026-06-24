# Weather Summary and Recommendations

## Change summary

Wire the existing `CurrentWeatherCard` into `app/page.tsx` so selected-city results show current temperature, feels-like temperature, humidity, wind speed, condition, and city before hourly and daily forecast details. Add deterministic weather recommendations that match the app tagline, using existing normalized forecast data only.

## Assumptions

- No new API, external dependency, persistence, or server route is needed.
- Recommendations should be derived client-side from the existing `WeatherForecast` object returned by `getWeatherForecast`.
- A small reusable weather-domain component/helper is acceptable if it keeps `app/page.tsx` readable.
- Show recommendations near the current weather summary, before hourly/daily forecasts.
- Use simple threshold rules based on current weather, next-day daily summary, and the first several hourly rows where helpful.
- If optional weather values are missing, skip only rules that require those values rather than blocking the whole recommendations UI.

## Success criteria

- `app/page.tsx` imports and renders `CurrentWeatherCard` after a successful city selection and before `HourlyForecast`/`DailyForecast`.
- The current summary displays city, current temperature, feels-like, humidity, wind, and condition using `forecast.current` and `forecast.city`/`selectedCity` data.
- Missing optional `CurrentWeather` values are handled gracefully with deterministic defaults or fallback display values suitable for the existing card prop contract.
- Weather recommendations are displayed in the successful forecast state.
- Recommendations include advice categories such as umbrella/rain, sunscreen/heat/clear conditions, windy commute, humidity/comfort, severe-weather caution, and good running weather when matching conditions are present.
- Recommendations are derived from existing temperature, precipitation probability/amount, wind, humidity, and condition severity fields; no provider-specific raw payload access is introduced.
- Recommendation logic is testable/reviewable and not duplicated across components.
- The existing loading, error, and empty states remain intact.
- TypeScript, lint, and production build checks pass.
- Relevant `context/` files are synced after implementation.

## Constraints and non-goals

- Do not add new weather providers, API endpoints, environment variables, or dependencies.
- Do not modify shadcn-generated primitives under `components/ui/`.
- Do not change the `getWeatherForecast` provider request unless an existing required recommendation field is unavailable from normalized data; prefer existing normalized fields.
- Do not redesign the whole home page; keep changes focused on current weather summary and recommendations placement.
- Do not add favorites, persistence, geolocation, maps, alerts, notifications, or user preference settings.
- Preserve the display-only boundary of `CurrentWeatherCard`; it should continue to receive flat props and perform no API calls or side effects.

## Task stack

- [x] T01: `Wire CurrentWeatherCard into home page` (status:done)
  - Task ID: T01
  - Goal: Render the existing `CurrentWeatherCard` in the successful forecast state before hourly and daily forecast cards.
  - Boundaries (in/out of scope): In — `app/page.tsx` import and JSX wiring; map `forecast.current` and city fields to existing flat props; handle optional current values without runtime errors. Out — recommendation UI, new components/helpers, provider/service changes, redesigning forecast cards.
  - Done when: Selecting a city shows the current-weather card above hourly/daily details; it displays city, temperature, feels-like, humidity, wind, and condition; loading/error/empty states still behave as before.
  - Verification notes (commands or checks): Run `npx tsc --noEmit`; run `npm run lint`; manually inspect `app/page.tsx` data mapping for optional `apparentTemperature`, `relativeHumidity`, and `windSpeed` fallbacks.
  - Completed: 2026-06-23
  - Files changed: `app/page.tsx`, `context/overview.md`, `context/architecture.md`, `context/components/current-weather-card.md`
  - Evidence: `npx tsc --noEmit` passed; `npm run lint` passed; `npm run build` passed; context sync completed; `CurrentWeatherCard` renders before hourly/daily forecast cards with optional current-weather fallbacks.

- [x] T02: `Add deterministic recommendation logic` (status:done)
  - Task ID: T02
  - Goal: Create a small UI-free recommendation helper that converts an existing `WeatherForecast` into a stable list of recommendation items.
  - Boundaries (in/out of scope): In — a focused helper under `lib/` or a weather-domain utility file; typed recommendation item shape; deterministic threshold rules for rain/umbrella, sunscreen/heat, wind, humidity/comfort, severe conditions, and good running weather. Out — React rendering, new API calls, model-wide rewrites, persistence, user preferences, ML/AI recommendation services.
  - Done when: Recommendation logic returns concise advice labels/messages from normalized forecast fields; rules tolerate missing optional values; output order is stable and capped to a reasonable count for UI display.
  - Verification notes (commands or checks): Run `npx tsc --noEmit`; review helper with representative inputs for rainy, sunny/hot, windy, severe, humid, and mild/low-wind scenarios.
	  - Completed: 2026-06-24
	  - Files changed: `lib/weather-recommendations.ts`
	  - Evidence: `npx tsc --noEmit` passed; `npm run lint` passed; verified with representative inputs for rainy, sunny/hot, windy, thunderstorm/severe, humid, mild/missing-optional scenarios; all rules return expected recommendations.

- [x] T03: `Render weather recommendations on home page` (status:done)
  - Task ID: T03
  - Goal: Display recommendation items in the successful forecast state near the current weather summary.
  - Boundaries (in/out of scope): In — a small presentational section/card in `app/page.tsx` or a focused `components/weather/` component; call the helper from T02; style using existing Tailwind/shadcn patterns. Out — changing helper rules, altering forecast fetching, adding new shadcn primitives unless already available and necessary, broad page redesign.
  - Done when: Users see recommendation advice such as umbrella, sunscreen, windy commute, or good running weather when matching data is present; the section is readable on mobile and desktop; no recommendations are shown as broken/empty UI.
  - Verification notes (commands or checks): Run `npx tsc --noEmit`; run `npm run lint`; manually inspect successful forecast JSX ordering: current card, recommendations, hourly, daily.
  - Completed: 2026-06-24
  - Files changed: `app/page.tsx`, `components/weather/WeatherRecommendations.tsx`, `context/overview.md`, `context/architecture.md`, `context/glossary.md`, `context/context-map.md`, `context/services/weather-recommendations.md`, `context/components/weather-recommendations.md`
  - Evidence: `npx tsc --noEmit` passed; `npm run lint` passed; `npm run build` passed; successful forecast JSX order is current card, recommendations, hourly forecast, daily forecast; `WeatherRecommendations` renders nothing for an empty recommendation list; context sync completed.

- [ ] T04: `Validate, cleanup, and sync context` (status:todo)
  - Task ID: T04
  - Goal: Confirm the full change is clean, remove temporary scaffolding, and update durable context to reflect the current app behavior.
  - Boundaries (in/out of scope): In — `npm run lint`, `npx tsc --noEmit`, `npm run build`, cleanup of temporary artifacts, updates to `context/overview.md`, `context/components/` or `context/services/`/`context/patterns.md` as needed, and this plan's validation notes. Out — additional product features or rule expansion beyond the implemented recommendations.
  - Done when: lint, type-check, and build pass; no unintended temporary files remain; context accurately states that the home page shows current weather plus recommendations before hourly/daily forecasts.
  - Verification notes (commands or checks): `npm run lint`; `npx tsc --noEmit`; `npm run build`; inspect relevant `context/` files for current-state accuracy.

## Open questions

None. User allowed implementation assumptions; see Assumptions above.
