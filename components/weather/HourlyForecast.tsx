"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForecastTrendChart from "@/components/weather/ForecastTrendChart";
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
  const temperatureTrend = hourly.map((hour) => ({
    label: formatHour(hour.time),
    valueCelsius: hour.temperature,
  }));
  const precipitationTrend = hourly.flatMap((hour) =>
    hour.precipitationProbability === undefined
      ? []
      : [
          {
            label: formatHour(hour.time),
            valuePercent: hour.precipitationProbability,
          },
        ],
  );

  return (
    <Card className="overflow-hidden border-sky-200/70 bg-card/95 shadow-sm dark:border-sky-900/50">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
          <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
          Next 24 hours
        </div>
        <CardTitle className="text-xl">Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ForecastTrendChart
          title="Hourly trends"
          description="Temperature and precipitation probability across the displayed hours."
          unit={unit}
          temperatureSeries={[
            {
              id: "hourly-temperature",
              label: "Temperature",
              points: temperatureTrend,
              tone: "primary",
            },
          ]}
          precipitationSeries={[
            {
              id: "hourly-precipitation",
              label: "Precipitation",
              points: precipitationTrend,
              tone: "secondary",
            },
          ]}
          className="bg-gradient-to-br from-sky-50/80 via-background to-cyan-50/60 dark:from-sky-950/25 dark:via-background dark:to-cyan-950/15"
        />
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Timeline
        </p>
        <div
          className="flex snap-x gap-3 overflow-x-auto rounded-2xl border border-border/70 bg-muted/20 p-2 pb-3 [scrollbar-width:thin]"
          role="list"
          aria-label="Hourly weather forecast"
        >
          {hourly.map((hour) => (
            <div
              key={hour.time}
              className="flex min-w-[86px] snap-start flex-col items-center gap-2 rounded-2xl border border-white/60 bg-background/80 px-3 py-4 text-center shadow-sm dark:border-white/10 dark:bg-background/55"
              role="listitem"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {formatHour(hour.time)}
              </span>
              <span
                className="text-3xl drop-shadow-sm"
                role="img"
                aria-label={hour.condition.description}
              >
                {hour.condition.emoji}
              </span>
              <span className="text-base font-semibold tracking-tight">
                {convertTemperature(hour.temperature, unit)}
                {unit === "celsius" ? "°C" : "°F"}
              </span>
              {hour.precipitationProbability !== undefined && (
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  {hour.precipitationProbability}% rain
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
