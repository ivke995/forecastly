# Architecture

- Forecastly uses Next.js 16 with the App Router.
- The active route tree currently lives under the repository-root `app/` directory, not `src/app/`.
- Core app entry points are `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`.
- The project uses TypeScript and Tailwind CSS.
- `app/layout.tsx` defines static Forecastly metadata and the shared root app shell.
- The shell renders a text-only Forecastly header above a `main` content region constrained to `max-w-[1200px]` with responsive padding.
- `app/page.tsx` is a static Server Component that renders the temporary Forecastly onboarding placeholder inside the root shell; it has no image imports, external links, buttons, data fetching, or weather functionality yet.
- `app/globals.css` defines Tailwind v4 theme tokens for background, foreground, and Geist font variables, including dark-mode color defaults.
