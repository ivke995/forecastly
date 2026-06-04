import type { WeatherCondition } from "../types/weather";

type WeatherConditionDetails = Omit<WeatherCondition, "code">;

const UNKNOWN_WEATHER_CONDITION: WeatherConditionDetails = {
  label: "Unknown weather condition",
  description: "Unknown Open-Meteo weather condition code.",
  emoji: "❔",
  severity: "low",
};

const WMO_WEATHER_CODE_CONDITIONS: Partial<
  Record<number, WeatherConditionDetails>
> = {
  0: {
    label: "Clear sky",
    description: "Cloud-free sky conditions.",
    emoji: "☀️",
    severity: "low",
  },
  1: {
    label: "Mainly clear",
    description: "Mostly clear sky with minimal cloud cover.",
    emoji: "🌤️",
    severity: "low",
  },
  2: {
    label: "Partly cloudy",
    description: "Mixed sun and clouds.",
    emoji: "⛅",
    severity: "low",
  },
  3: {
    label: "Overcast",
    description: "Sky fully covered by clouds.",
    emoji: "☁️",
    severity: "low",
  },
  45: {
    label: "Fog",
    description: "Reduced visibility caused by suspended water droplets.",
    emoji: "🌫️",
    severity: "low",
  },
  48: {
    label: "Depositing rime fog",
    description: "Fog with rime ice deposits.",
    emoji: "🌫️",
    severity: "low",
  },
  51: {
    label: "Light drizzle",
    description: "Light drizzle precipitation.",
    emoji: "🌦️",
    severity: "low",
  },
  53: {
    label: "Moderate drizzle",
    description: "Moderate drizzle precipitation.",
    emoji: "🌦️",
    severity: "moderate",
  },
  55: {
    label: "Dense drizzle",
    description: "Dense drizzle precipitation.",
    emoji: "🌧️",
    severity: "moderate",
  },
  56: {
    label: "Light freezing drizzle",
    description: "Light freezing drizzle precipitation.",
    emoji: "🌧️",
    severity: "high",
  },
  57: {
    label: "Dense freezing drizzle",
    description: "Dense freezing drizzle precipitation.",
    emoji: "🌧️",
    severity: "high",
  },
  61: {
    label: "Slight rain",
    description: "Slight rain precipitation.",
    emoji: "🌧️",
    severity: "low",
  },
  63: {
    label: "Moderate rain",
    description: "Moderate rain precipitation.",
    emoji: "🌧️",
    severity: "moderate",
  },
  65: {
    label: "Heavy rain",
    description: "Heavy rain precipitation.",
    emoji: "🌧️",
    severity: "high",
  },
  66: {
    label: "Light freezing rain",
    description: "Light freezing rain precipitation.",
    emoji: "🌧️",
    severity: "high",
  },
  67: {
    label: "Heavy freezing rain",
    description: "Heavy freezing rain precipitation.",
    emoji: "🌧️",
    severity: "high",
  },
  71: {
    label: "Slight snow fall",
    description: "Slight snowfall.",
    emoji: "🌨️",
    severity: "low",
  },
  73: {
    label: "Moderate snow fall",
    description: "Moderate snowfall.",
    emoji: "🌨️",
    severity: "moderate",
  },
  75: {
    label: "Heavy snow fall",
    description: "Heavy snowfall.",
    emoji: "🌨️",
    severity: "high",
  },
  77: {
    label: "Snow grains",
    description: "Snow grain precipitation.",
    emoji: "🌨️",
    severity: "low",
  },
  80: {
    label: "Slight rain showers",
    description: "Slight rain showers.",
    emoji: "🌦️",
    severity: "low",
  },
  81: {
    label: "Moderate rain showers",
    description: "Moderate rain showers.",
    emoji: "🌧️",
    severity: "moderate",
  },
  82: {
    label: "Violent rain showers",
    description: "Violent rain showers.",
    emoji: "⛈️",
    severity: "severe",
  },
  85: {
    label: "Slight snow showers",
    description: "Slight snow showers.",
    emoji: "🌨️",
    severity: "low",
  },
  86: {
    label: "Heavy snow showers",
    description: "Heavy snow showers.",
    emoji: "🌨️",
    severity: "high",
  },
  95: {
    label: "Thunderstorm",
    description: "Thunderstorm conditions.",
    emoji: "⛈️",
    severity: "high",
  },
  96: {
    label: "Thunderstorm with slight hail",
    description: "Thunderstorm with slight hail.",
    emoji: "⛈️",
    severity: "severe",
  },
  99: {
    label: "Thunderstorm with heavy hail",
    description: "Thunderstorm with heavy hail.",
    emoji: "⛈️",
    severity: "severe",
  },
};

export function getWeatherCondition(code: number): WeatherCondition {
  const details = WMO_WEATHER_CODE_CONDITIONS[code];

  if (details !== undefined) {
    return {
      code,
      ...details,
    };
  }

  if (Number.isFinite(code)) {
    return {
      code,
      ...UNKNOWN_WEATHER_CONDITION,
      description: `Unknown Open-Meteo weather condition code ${code}.`,
    };
  }

  return {
    code: -1,
    ...UNKNOWN_WEATHER_CONDITION,
  };
}
