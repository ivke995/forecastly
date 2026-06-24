"use client";

import { useState, useCallback } from "react";
import type { FavoriteCity, CitySearchResult, City } from "@/types/city";

const STORAGE_KEY = "forecastly-favorites";

function getStoredFavorites(): FavoriteCity[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteCity[];
  } catch {
    return [];
  }
}

function storeFavorites(favorites: FavoriteCity[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage may be full or unavailable; silently ignore.
  }
}

export function toCitySearchResult(fav: FavoriteCity): CitySearchResult {
  const parts = [fav.name];
  if (fav.admin1) parts.push(fav.admin1);
  parts.push(fav.country);

  return {
    id: fav.cityId,
    name: fav.name,
    displayName: parts.join(", "),
    country: fav.country,
    admin1: fav.admin1,
    latitude: fav.latitude,
    longitude: fav.longitude,
    timezone: fav.timezone,
  };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() =>
    getStoredFavorites(),
  );

  const addFavorite = useCallback((city: CitySearchResult | City) => {
    const newFavorite: FavoriteCity = {
      id: crypto.randomUUID(),
      cityId: city.id,
      name: city.name,
      country: city.country,
      admin1: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone,
      createdAt: new Date().toISOString(),
    };

    setFavorites((prev) => {
      const updated = [newFavorite, ...prev];
      storeFavorites(updated);
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((cityId: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((fav) => fav.cityId !== cityId);
      storeFavorites(updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (cityId: string) => {
      return favorites.some((fav) => fav.cityId === cityId);
    },
    [favorites],
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
