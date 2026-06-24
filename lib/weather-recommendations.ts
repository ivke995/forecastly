import type { WeatherForecast, WeatherSeverity } from "@/types/weather";

export interface WeatherRecommendation {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const RAIN_CODES = new Set<number>([
  51, 53, 55, 56, 57, // drizzle
  61, 63, 65, 66, 67, // rain
  80, 81, 82, // rain showers
  95, 96, 99, // thunderstorm
]);

function isRainCode(code: number): boolean {
  return RAIN_CODES.has(code);
}

function hasRainInHourly(hourly: WeatherForecast["hourly"], lookahead: number): boolean {
  const slice = hourly.slice(0, lookahead);
  return slice.some(
    (h) =>
      h.precipitation !== undefined ||
      (h.precipitationProbability !== undefined && h.precipitationProbability > 50) ||
      isRainCode(h.condition.code),
  );
}

/**
 * Returns a deterministic, capped set of weather recommendations derived
 * from the given forecast.  Each rule inspects the relevant fields and
 * skips itself when required optional data is missing.
 *
 * Recommendation order is stable across calls with identical input.
 */
export function getWeatherRecommendations(
  forecast: WeatherForecast,
): WeatherRecommendation[] {
  const recommendations: WeatherRecommendation[] = [];
  const { current, hourly, daily } = forecast;
  const today = daily[0];

  // 1 — Umbrella / rain
  if (
    (current.precipitation !== undefined && current.precipitation > 0) ||
    isRainCode(current.condition.code) ||
    hasRainInHourly(hourly, 6) ||
    (today?.precipitationSum !== undefined && today.precipitationSum > 0) ||
    (today?.precipitationProbabilityMax !== undefined &&
      today.precipitationProbabilityMax > 50) ||
    (today?.condition !== undefined && isRainCode(today.condition.code))
  ) {
    recommendations.push({
      id: "umbrella",
      icon: "☂️",
      title: "Bring an umbrella",
      description: "Rain is in the forecast — keep an umbrella nearby.",
    });
  }

  // 2 — Sunscreen / heat
  const isHot = current.temperature > 28;
  const isClearAndWarm =
    (current.condition.code === 0 || current.condition.code === 1) &&
    current.temperature > 25;
  if (isHot || isClearAndWarm) {
    recommendations.push({
      id: "sunscreen",
      icon: "🧴",
      title: "Sun protection advised",
      description: isHot
        ? "High temperatures today — drink plenty of water and wear sunscreen."
        : "Clear and warm — sunscreen is recommended if you will be outside.",
    });
  }

  // 3 — Windy conditions
  const veryWindy =
    (current.windSpeed !== undefined && current.windSpeed > 30) ||
    (current.windGusts !== undefined && current.windGusts > 40) ||
    (today?.windSpeedMax !== undefined && today.windSpeedMax > 30) ||
    (today?.windGustsMax !== undefined && today.windGustsMax > 40);
  if (veryWindy) {
    recommendations.push({
      id: "windy",
      icon: "💨",
      title: "Windy conditions",
      description:
        "Strong winds expected — take care if commuting or spending time outdoors.",
    });
  }

  // 4 — Humidity / comfort
  if (
    current.relativeHumidity !== undefined &&
    current.relativeHumidity > 70
  ) {
    recommendations.push({
      id: "humidity",
      icon: "💧",
      title: "High humidity",
      description: `Humidity is at ${current.relativeHumidity}% — it may feel stuffy outdoors.`,
    });
  }

  // 5 — Severe-weather caution
  const highSeverities: WeatherSeverity[] = ["high", "severe"];
  const currentSevere = highSeverities.includes(current.condition.severity);
  const todaySevere =
    today?.condition !== undefined &&
    highSeverities.includes(today.condition.severity);
  if (currentSevere || todaySevere) {
    const source = currentSevere ? current.condition : today!.condition;
    recommendations.push({
      id: "severe",
      icon: "⚠️",
      title: "Severe weather alert",
      description: `${source.label}: ${source.description} — exercise caution and stay aware of changing conditions.`,
    });
  }

  // 6 — Good running weather
  const mildTemp = current.temperature >= 10 && current.temperature <= 26;
  const lightWind =
    current.windSpeed === undefined || current.windSpeed < 15;
  const noRain =
    current.precipitation === undefined || current.precipitation === 0;
  const lowSeverity = current.condition.severity === "low";
  if (mildTemp && lightWind && noRain && lowSeverity) {
    recommendations.push({
      id: "running",
      icon: "🏃",
      title: "Good running weather",
      description:
        "Mild temperatures and light winds — great conditions for a run.",
    });
  }

  return recommendations;
}
