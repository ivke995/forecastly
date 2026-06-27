"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WeatherRecommendation } from "@/lib/weather-recommendations";

export interface WeatherRecommendationsProps {
  recommendations: WeatherRecommendation[];
}

export default function WeatherRecommendations({
  recommendations,
}: WeatherRecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-sky-200/70 bg-gradient-to-br from-card via-card to-sky-50/70 shadow-sm dark:border-sky-900/50 dark:to-sky-950/20">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
          <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
          Weather guidance
        </div>
        <CardTitle className="text-xl">Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
          role="list"
          aria-label="Weather recommendations"
        >
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="group flex gap-3 rounded-2xl border border-white/60 bg-background/75 p-4 text-left shadow-sm transition-colors hover:border-sky-300/70 hover:bg-sky-50/70 dark:border-white/10 dark:bg-background/50 dark:hover:border-sky-700/70 dark:hover:bg-sky-950/30"
              role="listitem"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-2xl shadow-inner transition-transform group-hover:scale-105 dark:bg-sky-950"
                aria-hidden="true"
              >
                <span>{recommendation.icon}</span>
              </span>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold leading-none">
                  {recommendation.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {recommendation.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
