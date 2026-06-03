import type { City } from "./city";

export interface WeatherCondition {
  code: number;
  label: string;
  description: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature?: number;
  relativeHumidity?: number;
  precipitation?: number;
  windSpeed?: number;
  windDirection?: number;
  windGusts?: number;
  isDaylight?: boolean;
  condition: WeatherCondition;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  apparentTemperature?: number;
  relativeHumidity?: number;
  precipitationProbability?: number;
  precipitation?: number;
  windSpeed?: number;
  windDirection?: number;
  windGusts?: number;
  condition: WeatherCondition;
}

export interface DailyForecast {
  date: string;
  temperatureMin: number;
  temperatureMax: number;
  apparentTemperatureMin?: number;
  apparentTemperatureMax?: number;
  sunrise?: string;
  sunset?: string;
  precipitationProbabilityMax?: number;
  precipitationSum?: number;
  windSpeedMax?: number;
  windGustsMax?: number;
  dominantWindDirection?: number;
  condition: WeatherCondition;
}

export interface WeatherForecast {
  city: City;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  updatedAt: string;
}
