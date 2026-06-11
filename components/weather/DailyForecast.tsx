"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DailyForecast as DailyForecastType } from "@/types/weather";

export interface DailyForecastProps {
  daily: DailyForecastType[];
}

function formatDay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function DailyForecast({ daily }: DailyForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile: horizontal scroll — Desktop: grid */}
        <div
          className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-7 md:overflow-visible"
          role="list"
          aria-label="Daily weather forecast"
        >
          {daily.map((day) => (
            <div
              key={day.date}
              className="flex min-w-[100px] flex-col items-center gap-1.5 rounded-lg border border-foreground/10 bg-muted/30 p-3 md:min-w-0"
              role="listitem"
            >
              <span className="text-sm font-medium">{formatDay(day.date)}</span>
              <span className="text-xs text-muted-foreground">
                {formatFullDate(day.date)}
              </span>
              <span
                className="text-2xl"
                role="img"
                aria-label={day.condition.description}
              >
                {day.condition.emoji}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold">
                  {Math.round(day.temperatureMax)}°
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(day.temperatureMin)}°
                </span>
              </div>
              {day.precipitationProbabilityMax !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {day.precipitationProbabilityMax}%
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
