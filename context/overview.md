# Overview

Forecastly is a modern weather forecasting web application built with Next.js 16, TypeScript, Tailwind CSS, and the App Router.

The active route tree lives in the repository-root `app/` directory. The root layout provides the app-wide Forecastly shell: static Forecastly metadata, a text-only header, and a mobile-first content container capped at about 1200px. The home page currently shows a temporary Forecastly onboarding placeholder while weather search and forecast features are not yet implemented.

Reusable Forecastly app-domain TypeScript interfaces live under the repository-root `types/` directory. The current domain model layer includes city-related interfaces in `types/city.ts` and weather forecast interfaces in `types/weather.ts`; these are type-only contracts with no runtime data fetching or UI behavior.

The first runtime data service lives in `lib/geocoding.ts`. It exposes a UI-free `searchCities(query: string)` function that queries the Open-Meteo Geocoding API, validates provider data, normalizes valid rows into `CitySearchResult` objects, returns `[]` for empty/no-result searches, and throws `GeocodingError` for provider/network/payload failures.
