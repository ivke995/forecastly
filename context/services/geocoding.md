# Geocoding Service

`lib/geocoding.ts` is Forecastly's reusable city-search service. It is UI-free and framework-light, with no React imports, route handlers, caching strategy, persistence, or new dependencies.

## Public API

- `searchCities(query: string): Promise<CitySearchResult[]>` searches cities through the Open-Meteo Geocoding API.
- `GeocodingError` is the typed error callers can catch for provider, network, parse, or malformed-payload failures.

## Behavior

- Queries are trimmed before use.
- Empty or whitespace-only queries return `[]` before any provider request.
- Provider requests use `https://geocoding-api.open-meteo.com/v1/search` with `name`, `count=10`, `language=en`, and `format=json` query parameters.
- A missing `results` field is treated as a no-result search and returns `[]`.
- Non-array `results`, non-object payloads, JSON parse failures, non-OK HTTP responses, and network failures throw `GeocodingError`.
- Provider rows missing required `id`, `name`, `country`, `latitude`, `longitude`, or `timezone` data are excluded.
- Valid rows are normalized into `CitySearchResult` with string `id`, readable `displayName`, coordinates, timezone, country/admin metadata when present, and optional safe `population`/`elevation` values.

## Boundaries

- The service returns Forecastly domain models, not raw Open-Meteo response shapes.
- Provider response interfaces remain local to `lib/geocoding.ts`.
- City search UI, autocomplete, weather fetching, favorites, persistence, caching, rate limiting, and telemetry are separate future concerns.

Related: [overview.md](../overview.md), [architecture.md](../architecture.md), [patterns.md](../patterns.md), [city.md](../domain-models/city.md)
