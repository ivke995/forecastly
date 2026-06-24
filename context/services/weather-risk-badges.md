# Weather Risk Badges Helper

`lib/weather-risk-badges.ts` is Forecastly's deterministic, UI-free current-weather risk badge utility. It derives compact risk metadata from normalized `CurrentWeather` data only; it does not render UI, call services, access storage, or change provider requests.

## Public API

- `getCurrentWeatherRiskBadges(current: CurrentWeather): WeatherRiskBadge[]` returns stable-ordered badge metadata for the current weather snapshot.
- `WeatherRiskBadge` has `id`, `icon`, `label`, `description`, and `tone` fields.
- `WeatherRiskBadgeId` currently covers `storm`, `heavy-rain`, `fog`, `snow`, `strong-wind`, `extreme-heat`, `extreme-cold`, and `severe-condition`.
- `WeatherRiskBadgeTone` is the display tone contract: `"caution" | "danger" | "cold" | "heat"`.

## Rules and thresholds

1. **Storm** — WMO/Open-Meteo codes `95`, `96`, `99`, or condition label/description text containing storm/thunderstorm.
2. **Heavy rain** — codes `65`, `67`, `82`, heavy/violent rain text, or current precipitation `>= 7.6` mm/h.
3. **Fog** — codes `45`, `48`, or condition text containing fog.
4. **Snow** — codes `71`, `73`, `75`, `77`, `85`, `86`, or condition text containing snow.
5. **Strong wind** — current wind speed `>= 40` km/h or gusts `>= 50` km/h.
6. **Extreme heat** — apparent temperature when present, otherwise current temperature, `>= 35` °C.
7. **Extreme cold** — apparent temperature when present, otherwise current temperature, `<= -10` °C.
8. **Severity fallback** — `WeatherCondition.severity` of `"high"` or `"severe"` yields a generic high-impact/severe badge only when no condition-specific storm/rain/fog/snow badge was derived.

## Behavior

- Output order follows the rule order above and is stable for identical input.
- Badges are de-duplicated by `id`.
- Optional values are skipped when absent; missing precipitation/wind/gust/apparent-temperature values do not throw.
- Weather values use Forecastly's canonical normalized units: Celsius temperatures and km/h wind speeds.

## Boundaries

- Rendering belongs to `CurrentWeatherCard` or caller wiring in a later task.
- Hourly/daily risk badges are out of scope for this helper.
- Open-Meteo request and normalization behavior remains unchanged.

Related: [weather domain models](../domain-models/weather.md), [weather-code mapper](./weather-codes.md), [weather service](./weather.md), [architecture.md](../architecture.md), [patterns.md](../patterns.md)
