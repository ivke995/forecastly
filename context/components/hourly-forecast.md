# HourlyForecast Component

A reusable display-only Client Component that renders a shadcn Card with an hourly temperature/precipitation trend chart and horizontally scrollable hourly weather entries. Defined in `components/weather/HourlyForecast.tsx`. All data arrives via props — no API calls or side effects.

## Props

| Prop | Type | Description |
|---|---|---|
| `hourly` | `HourlyForecast[]` | Array of hourly forecast rows (typically `forecast.hourly.slice(0, 24)`) |
| `unit` | `TemperatureUnit` | Selected display unit; hourly Celsius values are converted for display |

Each item in `hourly` conforms to the `HourlyForecast` type from `@/types/weather`:
| Field | Source | Display |
|---|---|---|
| `time` | ISO string | Formatted hour via `Intl.DateTimeFormat` ("2 PM") |
| `condition.emoji` | Weather emoji | Prominent emoji with `aria-label` from `condition.description` |
| `temperature` | Numeric (°C) | Converted via `convertTemperature()` and labeled as `°C` or `°F` |
| `precipitationProbability` | Numeric (%) | Shown as `N% rain`; only rendered when defined |

## Layout

- **CardHeader**: Weather-themed eyebrow plus `CardTitle` "Hourly Forecast".
- **CardContent**: A `ForecastTrendChart` followed by a `Timeline` label and a rounded `flex overflow-x-auto`/snap horizontal scroll container with `role="list"` and `aria-label="Hourly weather forecast"`.
- **Trend chart**: Maps displayed hourly rows into one temperature series from `temperature` and one precipitation series from defined `precipitationProbability` values. Missing precipitation probabilities are omitted from the precipitation series. Temperature labels use the selected `unit` through `ForecastTrendChart`.
- **Each hour entry**: A rounded, shadowed snap card (`role="listitem"`) containing:
  - Time label
  - Weather emoji
  - Converted temperature
  - Optional precipitation pill

## States

A pure presentational component — all visual states (loading, error, empty) are the caller's responsibility. The component renders whatever prop values it receives without validation or fallback.

## Dependencies

- `@/components/ui/card` (Card, CardHeader, CardTitle, CardContent)
- `@/components/weather/ForecastTrendChart` (dependency-free SVG trend visualization)
- `@/types/weather` (HourlyForecast type)
- `@/hooks/useTemperatureUnit` (`TemperatureUnit` type and `convertTemperature()` display helper)
- `"use client"` directive for Next.js client-side interactivity

Related: [weather types](../domain-models/weather.md), [current-weather-card](./current-weather-card.md), [temperature unit hook](../hooks/use-temperature-unit.md), [shadcn/ui primitives](./shadcn-ui.md), [patterns.md](../patterns.md)
