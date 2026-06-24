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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {cityName}, {country}
        </CardTitle>
        <CardDescription>Current Weather</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Main temperature and weather icon section */}
        <div className="mb-6 flex items-center gap-4">
          <span
            className="text-5xl"
            role="img"
            aria-label={weatherDescription}
          >
            {weatherIcon}
          </span>
          <span className="text-4xl font-bold">
            {convertTemperature(temperature, unit)}
            {unit === "celsius" ? "°C" : "°F"}
          </span>
        </div>

        {hasRiskBadges && (
          <section
            className="mb-6 rounded-lg border border-border bg-muted/20 p-3 text-left"
            aria-label="Current weather risks"
          >
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Current risks
            </h3>
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

        {/* Detail fields – single column on mobile, two columns on wider screens */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-sm text-muted-foreground">Feels like</span>
            <span className="text-sm font-medium">
              {convertTemperature(feelsLike, unit)}
              {unit === "celsius" ? "°C" : "°F"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-sm text-muted-foreground">Humidity</span>
            <span className="text-sm font-medium">{humidity}%</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-sm text-muted-foreground">Wind</span>
            <span className="text-sm font-medium">{windSpeed} km/h</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 md:col-span-2">
            <span className="text-sm text-muted-foreground">Description</span>
            <span className="text-sm font-medium capitalize">
              {weatherDescription}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
