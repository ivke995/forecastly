# Coordinate Location Helpers

`lib/coordinate-location.ts` is the UI-free bridge between browser geolocation coordinates and Forecastly's existing city/forecast contracts.

## Contract

- `createCoordinateCity(input)` validates latitude/longitude and returns a `CitySearchResult`-compatible coordinate location.
- `resolveCoordinateLocation(input)` returns `{ city, source, lookupError? }`.
- `formatCoordinateDisplay(input)` returns deterministic fallback copy like `Your location (12.34, 56.78)`.
- `CoordinateLocationError` represents invalid coordinates and readable lookup failures.

## Behavior

- Latitude must be finite and between `-90` and `90`; longitude must be finite and between `-180` and `180`.
- Missing/blank timezone falls back to `auto`, which is compatible with the Open-Meteo forecast request.
- Coordinate fallback cities use stable IDs in the form `coordinates:{lat},{lon}` rounded to 4 decimal places.
- Coordinate fallback cities keep `name: "Your location"`, `country: "Coordinates"`, exact input coordinates, and a deterministic `displayName` rounded to 2 decimal places.
- Readable display lookup uses Open-Meteo reverse geocoding with no extra dependency.
- Reverse lookup success keeps the exact browser coordinates for forecast accuracy while adopting readable `name`, `displayName`, country/admin metadata, optional population/elevation, and provider timezone when present.
- Reverse lookup no-results, non-OK responses, malformed payloads, parse failures, and network failures all return the coordinate fallback result instead of blocking weather fetches.

## Boundaries

- No React, browser permission prompts, localStorage, favorites integration, maps, or forecast fetching.
- Callers own browser geolocation orchestration and pass the returned `city` to `getWeatherForecast(city)`.

Related: [geocoding.md](./geocoding.md), [weather.md](./weather.md), [city.md](../domain-models/city.md)
