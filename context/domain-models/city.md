# City Domain Models

`types/city.ts` defines Forecastly's city-related app-domain interfaces. These models are normalized application contracts suitable for data derived from geocoding/Open-Meteo sources, not raw provider response mirrors.

## Interfaces

- `City` is the canonical city model with stable `id`, `name`, `displayName`, country/admin metadata, coordinates, and timezone.
- `CitySearchResult` extends `City` for search/geocoding result rows and may include optional `population` and `elevation` metadata.
- `FavoriteCity` is the persisted favorite-city shape with `id`, `cityId`, city display/location fields, timezone, and ISO/API-friendly `createdAt` string.

## Boundaries

- Type files contain only erased TypeScript contracts.
- Do not add API clients, fetch calls, raw response mirrors, mappers, mock data, UI imports, runtime enums, classes, or dependency changes to `types/city.ts`.
- Future geocoding/weather integrations should map provider data into these Forecastly domain fields.

Related: [architecture.md](../architecture.md), [patterns.md](../patterns.md), [glossary.md](../glossary.md)
