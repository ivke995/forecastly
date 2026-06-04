# CitySearch Component

A reusable, interactive autocomplete Client Component that wraps the geocoding service with a debounced search input, keyboard-navigable results, and loading/empty/error states.

Defined in `components/city/CitySearch.tsx`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSelect` | `(city: CitySearchResult) => void` | (required) | Called when the user selects a city from the autocomplete results. |
| `placeholder` | `string` | `"Search for a city..."` | Placeholder text for the search input. |
| `id` | `string` | optional | HTML id for the input; used to generate the listbox `id`. |
| `className` | `string` | optional | Additional CSS class for the outer container. |
| All other valid `<input>` HTML attributes | — | — | Spread onto the underlying `<input>` element (except `value`, `onChange`, `onKeyDown`, `type`, `role`, and ARIA attributes which are managed internally). |

## Behavior

- **Debounced search**: User input is debounced at 400ms before calling `searchCities`. Rapid typing cancels the previous pending request.
- **Request deduplication**: In-flight responses from stale queries are discarded via an incrementing request counter.
- **Click-outside**: A `mousedown` listener on `document` closes the dropdown when the user clicks outside the component container.
- **Empty input**: When the user clears the input, results are reset immediately and the dropdown closes.

## States

- **Default**: Empty input, no dropdown visible.
- **Loading**: During the async `searchCities` call, the dropdown shows a centered spinning indicator (`animate-spin` ring).
- **Empty**: The search completed with zero results; dropdown shows "No cities found".
- **Error**: `searchCities` threw `GeocodingError`; dropdown shows the error message in red text.
- **Results**: A scrollable list of matching cities; each item displays `displayName` with optional `admin1` and `country` secondary text.

## Keyboard navigation

| Key | Behavior |
|---|---|
| Arrow Down | Move highlight to the next result (wraps to first). Opens the dropdown if closed and results exist. |
| Arrow Up | Move highlight to the previous result (wraps to last). |
| Enter | Select the highlighted result and call `onSelect`. |
| Escape | Close the dropdown and clear highlight. |

Mouse hover over a result also sets the highlight to match.

## Accessibility

- Input has `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, and `aria-activedescendant`.
- The dropdown uses `role="listbox"`; each result uses `role="option"` with `aria-selected`.
- `autoComplete="off"` prevents browser autofill interference.

## Dependencies

None beyond the existing project dependencies. Debounce and click-outside use native React hooks (`useEffect`, `useRef`, `useState`, `useCallback`).

Related: [geocoding service](../services/geocoding.md), [city domain models](../domain-models/city.md)
