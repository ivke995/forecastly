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
