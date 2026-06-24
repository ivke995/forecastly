"use client";

import { useState, useCallback } from "react";

export type TemperatureUnit = "celsius" | "fahrenheit";

const STORAGE_KEY = "forecastly-temperature-unit";
const DEFAULT_UNIT: TemperatureUnit = "celsius";

function isValidUnit(value: unknown): value is TemperatureUnit {
  return value === "celsius" || value === "fahrenheit";
}

function getStoredUnit(): TemperatureUnit {
  if (typeof window === "undefined") {
    return DEFAULT_UNIT;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_UNIT;
    const parsed: unknown = JSON.parse(raw);
    return isValidUnit(parsed) ? parsed : DEFAULT_UNIT;
  } catch {
    return DEFAULT_UNIT;
  }
}

function storeUnit(unit: TemperatureUnit): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unit));
  } catch {
    // localStorage may be full or unavailable; silently ignore.
  }
}

export function useTemperatureUnit() {
  const [unit, setUnitState] = useState<TemperatureUnit>(() =>
    getStoredUnit(),
  );

  const setUnit = useCallback((newUnit: TemperatureUnit) => {
    setUnitState((prev) => {
      if (prev === newUnit) return prev;
      storeUnit(newUnit);
      return newUnit;
    });
  }, []);

  const toggleUnit = useCallback(() => {
    setUnitState((prev) => {
      const next: TemperatureUnit =
        prev === "celsius" ? "fahrenheit" : "celsius";
      storeUnit(next);
      return next;
    });
  }, []);

  return { unit, setUnit, toggleUnit };
}
