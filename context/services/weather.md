# Weather Forecast Service

`lib/open-meteo.ts` is Forecastly's reusable Open-Meteo forecast service. It is UI-free and framework-light, with no React imports, route handlers, caching strategy, persistence, telemetry, or new dependencies.

## Public API

- `getWeatherForecast(city: City): Promise<WeatherForecast>` fetches and normalizes a seven-day forecast for the provided Forecastly `City`.
- `WeatherForecastError` is the typed error callers can catch for API, network, parse, or malformed-payload failures.

## Provider request

- Endpoint: `https://api.open-meteo.com/v1/forecast`.
- Location/timezone parameters come from the input city: `latitude`, `longitude`, and `timezone`.
- Forecast horizon is explicit with `forecast_days=7`.
- Current variables: `temperature_2m`, `apparent_temperature`, `relative_humidity_2m`, `weather_code`, `wind_speed_10m`.
- Hourly variables: `temperature_2m`, `precipitation_probability`, `wind_speed_10m`, `weather_code`.
- Daily variables: `temperature_2m_min`, `temperature_2m_max`, `precipitation_probability_max`, `weather_code`.

## Behavior

- Provider JSON is handled as `unknown` and must be an object before normalization.
- Required `current`, `hourly`, and `daily` sections must be object-shaped; missing required current values or missing required hourly/daily arrays throw `WeatherForecastError`.
- The returned `WeatherForecast.city` is the input city.
- The returned timezone uses valid provider `timezone` data when present and falls back to `city.timezone` otherwise.
- `current` includes time, temperature, apparent temperature, relative humidity, wind speed, and a mapped `WeatherCondition`.
- `hourly[]` includes only complete rows with time, temperature, precipitation probability, wind speed, and condition.
- `daily[]` includes only complete rows with date, min/max temperature, precipitation probability max, and condition.
- If hourly or daily provider arrays produce no complete rows, the service rejects the payload instead of returning an invalid fallback forecast.
- `updatedAt` is set to an ISO/API-friendly string when normalization completes.
- WMO/Open-Meteo weather codes are mapped through `getWeatherCondition` from `lib/weather-codes.ts`; unknown finite numeric codes preserve the code and use a safe low-severity unknown condition.

## Boundaries

- The service returns Forecastly domain models, not raw Open-Meteo response shapes.
- Provider response interfaces remain local to `lib/open-meteo.ts`; reusable weather-code lookup data belongs in `lib/weather-codes.ts`.
- UI rendering, route handlers, geocoding, favorites, persistence, caching/rate limiting, telemetry, mock data, and dependency changes are separate concerns.

Related: [overview.md](../overview.md), [architecture.md](../architecture.md), [patterns.md](../patterns.md), [weather domain models](../domain-models/weather.md), [weather-code mapper](./weather-codes.md), [geocoding service](./geocoding.md)
