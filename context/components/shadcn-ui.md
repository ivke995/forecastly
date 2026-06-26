# shadcn/ui Component Library

## Overview

[shadcn/ui](https://ui.shadcn.com/) is the project's UI component library (style: `base-nova`, v4). It generates customizable, unstyled primitives into `components/ui/` via CLI commands. The library uses CSS variables for theming and integrates with Tailwind CSS v4.

## Configuration

- **Config file:** `components.json` (repository root)
- **Aliases:**
  - Components: `@/components`
  - UI components: `@/components/ui`
  - Utils: `@/lib/utils`
  - Hooks: `@/hooks`
- **Icon library:** Lucide
- **CSS variables:** Enabled (`@theme inline` in `app/globals.css`) with Forecastly weather-themed light/dark OKLCH tokens for core surfaces, charts, and sidebar variables.

## Available Components

| Component | File | Exports |
|-----------|------|---------|
| Card | `components/ui/card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction` |
| Button | `components/ui/button.tsx` | `Button` (with `size` and `variant` props) |
| Input | `components/ui/input.tsx` | `Input` |
| Separator | `components/ui/separator.tsx` | `Separator` |
| Sheet | `components/ui/sheet.tsx` | `Sheet`, `SheetTrigger`, `SheetClose`, `SheetPortal`, `SheetOverlay`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription` |
| Skeleton | `components/ui/skeleton.tsx` | `Skeleton` |
| Tooltip | `components/ui/tooltip.tsx` | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` |
| Sidebar | `components/ui/sidebar.tsx` | `SidebarProvider`, `Sidebar`, `SidebarTrigger`, `SidebarInset`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, and related sidebar subcomponents |

## Generated Support Hooks

- `hooks/use-mobile.ts` exports `useIsMobile()`, used by the shadcn sidebar for responsive desktop/mobile behavior. It keeps an SSR-safe initial state and listens to the `(max-width: 767px)` media query on the client.

## Adding New Components

```bash
npx shadcn@latest add <component-name> -y
```

The `-y` flag skips the confirmation prompt for non-interactive usage.

## Usage Pattern

Feature-specific components should import shadcn primitives and compose them:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function MyFeatureCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>Content</CardContent>
    </Card>
  )
}
```

## Key Dependencies

- `clsx` — className conditional construction
- `tailwind-merge` — className conflict resolution
- `tw-animate-css` — Tailwind CSS animation utilities
- `lucide-react` — Icon library (available via shadcn init)
- `@base-ui/react` — Base primitives used by the current shadcn v4/base-nova generated components

See also: [overview.md](../overview.md), [patterns.md](../patterns.md)
