# useTemperatureUnit

SSR-safe custom hook for managing the displayed temperature unit (Celsius/Fahrenheit) via `localStorage`. Also exports a pure `convertTemperature()` utility for display conversion. Defined in `hooks/useTemperatureUnit.ts`.

## Export shape

```typescript
export type TemperatureUnit = "celsius" | "fahrenheit";

export function useTemperatureUnit(): {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  toggleUnit: () => void;
};

export function convertTemperature(celsius: number, unit: TemperatureUnit): number;
```

## Behavior

- **Initialization**: On mount, reads the stored unit from `localStorage` key `forecastly-temperature-unit` using lazy `useState` initializer. Defaults to `"celsius"`.
- **SSR safety**: All `localStorage` access is guarded by `typeof window === "undefined"` checks.
- **setUnit**: Sets the unit to the given value and persists it. No-op if the new value equals the current unit.
- **toggleUnit**: Switches between `"celsius"` and `"fahrenheit"` and persists the new value.
- **Invalid values**: If `localStorage` contains a value that is neither `"celsius"` nor `"fahrenheit"`, the hook falls back to the default (`"celsius"`).
- **Persistence**: Written back to `localStorage` after every mutation.

### convertTemperature

Pure display helper that converts a Celsius temperature value to the target unit:

```typescript
convertTemperature(0, "celsius")    // => 0
convertTemperature(0, "fahrenheit") // => 32
convertTemperature(100, "celsius")  // => 100
convertTemperature(100, "fahrenheit") // => 212
```

- Fahrenheit conversion uses `°F = °C * 9/5 + 32`.
- Result is always rounded with `Math.round`, consistent with existing display patterns.
- Used by `CurrentWeatherCard`, `HourlyForecast`, and `DailyForecast` to convert display values.

## Key design decisions

- Uses `JSON.parse` / `JSON.stringify` for serialization (consistent with `useFavorites`), providing a clear deserialization boundary for validation.
- `isValidUnit()` guard catches both missing and malformed stored values.
- No-op when the unit hasn't actually changed (`setUnit` short-circuits).
- Silent failure if `localStorage` is full or unavailable.
- `convertTemperature` co-located with the unit type/hook rather than a separate file, keeping the module boundary simple.

See also: [use-favorites.md](./use-favorites.md), [context-map.md](../context-map.md)
