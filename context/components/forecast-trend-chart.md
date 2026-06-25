# ForecastTrendChart Component

A reusable display-only Client Component for dependency-free forecast trend visualizations. Defined in `components/weather/ForecastTrendChart.tsx`. It renders small SVG trend charts from typed temperature and precipitation series props; it does not fetch data, persist state, or depend on chart libraries.

## Props

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Visible chart heading and accessible label source |
| `description` | `string` | Visible chart description and accessible description source |
| `unit` | `TemperatureUnit` | Selected display unit used to convert temperature series labels/points |
| `temperatureSeries` | `ForecastTrendSeries<TemperatureTrendPoint>[]` | Optional one-or-more temperature lines, with source values in Celsius |
| `precipitationSeries` | `ForecastTrendSeries<PrecipitationTrendPoint>[]` | Optional one-or-more precipitation lines, with source values as percentages |
| `className` | `string` | Optional wrapper class merge via `cn()` |

## Series contracts

- `TemperatureTrendPoint`: `{ label: string; valueCelsius: number }`
- `PrecipitationTrendPoint`: `{ label: string; valuePercent: number }`
- `ForecastTrendSeries<TPoint>`: `{ id: string; label: string; points: TPoint[]; tone?: "primary" | "secondary" | "muted" }`

Temperature values are converted with `convertTemperature(celsius, unit)` so chart labels and y-positioning follow the selected Celsius/Fahrenheit display unit without refetching forecast data. Precipitation values are clamped to `0..100` for rendering.

## Rendering and accessibility

- Uses plain SVG paths/circles plus Tailwind classes; no chart package dependency.
- Visible `figcaption` provides title and description; the SVG references those labels with `aria-labelledby`.
- Each plotted circle includes a `<title>` with series, point label, and value.
- A screen-reader-only list exposes every series value in text form.
- Empty input renders a clear "No trend data available" fallback.
- Flat temperature series receive small y-range padding, and single-point series render as markers instead of invalid paths.

## Boundaries

- Integration into `HourlyForecast` and `DailyForecast` is separate; callers own selecting and shaping forecast rows.
- Browser geolocation and provider request changes are outside this component.
- The component is display-only and should remain free of API calls, storage access, and new dependencies.

Related: [hourly-forecast](./hourly-forecast.md), [daily-forecast](./daily-forecast.md), [temperature unit hook](../hooks/use-temperature-unit.md), [weather types](../domain-models/weather.md), [patterns.md](../patterns.md)
