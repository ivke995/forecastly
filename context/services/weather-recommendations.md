# Weather Recommendations Helper

`lib/weather-recommendations.ts` is Forecastly's deterministic weather-recommendation utility. It is UI-free and framework-light: no React imports, API calls, storage, or dependencies beyond Forecastly's own `WeatherForecast` type.

## Public API

- `getWeatherRecommendations(forecast: WeatherForecast): WeatherRecommendation[]` returns a stable-ordered, capped list of advice items derived entirely from the existing normalized forecast data.
- `WeatherRecommendation` has `id` (stable key), `icon` (emoji string), `title` (short label), and `description` (one-sentence advice).

## Recommendation rules

1. **Umbrella/rain** — triggered when current precipitation > 0, current/hourly/today condition code is rainy, hourly precipitation probability > 50% within the next 6 hours, today's precipitation sum > 0, or today's max precipitation probability > 50%.
2. **Sun protection/heat** — triggered when current temperature > 28 °C, or when clear sky (code 0/1) and temperature > 25 °C.
3. **Windy conditions** — triggered when current wind speed > 30 km/h, current wind gusts > 40 km/h, today's max wind speed > 30 km/h, or today's max wind gusts > 40 km/h.
4. **High humidity** — triggered when current relative humidity > 70%.
5. **Severe weather alert** — triggered when current or today's condition severity is `"high"` or `"severe"`.
6. **Good running weather** — triggered when temperature is 10–26 °C, wind speed is < 15 km/h (or missing), no precipitation, and condition severity is `"low"`.

## Behavior

- Rules that require an optional value (e.g., `relativeHumidity`, `windSpeed`, `precipitation`) silently skip themselves when the value is `undefined`. No runtime errors from missing data.
- The function runs all rules and returns recommendations in the rule order listed above. The output array is stable across calls with identical input.
- No cap is needed because there are only 6 rules; the caller (T03) may display all or truncate for UI brevity.

## Boundaries

- `lib/weather-recommendations.ts` returns typed recommendation data only; it does not render UI, call services, modify state, or perform side effects.
- Rain codes reference the same WMO/Open-Meteo code set documented in [weather-codes.md](./weather-codes.md) for drizzle, rain, rain showers, and thunderstorm conditions.
- UI rendering and presentation belong to caller code in `app/page.tsx` or future component code (see [T03 rendering task](../plans/weather-summary-recommendations.md)).

Related: [weather service](./weather.md), [weather domain models](../domain-models/weather.md), [weather-codes mapper](./weather-codes.md), [overview.md](../overview.md)
