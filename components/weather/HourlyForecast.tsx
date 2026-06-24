"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HourlyForecast as HourlyForecastType } from "@/types/weather";
import type { TemperatureUnit } from "@/hooks/useTemperatureUnit";
import { convertTemperature } from "@/hooks/useTemperatureUnit";

export interface HourlyForecastProps {
  hourly: HourlyForecastType[];
  unit: TemperatureUnit;
}

function formatHour(isoTime: string): string {
  const date = new Date(isoTime);

  if (Number.isNaN(date.getTime())) {
    return isoTime;
  }

  return date.toLocaleString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}

export default function HourlyForecast({ hourly, unit }: HourlyForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex gap-4 overflow-x-auto pb-2"
          role="list"
          aria-label="Hourly weather forecast"
        >
          {hourly.map((hour) => (
            <div
              key={hour.time}
              className="flex min-w-[80px] flex-col items-center gap-1"
              role="listitem"
            >
              <span className="text-xs text-muted-foreground">
                {formatHour(hour.time)}
              </span>
              <span
                className="text-2xl"
                role="img"
                aria-label={hour.condition.description}
              >
                {hour.condition.emoji}
              </span>
              <span className="text-sm font-semibold">
                {convertTemperature(hour.temperature, unit)}
                {unit === "celsius" ? "°C" : "°F"}
              </span>
              {hour.precipitationProbability !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {hour.precipitationProbability}%
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
