"use client";

import { useId } from "react";

import type { TemperatureUnit } from "@/hooks/useTemperatureUnit";
import { convertTemperature } from "@/hooks/useTemperatureUnit";
import { cn } from "@/lib/utils";

export interface TemperatureTrendPoint {
  label: string;
  valueCelsius: number;
}

export interface PrecipitationTrendPoint {
  label: string;
  valuePercent: number;
}

type ForecastTrendTone = "primary" | "secondary" | "muted";

export interface ForecastTrendSeries<TPoint> {
  id: string;
  label: string;
  points: TPoint[];
  tone?: ForecastTrendTone;
}

export interface ForecastTrendChartProps {
  title: string;
  description: string;
  unit: TemperatureUnit;
  temperatureSeries?: ForecastTrendSeries<TemperatureTrendPoint>[];
  precipitationSeries?: ForecastTrendSeries<PrecipitationTrendPoint>[];
  className?: string;
}

interface PreparedPoint {
  label: string;
  value: number;
  x: number;
  y: number;
}

interface PreparedSeries {
  id: string;
  label: string;
  points: PreparedPoint[];
  className: string;
  valueSuffix: string;
}

const WIDTH = 640;
const HEIGHT = 180;
const PADDING = 24;
const FLAT_RANGE_PADDING = 1;

const SERIES_TONE_CLASSES: Record<ForecastTrendTone, string> = {
  primary: "stroke-primary text-primary",
  secondary: "stroke-sky-500 text-sky-600 dark:text-sky-300",
  muted: "stroke-amber-500 text-amber-600 dark:text-amber-300",
};

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function getRange(values: number[], fallbackMin: number, fallbackMax: number) {
  if (values.length === 0) {
    return { min: fallbackMin, max: fallbackMax };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return {
      min: min - FLAT_RANGE_PADDING,
      max: max + FLAT_RANGE_PADDING,
    };
  }

  return { min, max };
}

function xForIndex(index: number, total: number): number {
  if (total <= 1) {
    return WIDTH / 2;
  }

  return PADDING + (index / (total - 1)) * (WIDTH - PADDING * 2);
}

function yForValue(value: number, min: number, max: number): number {
  const ratio = (value - min) / (max - min || 1);
  return HEIGHT - PADDING - ratio * (HEIGHT - PADDING * 2);
}

function pathFromPoints(points: PreparedPoint[]): string {
  if (points.length === 0) return "";

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function prepareTemperatureSeries(
  series: ForecastTrendSeries<TemperatureTrendPoint>[],
  unit: TemperatureUnit,
): PreparedSeries[] {
  const convertedSeries = series.map((item) => ({
    ...item,
    points: item.points
      .filter((point) => isFiniteNumber(point.valueCelsius))
      .map((point) => ({
        label: point.label,
        value: convertTemperature(point.valueCelsius, unit),
      })),
  }));
  const values = convertedSeries.flatMap((item) =>
    item.points.map((point) => point.value),
  );
  const range = getRange(values, 0, 1);

  return convertedSeries.map((item) => ({
    id: item.id,
    label: item.label,
    className: SERIES_TONE_CLASSES[item.tone ?? "primary"],
    valueSuffix: unit === "celsius" ? "°C" : "°F",
    points: item.points.map((point, index) => ({
      ...point,
      x: xForIndex(index, item.points.length),
      y: yForValue(point.value, range.min, range.max),
    })),
  }));
}

function preparePrecipitationSeries(
  series: ForecastTrendSeries<PrecipitationTrendPoint>[],
): PreparedSeries[] {
  return series.map((item) => ({
    id: item.id,
    label: item.label,
    className: SERIES_TONE_CLASSES[item.tone ?? "secondary"],
    valueSuffix: "%",
    points: item.points
      .filter((point) => isFiniteNumber(point.valuePercent))
      .map((point, index, points) => {
        const value = clampPercent(point.valuePercent);

        return {
          label: point.label,
          value,
          x: xForIndex(index, points.length),
          y: yForValue(value, 0, 100),
        };
      }),
  }));
}

function AccessibleSeriesList({ series }: { series: PreparedSeries[] }) {
  return (
    <ul className="sr-only">
      {series.map((item) => (
        <li key={item.id}>
          {item.label}: {item.points.length > 0
            ? item.points
                .map(
                  (point) => `${point.label} ${point.value}${item.valueSuffix}`,
                )
                .join(", ")
            : "No data available"}
        </li>
      ))}
    </ul>
  );
}

export default function ForecastTrendChart({
  title,
  description,
  unit,
  temperatureSeries = [],
  precipitationSeries = [],
  className,
}: ForecastTrendChartProps) {
  const componentId = useId();
  const preparedSeries = [
    ...prepareTemperatureSeries(temperatureSeries, unit),
    ...preparePrecipitationSeries(precipitationSeries),
  ];
  const hasData = preparedSeries.some((series) => series.points.length > 0);
  const titleId = `${componentId}-forecast-trend-chart-title`;
  const descriptionId = `${componentId}-forecast-trend-chart-description`;

  return (
    <figure
      className={cn(
        "rounded-2xl border border-border/70 bg-background/70 p-4 shadow-inner",
        className,
      )}
    >
      <figcaption className="space-y-1.5">
        <h3 id={titleId} className="text-sm font-semibold tracking-tight">
          {title}
        </h3>
        <p id={descriptionId} className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </figcaption>

      {hasData ? (
        <>
          <svg
            className="mt-5 h-48 w-full overflow-visible rounded-xl bg-gradient-to-b from-background/70 to-muted/20 p-1"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-labelledby={`${titleId} ${descriptionId}`}
          >
            <defs>
              <pattern
                id={`${componentId}-grid`}
                width="80"
                height="44"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 80 0 L 0 0 0 44"
                  fill="none"
                  className="stroke-border/60"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              x={PADDING}
              y={PADDING}
              width={WIDTH - PADDING * 2}
              height={HEIGHT - PADDING * 2}
              fill={`url(#${componentId}-grid)`}
              opacity="0.65"
            />
            <line
              x1={PADDING}
              x2={WIDTH - PADDING}
              y1={HEIGHT - PADDING}
              y2={HEIGHT - PADDING}
              className="stroke-border"
              strokeWidth="1"
            />
            <line
              x1={PADDING}
              x2={PADDING}
              y1={PADDING}
              y2={HEIGHT - PADDING}
              className="stroke-border"
              strokeWidth="1"
            />
            {preparedSeries.map((series) => (
              <g key={series.id} className={series.className}>
                {series.points.length === 1 ? (
                  <circle
                    cx={series.points[0].x}
                    cy={series.points[0].y}
                    r="4"
                    className="fill-current stroke-none"
                  />
                ) : (
                  <path
                    d={pathFromPoints(series.points)}
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {series.points.map((point) => (
                  <circle
                    key={`${series.id}-${point.label}-${point.x}`}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    className="fill-background drop-shadow-sm"
                    strokeWidth="2.5"
                  >
                    <title>
                      {series.label}, {point.label}: {point.value}
                      {series.valueSuffix}
                    </title>
                  </circle>
                ))}
              </g>
            ))}
          </svg>
          <div
            className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground"
            aria-hidden="true"
          >
            {preparedSeries.map((series) => (
              <span
                key={series.id}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-current/15 bg-background/70 px-2.5 py-1 font-medium",
                  series.className,
                )}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {series.label}
              </span>
            ))}
          </div>
          <AccessibleSeriesList series={preparedSeries} />
        </>
      ) : (
        <p className="mt-4 rounded-md border border-dashed border-foreground/15 p-4 text-sm text-muted-foreground">
          No trend data available.
        </p>
      )}
    </figure>
  );
}
