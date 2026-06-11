# useFavorites

SSR-safe custom hook for managing favorite cities via `localStorage`.
Defined in `hooks/useFavorites.ts`.

## Export shape

```typescript
export function useFavorites(): {
  favorites: FavoriteCity[];
  addFavorite: (city: CitySearchResult | City) => void;
  removeFavorite: (cityId: string) => void;
  isFavorite: (cityId: string) => boolean;
};

export function toCitySearchResult(fav: FavoriteCity): CitySearchResult;
```

## Behavior

- **Initialization**: On mount, reads `FavoriteCity[]` from `localStorage` key `forecastly-favorites` using lazy `useState` initializer.
- **SSR safety**: All `localStorage` access is guarded by `typeof window === "undefined"` checks.
- **addFavorite**: Creates a new `FavoriteCity` with `crypto.randomUUID()` as `id`, the city's `id` as `cityId`, snapshots of name/country/admin1/coordinates/timezone, and `createdAt` ISO string. Prepends to the list and persists.
- **removeFavorite**: Filters out the favorite whose `cityId` matches the argument.
- **isFavorite**: Returns `true` if any favorite has a matching `cityId`.
- **Persistence**: Favorites are written back to `localStorage` after every mutation via `storeFavorites()`.
- **toCitySearchResult**: Reconstructs a `CitySearchResult` from `FavoriteCity` fields, using `fav.cityId` as the result `id` and building `displayName` from `name`, `admin1`, and `country`.

## Key design decisions

- `crypto.randomUUID()` for IDs (modern browser API, no extra dependency).
- New favorites are prepended (most recent first).
- No confirmation dialog on remove; no reordering or editing.
- Silent failure if `localStorage` is full or unavailable.

See also: [context-map.md](../context-map.md)
