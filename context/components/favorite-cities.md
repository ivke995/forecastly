# FavoriteCities Component

A reusable interactive Client Component that displays the user's saved favorite cities inside a shadcn Card with click-to-select and remove actions. Defined in `components/city/FavoriteCities.tsx`.

## Props

| Prop | Type | Description |
|---|---|---|
| `onSelect` | `(city: CitySearchResult) => void` | Called when the user clicks a favorite city row |

## Behavior

- **Data source**: Uses `useFavorites()` hook internally for reading `favorites` list and calling `removeFavorite`.
- **Row click**: Calls `onSelect(toCitySearchResult(fav))` to load the city's weather.
- **Remove button**: Calls `removeFavorite(fav.cityId)` with `e.stopPropagation()` to prevent row click from firing. Uses the `X` icon from `lucide-react`.
- **Empty state**: Renders "No favorite cities yet. Search for a city and star it!" inside the card when `favorites.length === 0`.
- **Accessibility**: Each row has `role="button"`, `tabIndex={0}`, keyboard support (Enter/Space triggers `onSelect`), and `aria-label` on the remove button.

## Layout

- **CardHeader**: Title "Favorite Cities".
- **CardContent**: Zero-padded list (`p-0`) of favorite rows divided by `border` separators.
- **Each row**: City name (truncated, `text-sm font-medium`) + admin1/country (truncated, `text-xs text-muted-foreground`) on the left; ghost icon remove button on the right.

## States

| State | Behavior |
|---|---|
| Empty (`favorites.length === 0`) | Renders Card with header + informational text |
| Populated | Renders Card with header + scrollable list of favorite rows |
| Row hover | Background highlight via `hover:bg-muted/50` |

## Dependencies

- `@/components/ui/card` (Card, CardHeader, CardTitle, CardContent)
- `@/components/ui/button` (Button, variant `ghost`, size `icon`)
- `@/hooks/useFavorites` (useFavorites, toCitySearchResult)
- `lucide-react` (X icon)
- `"use client"` directive

See also: [useFavorites hook](../hooks/use-favorites.md), [city types](../domain-models/city.md), [shadcn/ui primitives](./shadcn-ui.md)
