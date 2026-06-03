# Architecture

- Forecastly uses Next.js 16 with the App Router.
- The active route tree currently lives under the repository-root `app/` directory, not `src/app/`.
- Core app entry points are `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`.
- The project uses TypeScript and Tailwind CSS.
- Repository-root `types/` contains erased TypeScript-only app-domain model contracts. `types/city.ts` defines normalized city models, and `types/weather.ts` defines normalized weather condition, current, hourly, daily, and aggregate forecast models that reference `City` through a type-only import. Runtime integrations map provider data into these contracts without mirroring raw API responses.
- `lib/geocoding.ts` is the current external-data service layer. It is framework-light and UI-free, calls the Open-Meteo Geocoding API with `fetch`, validates unknown provider payloads, filters invalid rows, normalizes valid rows into `CitySearchResult`, and exposes typed `GeocodingError` failures for callers.
- `app/layout.tsx` defines static Forecastly metadata and the shared root app shell.
- The shell renders a text-only Forecastly header above a `main` content region constrained to `max-w-[1200px]` with responsive padding.
- `app/page.tsx` is a static Server Component that renders the temporary Forecastly onboarding placeholder inside the root shell; it has no image imports, external links, buttons, data fetching, or weather functionality yet.
- `app/globals.css` defines Tailwind v4 theme tokens for background, foreground, and Geist font variables, including dark-mode color defaults.
