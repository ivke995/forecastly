# WeatherRecommendations Component

`components/weather/WeatherRecommendations.tsx` is a display-only Client Component for showing deterministic weather advice near the current-weather summary on the home page.

## Contract

- Props: `recommendations: WeatherRecommendation[]` from `lib/weather-recommendations.ts`.
- Renders a weather-themed shadcn `Card` titled `Recommendations` with a small guidance eyebrow and responsive one-column/two-column advice items.
- Each item uses the recommendation `id` as a stable key and displays its `icon`, `title`, and `description` in rounded, hoverable advice tiles.
- Returns `null` when the recommendations list is empty so the home page does not show broken or empty UI.

## Boundaries

- No API calls, state management, storage, or recommendation-rule logic.
- Recommendation rule logic remains in the UI-free helper documented in [weather-recommendations.md](../services/weather-recommendations.md).
- The home page computes `getWeatherRecommendations(forecast)` after a successful forecast fetch and passes the resulting list into this component.

Related: [current weather card](./current-weather-card.md), [hourly forecast](./hourly-forecast.md), [daily forecast](./daily-forecast.md), [overview.md](../overview.md)
