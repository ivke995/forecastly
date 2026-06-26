# Home Page

`app/page.tsx` is the Forecastly home route and is a `'use client'` component.

## Responsibilities

- Own route-level weather selection state: selected city/location, forecast data, loading, error, and non-blocking location notices.
- Render `CitySearch` and call `getWeatherForecast(city)` when a searched city is selected.
- Render a `Use my location` action beside city search.
- Own browser geolocation orchestration for the location action.
- Pass normalized forecast data and selected temperature unit into display-only weather components.

## Use my location flow

- Unsupported geolocation immediately shows a user-readable error and leaves users able to search for a city.
- Supported browsers call `navigator.geolocation.getCurrentPosition()` with a 10-second timeout and cached-position allowance.
- Approved coordinates are passed to `resolveCoordinateLocation()` with the browser time zone from `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- The returned `CitySearchResult`-compatible location is used with `getWeatherForecast()` through the same forecast rendering path as city search.
- Coordinate fallback display is non-blocking: the page shows a notice when no readable nearby place name is available, then renders the forecast with the coordinate-backed display name.
- Permission denied, unavailable position, timeout, coordinate-location errors, and weather-forecast errors are displayed as readable page-level error messages.

## Boundaries

- No persistence for geolocated locations.
- No favorites integration for coordinate locations.
- No server route or map/radar UI.
- Unit switching remains client-side display conversion and does not refetch forecasts.

Related: [coordinate-location.md](../services/coordinate-location.md), [weather.md](../services/weather.md), [city-search.md](../components/city-search.md)
