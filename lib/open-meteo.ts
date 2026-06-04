import type { City } from "../types/city";
import { getWeatherCondition } from "./weather-codes";
import type {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherForecast,
} from "../types/weather";

const OPEN_METEO_FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
const FORECAST_DAYS = "7";

const CURRENT_VARIABLES = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "weather_code",
  "wind_speed_10m",
];

const HOURLY_VARIABLES = [
  "temperature_2m",
  "precipitation_probability",
  "wind_speed_10m",
  "weather_code",
];

const DAILY_VARIABLES = [
  "temperature_2m_min",
  "temperature_2m_max",
  "precipitation_probability_max",
  "weather_code",
];

type WeatherForecastErrorOptions = {
  status?: number;
  cause?: unknown;
};

export class WeatherForecastError extends Error {
  readonly status?: number;

  constructor(message: string, options: WeatherForecastErrorOptions = {}) {
    super(message, { cause: options.cause });

    this.name = "WeatherForecastError";
    this.status = options.status;
  }
}

interface OpenMeteoForecastResponse {
  timezone?: unknown;
  current?: unknown;
  hourly?: unknown;
  daily?: unknown;
}

interface OpenMeteoCurrentWeather {
  time?: unknown;
  temperature_2m?: unknown;
  apparent_temperature?: unknown;
  relative_humidity_2m?: unknown;
  weather_code?: unknown;
  wind_speed_10m?: unknown;
}

interface OpenMeteoHourlyWeather {
  time?: unknown;
  temperature_2m?: unknown;
  precipitation_probability?: unknown;
  wind_speed_10m?: unknown;
  weather_code?: unknown;
}

interface OpenMeteoDailyWeather {
  time?: unknown;
  temperature_2m_min?: unknown;
  temperature_2m_max?: unknown;
  precipitation_probability_max?: unknown;
  weather_code?: unknown;
}

export async function getWeatherForecast(
  city: City,
): Promise<WeatherForecast> {
  const response = await fetchWeatherForecast(city);

  return normalizeWeatherForecastResponse(response, city);
}

async function fetchWeatherForecast(
  city: City,
): Promise<OpenMeteoForecastResponse> {
  const url = buildWeatherForecastUrl(city);
  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new WeatherForecastError(
      "Unable to reach the Open-Meteo forecast service.",
      { cause: error },
    );
  }

  if (!response.ok) {
    throw new WeatherForecastError("Open-Meteo forecast request failed.", {
      status: response.status,
    });
  }

  try {
    const payload: unknown = await response.json();

    if (!isRecord(payload)) {
      throw new WeatherForecastError(
        "Open-Meteo forecast response was malformed.",
        { status: response.status },
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof WeatherForecastError) {
      throw error;
    }

    throw new WeatherForecastError(
      "Unable to parse the Open-Meteo forecast response.",
      { status: response.status, cause: error },
    );
  }
}

function buildWeatherForecastUrl(city: City): string {
  const url = new URL(OPEN_METEO_FORECAST_ENDPOINT);

  url.searchParams.set("latitude", String(city.latitude));
  url.searchParams.set("longitude", String(city.longitude));
  url.searchParams.set("timezone", city.timezone);
  url.searchParams.set("forecast_days", FORECAST_DAYS);
  url.searchParams.set("current", CURRENT_VARIABLES.join(","));
  url.searchParams.set("hourly", HOURLY_VARIABLES.join(","));
  url.searchParams.set("daily", DAILY_VARIABLES.join(","));

  return url.toString();
}

function normalizeWeatherForecastResponse(
  response: OpenMeteoForecastResponse,
  city: City,
): WeatherForecast {
  const current = asCurrentWeather(response.current);
  const hourly = asHourlyWeather(response.hourly);
  const daily = asDailyWeather(response.daily);

  return {
    city,
    timezone: asOptionalString(response.timezone) ?? city.timezone,
    current: normalizeCurrentWeather(current),
    hourly: normalizeHourlyForecast(hourly),
    daily: normalizeDailyForecast(daily),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeCurrentWeather(
  current: OpenMeteoCurrentWeather,
): CurrentWeather {
  const time = asRequiredString(current.time);
  const temperature = asRequiredNumber(current.temperature_2m);
  const apparentTemperature = asRequiredNumber(current.apparent_temperature);
  const relativeHumidity = asRequiredNumber(current.relative_humidity_2m);
  const windSpeed = asRequiredNumber(current.wind_speed_10m);
  const weatherCode = asRequiredNumber(current.weather_code);

  if (
    time === null ||
    temperature === null ||
    apparentTemperature === null ||
    relativeHumidity === null ||
    windSpeed === null ||
    weatherCode === null
  ) {
    throw new WeatherForecastError(
      "Open-Meteo forecast current weather was malformed.",
    );
  }

  return {
    time,
    temperature,
    apparentTemperature,
    relativeHumidity,
    windSpeed,
    condition: getWeatherCondition(weatherCode),
  };
}

function normalizeHourlyForecast(hourly: OpenMeteoHourlyWeather): HourlyForecast[] {
  const time = asRequiredArray(
    hourly.time,
    "Open-Meteo forecast hourly time data was malformed.",
  );
  const temperature = asRequiredArray(
    hourly.temperature_2m,
    "Open-Meteo forecast hourly temperature data was malformed.",
  );
  const precipitationProbability = asRequiredArray(
    hourly.precipitation_probability,
    "Open-Meteo forecast hourly precipitation data was malformed.",
  );
  const windSpeed = asRequiredArray(
    hourly.wind_speed_10m,
    "Open-Meteo forecast hourly wind data was malformed.",
  );
  const weatherCode = asRequiredArray(
    hourly.weather_code,
    "Open-Meteo forecast hourly weather-code data was malformed.",
  );
  const rowCount = Math.max(
    time.length,
    temperature.length,
    precipitationProbability.length,
    windSpeed.length,
    weatherCode.length,
  );
  const rows: HourlyForecast[] = [];

  for (let index = 0; index < rowCount; index += 1) {
    const row = normalizeHourlyForecastRow({
      time: time[index],
      temperature: temperature[index],
      precipitationProbability: precipitationProbability[index],
      windSpeed: windSpeed[index],
      weatherCode: weatherCode[index],
    });

    if (row !== null) {
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    throw new WeatherForecastError(
      "Open-Meteo forecast hourly weather was malformed.",
    );
  }

  return rows;
}

function normalizeHourlyForecastRow(row: {
  time: unknown;
  temperature: unknown;
  precipitationProbability: unknown;
  windSpeed: unknown;
  weatherCode: unknown;
}): HourlyForecast | null {
  const time = asRequiredString(row.time);
  const temperature = asRequiredNumber(row.temperature);
  const precipitationProbability = asRequiredNumber(row.precipitationProbability);
  const windSpeed = asRequiredNumber(row.windSpeed);
  const weatherCode = asRequiredNumber(row.weatherCode);

  if (
    time === null ||
    temperature === null ||
    precipitationProbability === null ||
    windSpeed === null ||
    weatherCode === null
  ) {
    return null;
  }

  return {
    time,
    temperature,
    precipitationProbability,
    windSpeed,
    condition: getWeatherCondition(weatherCode),
  };
}

function normalizeDailyForecast(daily: OpenMeteoDailyWeather): DailyForecast[] {
  const time = asRequiredArray(
    daily.time,
    "Open-Meteo forecast daily time data was malformed.",
  );
  const temperatureMin = asRequiredArray(
    daily.temperature_2m_min,
    "Open-Meteo forecast daily minimum-temperature data was malformed.",
  );
  const temperatureMax = asRequiredArray(
    daily.temperature_2m_max,
    "Open-Meteo forecast daily maximum-temperature data was malformed.",
  );
  const precipitationProbabilityMax = asRequiredArray(
    daily.precipitation_probability_max,
    "Open-Meteo forecast daily precipitation data was malformed.",
  );
  const weatherCode = asRequiredArray(
    daily.weather_code,
    "Open-Meteo forecast daily weather-code data was malformed.",
  );
  const rowCount = Math.max(
    time.length,
    temperatureMin.length,
    temperatureMax.length,
    precipitationProbabilityMax.length,
    weatherCode.length,
  );
  const rows: DailyForecast[] = [];

  for (let index = 0; index < rowCount; index += 1) {
    const row = normalizeDailyForecastRow({
      time: time[index],
      temperatureMin: temperatureMin[index],
      temperatureMax: temperatureMax[index],
      precipitationProbabilityMax: precipitationProbabilityMax[index],
      weatherCode: weatherCode[index],
    });

    if (row !== null) {
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    throw new WeatherForecastError(
      "Open-Meteo forecast daily weather was malformed.",
    );
  }

  return rows;
}

function normalizeDailyForecastRow(row: {
  time: unknown;
  temperatureMin: unknown;
  temperatureMax: unknown;
  precipitationProbabilityMax: unknown;
  weatherCode: unknown;
}): DailyForecast | null {
  const date = asRequiredString(row.time);
  const temperatureMin = asRequiredNumber(row.temperatureMin);
  const temperatureMax = asRequiredNumber(row.temperatureMax);
  const precipitationProbabilityMax = asRequiredNumber(
    row.precipitationProbabilityMax,
  );
  const weatherCode = asRequiredNumber(row.weatherCode);

  if (
    date === null ||
    temperatureMin === null ||
    temperatureMax === null ||
    precipitationProbabilityMax === null ||
    weatherCode === null
  ) {
    return null;
  }

  return {
    date,
    temperatureMin,
    temperatureMax,
    precipitationProbabilityMax,
    condition: getWeatherCondition(weatherCode),
  };
}

function asCurrentWeather(value: unknown): OpenMeteoCurrentWeather {
  if (!isRecord(value)) {
    throw new WeatherForecastError(
      "Open-Meteo forecast current weather was malformed.",
    );
  }

  return value;
}

function asHourlyWeather(value: unknown): OpenMeteoHourlyWeather {
  if (!isRecord(value)) {
    throw new WeatherForecastError(
      "Open-Meteo forecast hourly weather was malformed.",
    );
  }

  return value;
}

function asDailyWeather(value: unknown): OpenMeteoDailyWeather {
  if (!isRecord(value)) {
    throw new WeatherForecastError(
      "Open-Meteo forecast daily weather was malformed.",
    );
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asRequiredArray(value: unknown, errorMessage: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new WeatherForecastError(errorMessage);
  }

  return value;
}

function asRequiredString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length === 0 ? null : trimmedValue;
}

function asOptionalString(value: unknown): string | undefined {
  return asRequiredString(value) ?? undefined;
}

function asRequiredNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}
