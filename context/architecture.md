# Architecture

- Forecastly uses Next.js 16 with the App Router.
- The active route tree currently lives under the repository-root `app/` directory, not `src/app/`.
- Core app entry points are `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`.
- The project uses TypeScript and Tailwind CSS.
- Repository-root `types/` contains erased TypeScript-only app-domain model contracts. `types/city.ts` defines normalized city models, and `types/weather.ts` defines normalized weather condition, current, hourly, daily, and aggregate forecast models that reference `City` through a type-only import. Runtime integrations map provider data into these contracts without mirroring raw API responses.
- Repository-root `lib/` contains framework-light, UI-free external-data services that call Open-Meteo with `fetch`, validate `unknown` provider payloads, keep provider response interfaces local, normalize valid data into Forecastly domain contracts, and expose typed service errors for callers.
- `lib/geocoding.ts` queries the Open-Meteo Geocoding API, filters invalid result rows, normalizes valid rows into `CitySearchResult`, returns `[]` for empty/no-result searches, and throws `GeocodingError` for provider failures.
- `lib/open-meteo.ts` queries the Open-Meteo Forecast API for a seven-day forecast, validates current/hourly/daily provider sections, maps WMO weather codes into `WeatherCondition`, normalizes valid data into `WeatherForecast`, skips malformed hourly/daily rows without returning partial domain objects, and throws `WeatherForecastError` for API/network/parse/malformed-payload failures.
- `app/layout.tsx` defines static Forecastly metadata and the shared root app shell.
- The shell renders a text-only Forecastly header above a `main` content region constrained to `max-w-[1200px]` with responsive padding.
- `app/page.tsx` is a static Server Component that renders the temporary Forecastly onboarding placeholder inside the root shell; it has no image imports, external links, buttons, data fetching, or weather functionality yet.
- `app/globals.css` defines Tailwind v4 theme tokens for background, foreground, and Geist font variables, including dark-mode color defaults.
