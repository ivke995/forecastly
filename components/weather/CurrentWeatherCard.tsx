"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { WeatherRiskBadge } from "@/lib/weather-risk-badges";
import type { TemperatureUnit } from "@/hooks/useTemperatureUnit";
import { convertTemperature } from "@/hooks/useTemperatureUnit";

export interface CurrentWeatherCardProps {
  cityName: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherIcon: string;
  weatherDescription: string;
  unit: TemperatureUnit;
  riskBadges?: WeatherRiskBadge[];
}

const riskBadgeToneClasses: Record<WeatherRiskBadge["tone"], string> = {
  caution: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  cold: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  heat: "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300",
};

export default function CurrentWeatherCard({
  cityName,
  country,
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  weatherIcon,
  weatherDescription,
  unit,
  riskBadges = [],
}: CurrentWeatherCardProps) {
  const hasRiskBadges = riskBadges.length > 0;
  const temperatureLabel = `${convertTemperature(temperature, unit)}${
    unit === "celsius" ? "°C" : "°F"
  }`;
  const feelsLikeLabel = `${convertTemperature(feelsLike, unit)}${
    unit === "celsius" ? "°C" : "°F"
  }`;

  return (
    <Card className="overflow-hidden border-primary/15 bg-card/95 shadow-lg shadow-primary/5">
      <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent pb-5">
        <CardDescription className="font-medium uppercase tracking-[0.2em] text-primary">
          Current Weather
        </CardDescription>
        <CardTitle className="text-2xl tracking-tight sm:text-3xl">
          {cityName}, {country}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-5 sm:p-6">
        <section
          className="grid gap-5 rounded-3xl border border-border/60 bg-gradient-to-br from-background via-muted/30 to-accent/10 p-5 sm:grid-cols-[1fr_auto] sm:items-center"
          aria-label="Current conditions summary"
        >
          <div className="space-y-3">
            <div className="flex items-end gap-3">
              <span className="text-6xl font-semibold tracking-tighter sm:text-7xl">
                {temperatureLabel}
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold capitalize text-foreground">
                {weatherDescription}
              </p>
              <p className="text-sm text-muted-foreground">
                Feels like {feelsLikeLabel} with {humidity}% humidity and winds at {windSpeed} km/h.
              </p>
            </div>
          </div>

          <div className="flex justify-start sm:justify-end">
            <span
              className="flex size-28 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-6xl shadow-inner shadow-primary/10 sm:size-32 sm:text-7xl"
              role="img"
              aria-label={weatherDescription}
            >
              {weatherIcon}
            </span>
          </div>
        </section>

        {hasRiskBadges && (
          <section
            className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-left"
            aria-label="Current weather risks"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">Current risks</h3>
              <span className="text-xs text-muted-foreground">Live condition alerts</span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {riskBadges.map((badge) => (
                <li key={badge.id}>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${riskBadgeToneClasses[badge.tone]}`}
                    title={badge.description}
                    aria-label={`${badge.label}: ${badge.description}`}
                  >
                    <span aria-hidden="true">{badge.icon}</span>
                    {badge.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Feels like</span>
            <span className="mt-2 block text-2xl font-semibold">
              {feelsLikeLabel}
            </span>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Humidity</span>
            <span className="mt-2 block text-2xl font-semibold">{humidity}%</span>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Wind</span>
            <span className="mt-2 block text-2xl font-semibold">{windSpeed} km/h</span>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 md:col-span-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Condition summary</span>
            <span className="mt-2 block text-base font-medium capitalize">
              {weatherDescription}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
