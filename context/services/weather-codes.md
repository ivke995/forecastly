# Weather-Code Mapper

`lib/weather-codes.ts` is Forecastly's canonical WMO/Open-Meteo weather-code mapper. It is UI-free and framework-light: no React imports, Next.js route APIs, fetch calls, provider request logic, persistence, telemetry, or dependencies.

## Public API

- `getWeatherCondition(code: number): WeatherCondition` returns a Forecastly weather condition with `code`, `label`, `description`, `emoji`, and `severity`.
- Known WMO/Open-Meteo codes map to stable condition metadata.
- Unknown finite numeric codes preserve the input code and return the safe unknown-condition fallback with `❔` and `low` severity.

## Supported codes

The mapper covers the Open-Meteo/WMO codes currently relevant to Forecastly forecasts: `0`, `1`, `2`, `3`, `45`, `48`, `51`, `53`, `55`, `56`, `57`, `61`, `63`, `65`, `66`, `67`, `71`, `73`, `75`, `77`, `80`, `81`, `82`, `85`, `86`, `95`, `96`, and `99`.

## Severity policy

- `low`: clear, cloudy, fog, and light precipitation/snow conditions.
- `moderate`: moderate precipitation/snow and dense drizzle conditions.
- `high`: heavy, freezing, and non-hail thunderstorm conditions.
- `severe`: violent showers and hail thunderstorm conditions.

## Boundaries

- `lib/weather-codes.ts` returns Forecastly domain mapping only; it does not expose raw provider response shapes.
- `lib/open-meteo.ts` imports `getWeatherCondition` for current/hourly/daily forecast normalization instead of maintaining a duplicate local WMO table.
- UI rendering and emoji/icon presentation policy belong to future UI code; this mapper only supplies the normalized domain condition metadata.

Related: [weather service](./weather.md), [weather domain models](../domain-models/weather.md), [architecture.md](../architecture.md), [patterns.md](../patterns.md), [glossary.md](../glossary.md)
