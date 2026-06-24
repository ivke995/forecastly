# CurrentWeatherCard Component

A reusable display-only Client Component that renders a shadcn Card with current weather conditions. Defined in `components/weather/CurrentWeatherCard.tsx`. All data arrives via props — no API calls or side effects.

## Props

| Prop | Type | Description |
|---|---|---|
| `cityName` | `string` | City name text |
| `country` | `string` | Country name (`City.country`) |
| `temperature` | `number` | Current temperature (°C) |
| `feelsLike` | `number` | Apparent/feels-like temperature (°C) |
| `humidity` | `number` | Relative humidity percentage |
| `windSpeed` | `number` | Wind speed (km/h) |
| `weatherIcon` | `string` | Emoji string from `WeatherCondition.emoji` |
| `weatherDescription` | `string` | Human-readable condition description (`WeatherCondition.description`) |

Usage note: values correspond to fields on `CurrentWeather` (`temperature`, `apparentTemperature`, `relativeHumidity`, `windSpeed`) and `WeatherCondition` (`emoji`, `description`), but the component receives them as flat props for maximum reusability. `app/page.tsx` renders this card above hourly/daily forecasts after a successful city search, using `forecast.current.temperature` as the fallback for missing apparent temperature and `0` for missing humidity or wind speed.

## Layout

- **CardHeader**: City name + country in the `CardTitle`, "Current Weather" subtitle in `CardDescription`.
- **CardContent**: Large weather emoji (`text-5xl`) and temperature (`text-4xl font-bold`) in a prominent flex row.
- **Detail grid**: Feels like, humidity, wind, and description in a responsive grid:
  - **Mobile** (`grid-cols-1`): single-column stack.
  - **Wider screens** (`md:grid-cols-2`): two-column grid; description spans full width (`md:col-span-2`).
- Each detail field is wrapped in a subtle `bg-muted/50` rounded box for visual separation.

## States

A pure presentational component — all visual states (loading, error, empty) are the caller's responsibility. The component renders whatever prop values it receives without validation or fallback.

## Dependencies

- `@/components/ui/card` (Card, CardHeader, CardTitle, CardDescription, CardContent)
- `"use client"` directive for Next.js client-side interactivity

Related: [weather types](../domain-models/weather.md), [city domain models](../domain-models/city.md), [shadcn/ui primitives](./shadcn-ui.md)
