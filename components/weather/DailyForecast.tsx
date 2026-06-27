"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForecastTrendChart from "@/components/weather/ForecastTrendChart";
import type { DailyForecast as DailyForecastType } from "@/types/weather";
import type { TemperatureUnit } from "@/hooks/useTemperatureUnit";
import { convertTemperature } from "@/hooks/useTemperatureUnit";

export interface DailyForecastProps {
  daily: DailyForecastType[];
  unit: TemperatureUnit;
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

export default function DailyForecast({ daily, unit }: DailyForecastProps) {
  const highTemperatureTrend = daily.map((day) => ({
    label: formatDay(day.date),
    valueCelsius: day.temperatureMax,
  }));
  const lowTemperatureTrend = daily.map((day) => ({
    label: formatDay(day.date),
    valueCelsius: day.temperatureMin,
  }));
  const precipitationTrend = daily.flatMap((day) =>
    day.precipitationProbabilityMax === undefined
      ? []
      : [
          {
            label: formatDay(day.date),
            valuePercent: day.precipitationProbabilityMax,
          },
        ],
  );

  return (
    <Card className="overflow-hidden border-sky-200/70 bg-card/95 shadow-sm dark:border-sky-900/50">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
          <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
          Weekly outlook
        </div>
        <CardTitle className="text-xl">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ForecastTrendChart
          title="Daily trends"
          description="High and low temperatures plus precipitation probability across the displayed days."
          unit={unit}
          temperatureSeries={[
            {
              id: "daily-high-temperature",
              label: "High temperature",
              points: highTemperatureTrend,
              tone: "primary",
            },
            {
              id: "daily-low-temperature",
              label: "Low temperature",
              points: lowTemperatureTrend,
              tone: "muted",
            },
          ]}
          precipitationSeries={[
            {
              id: "daily-precipitation",
              label: "Precipitation",
              points: precipitationTrend,
              tone: "secondary",
            },
          ]}
          className="bg-gradient-to-br from-sky-50/80 via-background to-amber-50/50 dark:from-sky-950/25 dark:via-background dark:to-amber-950/10"
        />
        {/* Mobile: horizontal scroll — Desktop: grid */}
        <div
          className="flex snap-x gap-3 overflow-x-auto rounded-2xl border border-border/70 bg-muted/20 p-2 pb-3 [scrollbar-width:thin] md:grid md:grid-cols-7 md:overflow-visible"
          role="list"
          aria-label="Daily weather forecast"
        >
          {daily.map((day) => (
            <div
              key={day.date}
              className="flex min-w-[118px] snap-start flex-col items-center gap-2 rounded-2xl border border-white/60 bg-background/80 p-4 text-center shadow-sm transition-colors hover:border-sky-300/70 hover:bg-sky-50/60 dark:border-white/10 dark:bg-background/55 dark:hover:border-sky-700/70 dark:hover:bg-sky-950/25 md:min-w-0"
              role="listitem"
            >
              <span className="text-sm font-semibold">{formatDay(day.date)}</span>
              <span className="text-xs text-muted-foreground">
                {formatFullDate(day.date)}
              </span>
              <span
                className="text-3xl drop-shadow-sm"
                role="img"
                aria-label={day.condition.description}
              >
                {day.condition.emoji}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold tracking-tight">
                  {convertTemperature(day.temperatureMax, unit)}
                  {unit === "celsius" ? "°C" : "°F"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {convertTemperature(day.temperatureMin, unit)}
                  {unit === "celsius" ? "°C" : "°F"}
                </span>
              </div>
              {day.precipitationProbabilityMax !== undefined && (
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  {day.precipitationProbabilityMax}% rain
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
