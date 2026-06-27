# DailyForecast Component

A reusable display-only Client Component that renders a shadcn Card with daily high/low temperature and precipitation trend charts plus a responsive daily weather forecast layout. Defined in `components/weather/DailyForecast.tsx`. All data arrives via props — no API calls or side effects.

## Props

| Prop | Type | Description |
|---|---|---|
| `daily` | `DailyForecast[]` | Array of daily forecast rows (typically `forecast.daily` for 7 days) |
| `unit` | `TemperatureUnit` | Selected display unit; daily Celsius values are converted for display |

Each item in `daily` conforms to the `DailyForecast` type from `@/types/weather`:
| Field | Source | Display |
|---|---|---|
| `date` | String date | Day of week (e.g. "Mon") + full date (e.g. "Jan 15") |
| `condition.emoji` | Weather emoji | Prominent emoji with `aria-label` from `condition.description` |
| `temperatureMax` | Numeric (°C) | Converted via `convertTemperature()` and labeled as `°C` or `°F` (bold, primary) |
| `temperatureMin` | Numeric (°C) | Converted via `convertTemperature()` and labeled as `°C` or `°F` (muted, secondary) |
| `precipitationProbabilityMax` | Numeric (%) | Shown as `N% rain`; only rendered when defined |

## Layout

- **CardHeader**: Weather-themed eyebrow plus `CardTitle` "7-Day Forecast".
- **CardContent**: A `ForecastTrendChart` followed by a responsive forecast container:
- **Trend chart**: Maps displayed daily rows into high-temperature, low-temperature, and defined-precipitation series. Missing `precipitationProbabilityMax` values are omitted from the precipitation series. Temperature labels use the selected `unit` through `ForecastTrendChart`.
- **Forecast container**:
  - **Mobile (< 768px)**: `flex overflow-x-auto` horizontal scroll with snap-aligned individual day cards at `min-w-[118px]`
  - **Desktop (≥ 768px)**: `md:grid md:grid-cols-7` grid layout showing all 7 days without scrolling
- **Each day entry**: A rounded, shadowed forecast tile containing:
  - Day label
  - Full date (`text-xs text-muted-foreground`)
  - Weather emoji
  - Max/min temperature range (max in bold, min muted)
  - Optional precipitation pill

## States

A pure presentational component — all visual states (loading, error, empty) are the caller's responsibility. The component renders whatever prop values it receives without validation or fallback.

## Dependencies

- `@/components/ui/card` (Card, CardHeader, CardTitle, CardContent)
- `@/components/weather/ForecastTrendChart` (dependency-free SVG trend visualization)
- `@/types/weather` (DailyForecast type)
- `@/hooks/useTemperatureUnit` (`TemperatureUnit` type and `convertTemperature()` display helper)
- `"use client"` directive for Next.js client-side interactivity

Related: [weather types](../domain-models/weather.md), [hourly-forecast](./hourly-forecast.md), [temperature unit hook](../hooks/use-temperature-unit.md), [shadcn/ui primitives](./shadcn-ui.md), [patterns.md](../patterns.md)
