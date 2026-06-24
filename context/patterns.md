# Patterns

## Root App Shell

- Keep global page chrome in `app/layout.tsx` so App Router pages render inside a consistent shell.
- Use text-only Forecastly branding until dedicated brand assets are introduced.
- Constrain primary page content with a centered `max-w-[1200px]` container and responsive horizontal/vertical padding.
- Keep root layout concerns separate from page content; home-page copy and feature UI belong in `app/page.tsx` or future route/page components.
- Keep `app/page.tsx` focused on route-specific content; avoid duplicating layout wrappers, metadata, shared headers, or global theme concerns there.

## Theme Tokens

- Define app background, foreground, and font tokens in `app/globals.css` through Tailwind v4 `@theme inline` mappings.
- Preserve Geist font variables from `next/font/google`; use `font-sans`/`font-mono` utilities instead of hard-coded component fonts.
- Keep dark-mode-capable defaults in CSS variables so future UI can rely on `bg-background` and `text-foreground`.

## Domain Model Types

- Keep reusable app-domain interfaces in repository-root `types/` files.
- Prefer `interface` and type-only exports/imports for domain models; avoid runtime enums, classes, mock values, API calls, and dependency changes in type files.
- Normalize external weather/geocoding data into Forecastly domain fields instead of copying raw provider response shapes.
- Represent API/persistence timestamps as ISO/API-friendly `string` fields, not `Date` objects.
- Keep persisted favorite-city data compatible with the exact `FavoriteCity` shape in `types/city.ts`.
- Keep weather forecast models in `types/weather.ts` normalized around `WeatherCondition`, `CurrentWeather`, `HourlyForecast`, `DailyForecast`, and aggregate `WeatherForecast` contracts. `WeatherCondition` includes `code`, `label`, `description`, `emoji`, and string-union `severity`.
- When a forecast needs city context, reference `City` with a type-only import so the `types/` layer remains erased at runtime.

## Provider-backed Services

- Keep external API clients in repository-root `lib/` as UI-free, framework-light TypeScript modules.
- Import Forecastly domain contracts with type-only imports and normalize provider payloads into those contracts before returning data to callers.
- Treat provider JSON as `unknown`: validate top-level payload shape, validate row-level required fields, and drop invalid rows instead of leaking partial domain objects.
- Distinguish feature-specific empty states from provider failures: geocoding returns `[]` for empty/no-result searches, while forecast services must not return fallback forecasts for malformed required payloads.
- Throw a typed service error for network, non-OK HTTP, parse, provider, or malformed-payload failures.
- Do not export raw provider response shapes from service modules; keep provider-specific interfaces local unless a wider contract is intentionally introduced.
- Keep reusable provider-code/domain mappers in focused UI-free `lib/` helpers instead of duplicating lookup tables inside service modules.
- Use `lib/weather-codes.ts` as the canonical WMO/Open-Meteo weather-code mapper; weather services should call `getWeatherCondition(code)` rather than maintaining local weather-code tables.
- Keep forecast-derived display metadata helpers UI-free and deterministic in `lib/`; they should return typed data for components to render later and avoid React imports, storage access, provider calls, or provider request changes.

## Client-side Weather Display Preferences

- Keep normalized forecast temperatures in Celsius from the provider/service layer; display-only unit conversion belongs in client UI helpers/components.
- Use `useTemperatureUnit()` for the persisted Celsius/Fahrenheit preference and pass the selected `unit` from `app/page.tsx` into weather display components.
- Use `convertTemperature(celsius, unit)` for current, feels-like, hourly, and daily min/max temperature displays; do not refetch forecasts solely because the display unit changed.
- Keep persistence SSR-safe with `typeof window` guards and default to Celsius for missing or invalid stored values.

## shadcn/ui Components

- Add new shadcn primitives via the CLI (`npx shadcn@latest add <component>`) rather than manually copying files.
- Keep shadcn-generated files under `components/ui/` unmodified — do not edit them directly. Wrap or compose them in feature-specific components under `components/<domain>/` if customization is needed.
- Import shadcn components using the `@/components/ui/` alias.
- Use `cn()` from `@/lib/utils` for className merging in feature components; it is already available and consistent with shadcn conventions.
