"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export interface CurrentWeatherCardProps {
  cityName: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherIcon: string;
  weatherDescription: string;
}

export default function CurrentWeatherCard({
  cityName,
  country,
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  weatherIcon,
  weatherDescription,
}: CurrentWeatherCardProps) {
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
          <span className="text-4xl font-bold">{temperature}°</span>
        </div>

        {/* Detail fields – single column on mobile, two columns on wider screens */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-sm text-muted-foreground">Feels like</span>
            <span className="text-sm font-medium">{feelsLike}°</span>
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
