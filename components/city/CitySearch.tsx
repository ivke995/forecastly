"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { GeocodingError, searchCities } from "@/lib/geocoding";
import type { CitySearchResult } from "@/types/city";

export interface CitySearchProps {
  /** Called when the user selects a city from the results. */
  onSelect: (city: CitySearchResult) => void;
  /** Placeholder text for the search input. */
  placeholder?: string;
  /** Optional id for the input; used to generate the listbox id. */
  id?: string;
  /** Additional class name for the outer container. */
  className?: string;
}

type AllowedInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | "onSelect"
  | "onChange"
  | "onKeyDown"
  | "value"
  | "type"
  | "role"
  | "aria-activedescendant"
  | "aria-expanded"
  | "aria-controls"
  | "aria-autocomplete"
  | "autoComplete"
>; // autoComplete is explicitly set to "off"

export default function CitySearch({
  onSelect,
  placeholder = "Search for a city...",
  id,
  className,
  ...inputProps
}: CitySearchProps & AllowedInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  const listboxId = id ? `${id}-listbox` : "city-search-listbox";

  // ---- Debounced search ----
  useEffect(() => {
    if (query.trim().length === 0) {
      return;
    }

    const timer = setTimeout(async () => {
      const currentRequestId = ++requestIdRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const cities = await searchCities(query);

        if (currentRequestId === requestIdRef.current) {
          setResults(cities);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }
      } catch (err) {
        if (currentRequestId === requestIdRef.current) {
          const message =
            err instanceof GeocodingError
              ? err.message
              : "An unexpected error occurred.";
          setError(message);
          setResults([]);
          setIsOpen(true);
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // ---- Click-outside handler ----
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  // ---- Selection helper ----
  const selectCity = useCallback(
    (city: CitySearchResult) => {
      onSelect(city);
      setQuery("");
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    },
    [onSelect],
  );

  // ---- Event handlers ----
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Reset results immediately when the user clears the input.
    if (newQuery.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      setError(null);
      setHighlightedIndex(-1);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // When dropdown is closed, only ArrowDown and Escape are relevant
    if (!isOpen || results.length === 0) {
      if (e.key === "ArrowDown" && results.length > 0) {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0,
        );
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1,
        );
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          selectCity(results[highlightedIndex]);
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      }
    }
  }

  function handleResultClick(city: CitySearchResult) {
    selectCity(city);
  }

  function handleResultMouseEnter(index: number) {
    setHighlightedIndex(index);
  }

  // ---- Derived state ----
  const showDropdown = isOpen && query.trim().length > 0;

  const activeDescendant =
    highlightedIndex >= 0 && highlightedIndex < results.length
      ? `${listboxId}-option-${results[highlightedIndex].id}`
      : undefined;

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10"
        {...inputProps}
      />

      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-lg"
        >
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="size-5 animate-spin rounded-full border-2 border-foreground/10 border-t-foreground/40" />
            </div>
          )}

          {/* Error state */}
          {!isLoading && error !== null && (
            <div className="px-4 py-6 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && error === null && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-foreground/50">
              No cities found
            </div>
          )}

          {/* Results list */}
          {!isLoading && error === null && results.length > 0 && (
            <ul className="max-h-60 overflow-y-auto">
              {results.map((city, index) => (
                <li
                  key={city.id}
                  id={`${listboxId}-option-${city.id}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onClick={() => handleResultClick(city)}
                  onMouseEnter={() => handleResultMouseEnter(index)}
                  className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                    index === highlightedIndex
                      ? "bg-foreground/5"
                      : ""
                  } ${
                    index !== results.length - 1
                      ? "border-b border-foreground/5"
                      : ""
                  }`}
                >
                  <span className="block font-medium text-foreground">
                    {city.displayName}
                  </span>
                  {city.admin1 && (
                    <span className="block text-xs text-foreground/50">
                      {[city.admin1, city.country].filter(Boolean).join(", ")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
