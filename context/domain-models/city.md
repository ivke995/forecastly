# City Domain Models

`types/city.ts` defines Forecastly's city-related app-domain interfaces. These models are normalized application contracts suitable for data derived from geocoding/Open-Meteo sources, not raw provider response mirrors. The runtime geocoding service in `lib/geocoding.ts` returns `CitySearchResult` objects populated from validated Open-Meteo rows.

## Interfaces

- `City` is the canonical city model with stable `id`, `name`, `displayName`, country/admin metadata, coordinates, and timezone.
- `CitySearchResult` extends `City` for search/geocoding result rows and may include optional `population` and `elevation` metadata.
- `FavoriteCity` is the persisted favorite-city shape with `id`, `cityId`, city display/location fields, timezone, and ISO/API-friendly `createdAt` string.

## Boundaries

- Type files contain only erased TypeScript contracts.
- Do not add API clients, fetch calls, raw response mirrors, mappers, mock data, UI imports, runtime enums, classes, or dependency changes to `types/city.ts`.
- Geocoding/weather integrations should import these contracts with type-only imports and map provider data into Forecastly domain fields outside the `types/` layer.

Related: [architecture.md](../architecture.md), [patterns.md](../patterns.md), [glossary.md](../glossary.md)
