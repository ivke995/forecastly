"use client";

import { useCallback, useState } from "react";
import CitySearch from "@/components/city/CitySearch";
import CurrentWeatherCard from "@/components/weather/CurrentWeatherCard";
import DailyForecast from "@/components/weather/DailyForecast";
import HourlyForecast from "@/components/weather/HourlyForecast";
import WeatherRecommendations from "@/components/weather/WeatherRecommendations";
import { Button } from "@/components/ui/button";
import {
  CoordinateLocationError,
  resolveCoordinateLocation,
} from "@/lib/coordinate-location";
import { getWeatherForecast, WeatherForecastError } from "@/lib/open-meteo";
import { getWeatherRecommendations } from "@/lib/weather-recommendations";
import { getCurrentWeatherRiskBadges } from "@/lib/weather-risk-badges";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import type { CitySearchResult } from "@/types/city";
import type { WeatherForecast } from "@/types/weather";

const GEOLOCATION_TIMEOUT_MS = 10_000;

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(
    null,
  );
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const { unit, toggleUnit } = useTemperatureUnit();

  const handleCitySelect = useCallback(async (city: CitySearchResult) => {
    setSelectedCity(city);
    setIsLoading(true);
    setError(null);
    setLocationNotice(null);
    setForecast(null);

    try {
      const result = await getWeatherForecast(city);
      setForecast(result);
    } catch (err) {
      const message =
        err instanceof WeatherForecastError
          ? err.message
          : "An unexpected error occurred while fetching the weather forecast.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUseMyLocation = useCallback(async () => {
    setError(null);
    setLocationNotice(null);

    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setForecast(null);
      setSelectedCity(null);
      setError(
        "Geolocation is not supported by this browser. Search for a city instead.",
      );
      return;
    }

    setSelectedCity(null);
    setForecast(null);
    setIsLoading(true);
    setIsLocating(true);

    try {
      const position = await getCurrentPosition();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const location = await resolveCoordinateLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timezone,
      });

      if (location.source === "coordinate-fallback") {
        setLocationNotice(
          "We could not find a nearby place name, so we are showing your coordinates instead.",
        );
      }

      setSelectedCity(location.city);

      const result = await getWeatherForecast(location.city);
      setForecast(result);
    } catch (err) {
      const message = getLocationForecastErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
      setIsLocating(false);
    }
  }, []);

  return (
    <section className="flex min-h-[50vh] flex-col justify-center py-12 text-center sm:text-left">
      <div className="max-w-2xl space-y-4">
        {/* City search and geolocation */}
        <div className="space-y-3">
          <CitySearch onSelect={handleCitySelect} />
          <Button
            type="button"
            variant="outline"
            onClick={handleUseMyLocation}
            disabled={isLoading}
            aria-label="Use my current location for the weather forecast"
          >
            {isLocating ? "Locating…" : "Use my location"}
          </Button>
        </div>

        {locationNotice !== null && !isLoading && forecast !== null && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            {locationNotice}
          </div>
        )}

        {/* Hero placeholder — visible when no city has been selected yet */}
        {selectedCity === null && !isLoading && error === null && (
          <>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Forecastly
            </h1>
            <div className="text-foreground/70 space-y-2 text-lg leading-8 sm:text-xl">
              <p>Smart weather forecasts and recommendations.</p>
              <p>Search for a city to get started.</p>
            </div>
          </>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="size-8 animate-spin rounded-full border-4 border-foreground/10 border-t-foreground/40" />
          </div>
        )}

        {/* Error state */}
        {!isLoading && error !== null && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Selected city info + weather forecast */}
        {!isLoading && forecast !== null && selectedCity !== null && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                {selectedCity.displayName}
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleUnit}
                aria-label={`Switch temperature display to ${
                  unit === "celsius" ? "Fahrenheit" : "Celsius"
                }`}
                className="self-start"
              >
                <span aria-hidden="true">{unit === "celsius" ? "°C" : "°F"}</span>
                <span className="text-foreground/60" aria-hidden="true">
                  →
                </span>
                <span>{unit === "celsius" ? "°F" : "°C"}</span>
              </Button>
            </div>
            <CurrentWeatherCard
              cityName={forecast.city.name}
              country={forecast.city.country}
              temperature={forecast.current.temperature}
              feelsLike={
                forecast.current.apparentTemperature ??
                forecast.current.temperature
              }
              humidity={forecast.current.relativeHumidity ?? 0}
              windSpeed={forecast.current.windSpeed ?? 0}
              weatherIcon={forecast.current.condition.emoji}
              weatherDescription={forecast.current.condition.description}
              unit={unit}
              riskBadges={getCurrentWeatherRiskBadges(forecast.current)}
            />
            <WeatherRecommendations
              recommendations={getWeatherRecommendations(forecast)}
            />
            <HourlyForecast hourly={forecast.hourly.slice(0, 24)} unit={unit} />
            <DailyForecast daily={forecast.daily} unit={unit} />
          </div>
        )}
      </div>
    </section>
  );
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 300_000,
      timeout: GEOLOCATION_TIMEOUT_MS,
    });
  });
}

function getLocationForecastErrorMessage(error: unknown): string {
  if (isGeolocationPositionError(error)) {
    return getGeolocationErrorMessage(error);
  }

  if (error instanceof CoordinateLocationError) {
    return error.message;
  }

  if (error instanceof WeatherForecastError) {
    return error.message;
  }

  return "An unexpected error occurred while fetching the weather for your location.";
}

function isGeolocationPositionError(
  error: unknown,
): error is GeolocationPositionError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "number"
  );
}

function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location permission was denied. Search for a city instead, or allow location access and try again.";
    case error.POSITION_UNAVAILABLE:
      return "Your location is currently unavailable. Search for a city instead.";
    case error.TIMEOUT:
      return "Finding your location took too long. Search for a city instead, or try again.";
    default:
      return "Unable to determine your location. Search for a city instead.";
  }
}
