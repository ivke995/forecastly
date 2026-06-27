# Weather Backdrop tsParticles Plan

## Change summary

Add a decorative, condition-aware animated weather backdrop behind the Forecastly dashboard content using the latest `@tsparticles/react` package and the minimal tsParticles engine package(s) required by the current release. The backdrop should react to the loaded current weather condition and daylight flag, covering the main weather groups: clear, cloudy/fog, rain/drizzle/showers, snow, and thunderstorms.

## Success criteria

- Forecastly installs and uses the latest npm release of `@tsparticles/react` with the minimal compatible tsParticles engine package(s), such as the slim engine package if required by the current API.
- A new weather backdrop renders behind all home-page cards/content without blocking clicks, text selection, scrolling, sidebar/header controls, or accessibility semantics.
- When no forecast is selected, the app shows a neutral/static or low-motion ambient backdrop.
- When a forecast is selected, the backdrop changes deterministically from `forecast.current.condition.code` and may use `forecast.current.isDaylight` to tune colors.
- Supported weather groups include clear, cloudy/fog, rain/drizzle/showers, snow, and thunderstorm/hail.
- Effects remain subtle enough that existing card content stays readable in light and dark themes.
- Motion respects user accessibility preferences through `prefers-reduced-motion` or an equivalent runtime check that disables/heavily reduces particles.
- No weather API request shape, domain model, weather-code mapper, recommendation logic, favorites behavior, or temperature-unit behavior changes are introduced.

## Constraints and non-goals

- Use latest npm versions for the tsParticles dependency set during implementation; do not pin a custom older version unless installation/API compatibility requires it.
- Keep the effect client-side and decorative (`aria-hidden`, `pointer-events-none`, behind content layers).
- Prefer a focused feature component under `components/weather/` plus small route-level integration in `app/page.tsx`.
- Do not add radar/map imagery, server routes, external weather providers, or persisted user animation settings in this plan.
- Do not move shared app-shell responsibilities out of `app/layout.tsx`.
- Do not duplicate the canonical WMO/Open-Meteo weather-code metadata in `lib/weather-codes.ts`; only add a UI-facing grouping helper if needed for rendering options.
- Before touching Next.js implementation details, consult the relevant local Next 16 docs under `node_modules/next/dist/docs/` per repository instructions.

## Assumptions

- The implementation may add both `@tsparticles/react` and whichever current tsParticles engine package is recommended by the latest package API, for example `@tsparticles/slim`.
- The backdrop should be visible behind all cards in the home page content area, not limited to the `CurrentWeatherCard`.
- All main weather groups should be included in the first implementation pass.

## Task stack

- [x] T01: `Install tsParticles dependency set` (status:done)
  - Task ID: T01
  - Goal: Add the latest `@tsparticles/react` package and the minimal compatible tsParticles engine package(s) required for a React integration.
  - Boundaries (in/out of scope): In - package manifest and lockfile dependency updates only; verify current package API enough to know the correct imports. Out - application component changes, styling, and weather-code grouping.
  - Done when: `package.json` and lockfile include the selected latest tsParticles packages and no unrelated dependency changes are present.
  - Verification notes (commands or checks): Inspect dependency diff; run `npm install` during implementation; confirm package import/API expectations from installed package docs/types.
  - Completed: 2026-06-27
  - Files changed: `package.json`, `package-lock.json`
  - Evidence: `npm install @tsparticles/react@latest @tsparticles/slim@latest` installed `@tsparticles/react@4.2.1` and `@tsparticles/slim@4.2.1`; `npm ls @tsparticles/react @tsparticles/slim @tsparticles/engine` confirmed `@tsparticles/engine@4.2.1`; package diff is limited to intended dependency/lockfile updates; `npm run lint` passed; `npm run build` passed.
  - Notes: `@tsparticles/react` exports default/named `Particles`, `ParticlesProvider`, and `useParticlesProvider`; current provider API accepts `init(engine)`, and `@tsparticles/slim` documents `loadSlim(engine)` for slim bundle registration.

- [ ] T02: `Create weather backdrop classification helper` (status:todo)
  - Task ID: T02
  - Goal: Add a small UI-facing mapping from current WMO/Open-Meteo weather codes to backdrop variants: `neutral`, `clear`, `cloudy`, `fog`, `rain`, `snow`, and `thunderstorm`.
  - Boundaries (in/out of scope): In - deterministic grouping helper colocated with the backdrop component or another UI-focused module; unit-sized mapping for supported codes already known by Forecastly. Out - changing `types/weather.ts`, changing `lib/weather-codes.ts` condition metadata, changing Open-Meteo service normalization, or adding provider-specific raw shapes.
  - Done when: Every currently supported weather code maps to an intended backdrop variant, unknown/null forecast state falls back safely to `neutral`, and the grouping is easy to review.
  - Verification notes (commands or checks): Review mapping against `context/services/weather-codes.md` supported codes and `lib/weather-codes.ts`; run TypeScript/lint checks after component integration.

- [ ] T03: `Build WeatherBackdrop component with tsParticles` (status:todo)
  - Task ID: T03
  - Goal: Implement a reusable client component that initializes tsParticles once and renders subtle particles/background styling for neutral, clear, cloudy/fog, rain, snow, and thunderstorm variants.
  - Boundaries (in/out of scope): In - `components/weather/WeatherBackdrop.tsx` or equivalent, tsParticles init/options, reduced-motion handling, daylight-aware color tuning, decorative accessibility attributes, and pointer-event safety. Out - route state changes beyond receiving typed props, card layout redesign, API calls, or localStorage settings.
  - Done when: The component accepts current condition/daylight inputs or a small typed variant prop, renders without SSR errors in a Next client context, produces distinct options for all requested groups, and degrades to a static/minimal effect when reduced motion is preferred.
  - Verification notes (commands or checks): Run lint/type/build checks available in the project; manually test at least representative variants by temporarily selecting/forcing codes during implementation without committing debug scaffolding.

- [ ] T04: `Integrate backdrop behind home dashboard content` (status:todo)
  - Task ID: T04
  - Goal: Render the weather backdrop behind all home-page cards/content while preserving the existing sidebar/header shell and dashboard readability.
  - Boundaries (in/out of scope): In - `app/page.tsx` integration, z-index layering, page/container class adjustments, neutral state when `forecast` is null, selected forecast state driven by `forecast.current.condition.code` and `forecast.current.isDaylight`. Out - app-shell navigation behavior, forecast fetching flow, favorites/unit logic, and existing weather cards' data contracts unless only layering props/classes are required.
  - Done when: The backdrop is visually behind the main page content, cards remain readable, all buttons/search/favorites/sidebar interactions remain clickable, loading/error/initial/selected states still render correctly, and no hydration/client errors appear.
  - Verification notes (commands or checks): Manual browser check for initial, loading, error if reproducible, and selected forecast states; run `npm run lint` and `npm run build` if available after integration.

- [ ] T05: `Tune theme/readability and accessibility behavior` (status:todo)
  - Task ID: T05
  - Goal: Adjust global or component styling so the animated backdrop feels integrated with Forecastly's light/dark weather palette without harming readability or accessibility.
  - Boundaries (in/out of scope): In - small CSS/Tailwind class adjustments, overlay gradients, reduced-motion CSS/runtime behavior, and z-index hardening. Out - broad visual redesign, changing shadcn-generated primitives, adding a settings page, or introducing additional animation libraries.
  - Done when: Backdrop intensity is subtle, cards and alerts keep sufficient contrast, animations stop or become minimal for reduced-motion users, and decoration is hidden from assistive technologies.
  - Verification notes (commands or checks): Manual visual check in normal and dark-mode-capable token contexts where possible; inspect DOM for `aria-hidden`/pointer-event behavior; run lint/build checks.

- [ ] T06: `Validation and cleanup` (status:todo)
  - Task ID: T06
  - Goal: Validate the completed dependency and UI integration, remove temporary scaffolding, and sync durable context if the implementation changes current-state architecture/component knowledge.
  - Boundaries (in/out of scope): In - full project checks, removal of debug code/test forcing, review of dependency diff, context updates for new component/dependency if implementation lands. Out - unrelated feature polish, new weather groups beyond the planned mapping, or committing changes unless explicitly requested.
  - Done when: `npm run lint` passes, `npm run build` passes or any failure is documented with cause, no temporary/debug code remains, package diff is intentional, and relevant `context/` files are updated if the code has changed durable project structure.
  - Verification notes (commands or checks): `npm run lint`; `npm run build`; inspect changed files; run SCE context sync if implementation completes.

## Open questions

- None. User confirmed latest package versions, full-app background placement, and inclusion of all main weather groups.
