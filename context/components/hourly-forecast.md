# HourlyForecast Component

A reusable display-only Client Component that renders a shadcn Card with horizontally scrollable hourly weather entries. Defined in `components/weather/HourlyForecast.tsx`. All data arrives via props — no API calls or side effects.

## Props

| Prop | Type | Description |
|---|---|---|
| `hourly` | `HourlyForecast[]` | Array of hourly forecast rows (typically `forecast.hourly.slice(0, 24)`) |

Each item in `hourly` conforms to the `HourlyForecast` type from `@/types/weather`:
| Field | Source | Display |
|---|---|---|
| `time` | ISO string | Formatted hour via `Intl.DateTimeFormat` ("2 PM") |
| `condition.emoji` | Weather emoji | `text-2xl` emoji with `aria-label` from `condition.description` |
| `temperature` | Numeric (°C) | `Math.round()` with `°` suffix |
| `precipitationProbability` | Numeric (%) | Shown as `N%`; only rendered when defined |

## Layout

- **CardHeader**: `CardTitle` "Hourly Forecast".
- **CardContent**: A `flex overflow-x-auto pb-2` horizontal scroll container with `role="list"` and `aria-label="Hourly weather forecast"`.
- **Each hour entry**: A `min-w-[80px]` flex column (`role="listitem"`) containing:
  - Time label (`text-xs text-muted-foreground`)
  - Weather emoji (`text-2xl`)
  - Temperature (`text-sm font-semibold`)
  - Precipitation probability (`text-xs text-muted-foreground`)

## States

A pure presentational component — all visual states (loading, error, empty) are the caller's responsibility. The component renders whatever prop values it receives without validation or fallback.

## Dependencies

- `@/components/ui/card` (Card, CardHeader, CardTitle, CardContent)
- `@/types/weather` (HourlyForecast type)
- `"use client"` directive for Next.js client-side interactivity

Related: [weather types](../domain-models/weather.md), [current-weather-card](./current-weather-card.md), [shadcn/ui primitives](./shadcn-ui.md), [patterns.md](../patterns.md)
