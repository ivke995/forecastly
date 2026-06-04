# Context Map

- `context/overview.md` — high-level current-state project description.
- `context/architecture.md` — current architecture notes and diagrams.
- `context/patterns.md` — established reusable implementation patterns.
- `context/glossary.md` — project terms and definitions.
- `context/domain-models/city.md` — city-domain type model contracts and boundaries.
- `context/domain-models/weather.md` — weather forecast type model contracts and boundaries.
- `context/services/geocoding.md` — current Open-Meteo city-search service contract, behavior, and boundaries.
- `context/components/city-search.md` — reusable CitySearch autocomplete Client Component that wraps the geocoding service.
- `context/components/current-weather-card.md` — reusable CurrentWeatherCard display-only Client Component with shadcn Card and typed weather props.
- `context/components/hourly-forecast.md` — reusable HourlyForecast display-only Client Component with shadcn Card and horizontally scrollable hourly forecast entries.
- `context/components/shadcn-ui.md` — shadcn/ui component library configuration, available primitives, and usage patterns.
- `context/services/weather.md` — current Open-Meteo forecast service contract, behavior, request shape, and boundaries.
- `context/services/weather-codes.md` — canonical WMO/Open-Meteo weather-code mapper contract, supported codes, fallback behavior, and severity policy.
- `context/plans/` — active implementation plans with task checklists.
- `context/decisions/` — durable architecture/product decisions.
- `context/handovers/` — handover notes for transferring work between sessions.
- `context/tmp/` — temporary scratch space; contents are ignored except `.gitignore`.
