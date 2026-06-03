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
- Keep weather forecast models in `types/weather.ts` normalized around `WeatherCondition`, `CurrentWeather`, `HourlyForecast`, `DailyForecast`, and aggregate `WeatherForecast` contracts.
- When a forecast needs city context, reference `City` with a type-only import so the `types/` layer remains erased at runtime.

## Provider-backed Services

- Keep external API clients in repository-root `lib/` as UI-free, framework-light TypeScript modules.
- Import Forecastly domain contracts with type-only imports and normalize provider payloads into those contracts before returning data to callers.
- Treat provider JSON as `unknown`: validate top-level payload shape, validate row-level required fields, and drop invalid rows instead of leaking partial domain objects.
- Distinguish empty/no-result searches from provider failures; return `[]` for empty or no-result searches and throw a typed service error for network, non-OK HTTP, parse, or malformed payload failures.
- Do not export raw provider response shapes from service modules; keep provider-specific interfaces local unless a wider contract is intentionally introduced.
