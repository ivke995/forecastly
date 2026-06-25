import type { CurrentWeather, WeatherSeverity } from "@/types/weather";

export type WeatherRiskBadgeId =
  | "storm"
  | "heavy-rain"
  | "fog"
  | "snow"
  | "strong-wind"
  | "extreme-heat"
  | "extreme-cold"
  | "severe-condition";

export type WeatherRiskBadgeTone = "caution" | "danger" | "cold" | "heat";

export interface WeatherRiskBadge {
  id: WeatherRiskBadgeId;
  icon: string;
  label: string;
  description: string;
  tone: WeatherRiskBadgeTone;
}

const HIGH_SEVERITIES = new Set<WeatherSeverity>(["high", "severe"]);
const STORM_CODES = new Set<number>([95, 96, 99]);
const HEAVY_RAIN_CODES = new Set<number>([65, 67, 82]);
const FOG_CODES = new Set<number>([45, 48]);
const SNOW_CODES = new Set<number>([71, 73, 75, 77, 85, 86]);

const HEAVY_PRECIPITATION_MM_PER_HOUR = 7.6;
const STRONG_WIND_KMH = 40;
const STRONG_GUST_KMH = 50;
const EXTREME_HEAT_C = 35;
const EXTREME_COLD_C = -10;

function conditionText(current: CurrentWeather): string {
  return `${current.condition.label} ${current.condition.description}`.toLowerCase();
}

function effectiveTemperature(current: CurrentWeather): number {
  return current.apparentTemperature ?? current.temperature;
}

function isStorm(current: CurrentWeather, text: string): boolean {
  return (
    STORM_CODES.has(current.condition.code) ||
    text.includes("thunderstorm") ||
    text.includes("storm")
  );
}

function isHeavyRain(current: CurrentWeather, text: string): boolean {
  return (
    HEAVY_RAIN_CODES.has(current.condition.code) ||
    text.includes("heavy rain") ||
    text.includes("violent rain") ||
    (current.precipitation !== undefined &&
      current.precipitation >= HEAVY_PRECIPITATION_MM_PER_HOUR)
  );
}

function isFog(current: CurrentWeather, text: string): boolean {
  return FOG_CODES.has(current.condition.code) || text.includes("fog");
}

function isSnow(current: CurrentWeather, text: string): boolean {
  return SNOW_CODES.has(current.condition.code) || text.includes("snow");
}

function addBadge(
  badges: WeatherRiskBadge[],
  badge: WeatherRiskBadge,
): void {
  if (!badges.some((existing) => existing.id === badge.id)) {
    badges.push(badge);
  }
}

/**
 * Returns deterministic, UI-free current-weather risk badges from normalized
 * Forecastly weather data. Values are expected to use the app's canonical
 * weather units: Celsius temperatures and km/h wind speeds.
 */
export function getCurrentWeatherRiskBadges(
  current: CurrentWeather,
): WeatherRiskBadge[] {
  const badges: WeatherRiskBadge[] = [];
  const text = conditionText(current);
  const hasConditionSpecificRisk =
    isStorm(current, text) ||
    isHeavyRain(current, text) ||
    isFog(current, text) ||
    isSnow(current, text);

  if (isStorm(current, text)) {
    addBadge(badges, {
      id: "storm",
      icon: "⛈️",
      label: "Storm risk",
      description: "Thunderstorm conditions are possible now.",
      tone: "danger",
    });
  }

  if (isHeavyRain(current, text)) {
    addBadge(badges, {
      id: "heavy-rain",
      icon: "🌧️",
      label: "Heavy rain",
      description: "Heavy rainfall may reduce visibility or cause slick travel.",
      tone: "caution",
    });
  }

  if (isFog(current, text)) {
    addBadge(badges, {
      id: "fog",
      icon: "🌫️",
      label: "Fog",
      description: "Fog may reduce visibility outdoors and on roads.",
      tone: "caution",
    });
  }

  if (isSnow(current, text)) {
    addBadge(badges, {
      id: "snow",
      icon: "🌨️",
      label: "Snow",
      description: "Snow may affect travel and outdoor conditions.",
      tone: "cold",
    });
  }

  if (
    (current.windSpeed !== undefined && current.windSpeed >= STRONG_WIND_KMH) ||
    (current.windGusts !== undefined && current.windGusts >= STRONG_GUST_KMH)
  ) {
    addBadge(badges, {
      id: "strong-wind",
      icon: "💨",
      label: "Strong wind",
      description: "Strong winds or gusts may make outdoor activity harder.",
      tone: "caution",
    });
  }

  const temperature = effectiveTemperature(current);
  if (temperature >= EXTREME_HEAT_C) {
    addBadge(badges, {
      id: "extreme-heat",
      icon: "🥵",
      label: "Extreme heat",
      description: "Very high temperatures may increase heat stress risk.",
      tone: "heat",
    });
  }

  if (temperature <= EXTREME_COLD_C) {
    addBadge(badges, {
      id: "extreme-cold",
      icon: "🥶",
      label: "Extreme cold",
      description: "Very low temperatures may increase cold exposure risk.",
      tone: "cold",
    });
  }

  if (
    HIGH_SEVERITIES.has(current.condition.severity) &&
    !hasConditionSpecificRisk
  ) {
    addBadge(badges, {
      id: "severe-condition",
      icon: "⚠️",
      label:
        current.condition.severity === "severe"
          ? "Severe conditions"
          : "High-impact conditions",
      description: `${current.condition.label}: ${current.condition.description}`,
      tone: current.condition.severity === "severe" ? "danger" : "caution",
    });
  }

  return badges;
}
