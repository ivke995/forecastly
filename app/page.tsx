"use client";

import { useCallback, useState } from "react";
import CitySearch from "@/components/city/CitySearch";
import CurrentWeatherCard from "@/components/weather/CurrentWeatherCard";
import DailyForecast from "@/components/weather/DailyForecast";
import HourlyForecast from "@/components/weather/HourlyForecast";
import WeatherRecommendations from "@/components/weather/WeatherRecommendations";
import { Button } from "@/components/ui/button";
import { getWeatherForecast, WeatherForecastError } from "@/lib/open-meteo";
import { getWeatherRecommendations } from "@/lib/weather-recommendations";
import { getCurrentWeatherRiskBadges } from "@/lib/weather-risk-badges";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import type { CitySearchResult } from "@/types/city";
import type { WeatherForecast } from "@/types/weather";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(
    null,
  );
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { unit, toggleUnit } = useTemperatureUnit();

  const handleCitySelect = useCallback(async (city: CitySearchResult) => {
    setSelectedCity(city);
    setIsLoading(true);
    setError(null);
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

  return (
    <section className="flex min-h-[50vh] flex-col justify-center py-12 text-center sm:text-left">
      <div className="max-w-2xl space-y-4">
        {/* City search */}
        <CitySearch onSelect={handleCitySelect} />

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
