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
    <section className="space-y-8 py-8 sm:py-10">
      <div className="overflow-hidden rounded-[2rem] border bg-card/80 shadow-sm backdrop-blur">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center lg:p-10">
          <div className="space-y-5">
            <div className="inline-flex w-fit items-center rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              Live weather dashboard
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Plan your day with clear, local forecasts.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Search for any city or use your current location to see current
                conditions, hourly trends, seven-day outlooks, and practical
                weather recommendations.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-background/75 p-4 shadow-sm sm:p-5">
            <div className="space-y-3">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight">
                  Find your forecast
                </h2>
                <p className="text-sm text-muted-foreground">
                  Start with a city search or let Forecastly use your browser
                  location.
                </p>
              </div>
              <CitySearch onSelect={handleCitySelect} />
              <Button
                type="button"
                variant="outline"
                onClick={handleUseMyLocation}
                disabled={isLoading}
                aria-label="Use my current location for the weather forecast"
                className="w-full justify-center"
              >
                {isLocating ? "Locating…" : "Use my location"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4" aria-live="polite">
        {locationNotice !== null && !isLoading && forecast !== null && (
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 shadow-sm dark:text-amber-200">
            {locationNotice}
          </div>
        )}

        {isLoading && (
          <div className="rounded-3xl border bg-card/80 p-8 text-center shadow-sm">
            <div className="mx-auto size-10 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              {isLocating
                ? "Finding your location and forecast…"
                : "Loading the latest forecast…"}
            </p>
          </div>
        )}

        {!isLoading && error !== null && (
          <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-sm">
            {error}
          </div>
        )}
      </div>

      {selectedCity === null && !isLoading && error === null && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border bg-card/70 p-5 shadow-sm">
            <p className="text-sm font-semibold">Current conditions</p>
            <p className="mt-2 text-sm text-muted-foreground">
              See temperature, feels-like conditions, wind, humidity, and risk
              badges at a glance.
            </p>
          </div>
          <div className="rounded-3xl border bg-card/70 p-5 shadow-sm">
            <p className="text-sm font-semibold">Hourly trends</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Review the next 24 hours with temperature and precipitation
              charts.
            </p>
          </div>
          <div className="rounded-3xl border bg-card/70 p-5 shadow-sm">
            <p className="text-sm font-semibold">7-day outlook</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare daily highs, lows, precipitation chances, and forecast
              advice.
            </p>
          </div>
        </div>
      )}

      {!isLoading && forecast !== null && selectedCity !== null && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Forecast for
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {selectedCity.displayName}
              </h2>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleUnit}
              aria-label={`Switch temperature display to ${
                unit === "celsius" ? "Fahrenheit" : "Celsius"
              }`}
              className="w-fit"
            >
              <span aria-hidden="true">{unit === "celsius" ? "°C" : "°F"}</span>
              <span className="text-muted-foreground" aria-hidden="true">
                →
              </span>
              <span>{unit === "celsius" ? "°F" : "°C"}</span>
            </Button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.45fr)]">
            <div className="space-y-6">
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
              <HourlyForecast hourly={forecast.hourly.slice(0, 24)} unit={unit} />
            </div>
            <div className="space-y-6">
              <WeatherRecommendations
                recommendations={getWeatherRecommendations(forecast)}
              />
              <DailyForecast daily={forecast.daily} unit={unit} />
            </div>
          </div>
        </div>
      )}
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
