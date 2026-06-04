# Weather Domain Models

`types/weather.ts` defines Forecastly's weather forecast app-domain interfaces. These models are normalized contracts suitable for Open-Meteo-derived weather data, not raw provider response mirrors.

## Interfaces

- `WeatherCondition` stores a WMO/Open-Meteo-compatible numeric `code` with human-readable `label` and `description` text.
- `CurrentWeather` stores an ISO `time`, required temperature, optional apparent-temperature/humidity/precipitation/wind/daylight measurements, and a `WeatherCondition`.
- `HourlyForecast` stores an ISO `time`, required temperature, optional apparent-temperature/humidity/precipitation probability/precipitation/wind measurements, and a `WeatherCondition`.
- `DailyForecast` stores a string `date`, min/max temperatures, optional sunrise/sunset/precipitation/wind summary fields, and a `WeatherCondition`.
- `WeatherForecast` is the aggregate model for a `City`, timezone, current conditions, explicitly typed hourly and daily arrays, and ISO/API-friendly `updatedAt` text.

## Boundaries

- Type files contain only erased TypeScript contracts.
- `types/weather.ts` may reference `City` only with a type-only import.
- Weather time, date, and update fields are strings, not `Date` objects.
- Do not add API clients, fetch calls, raw response mirrors, mappers, weather-code lookup tables, mock data, UI imports, runtime enums, classes, or dependency changes to `types/weather.ts`.
- Open-Meteo integrations map provider payloads into these Forecastly domain fields; service-specific provider response shapes and weather-code mappers stay outside `types/weather.ts`.

Related: [city.md](./city.md), [weather service](../services/weather.md), [architecture.md](../architecture.md), [patterns.md](../patterns.md), [glossary.md](../glossary.md)
