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
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
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
              className="flex gap-3 rounded-lg bg-muted/50 p-3 text-left"
              role="listitem"
            >
              <span className="text-2xl" aria-hidden="true">
                {recommendation.icon}
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">
                  {recommendation.title}
                </h3>
                <p className="text-sm text-muted-foreground">
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
