"use client";

import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFavorites, toCitySearchResult } from "@/hooks/useFavorites";
import type { CitySearchResult } from "@/types/city";

export interface FavoriteCitiesProps {
  /** Called when the user clicks a favorite city row. */
  onSelect: (city: CitySearchResult) => void;
}

export default function FavoriteCities({ onSelect }: FavoriteCitiesProps) {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Favorite Cities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No favorite cities yet. Search for a city and star it!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorite Cities</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border" role="list">
          {favorites.map((fav) => (
            <li
              key={fav.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(toCitySearchResult(fav))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(toCitySearchResult(fav));
                }
              }}
              className="flex cursor-pointer items-center justify-between px-6 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
            >
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {fav.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {[fav.admin1, fav.country].filter(Boolean).join(", ")}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove ${fav.name} from favorites`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.cityId);
                }}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
