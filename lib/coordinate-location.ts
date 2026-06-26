import type { CitySearchResult } from "../types/city";

const OPEN_METEO_REVERSE_GEOCODING_ENDPOINT =
  "https://geocoding-api.open-meteo.com/v1/reverse";
const DEFAULT_LANGUAGE = "en";
const DEFAULT_RESULT_COUNT = "1";
const DEFAULT_TIMEZONE = "auto";
const COORDINATE_DISPLAY_PRECISION = 2;
const COORDINATE_ID_PRECISION = 4;

type CoordinateLocationErrorOptions = {
  cause?: unknown;
};

export class CoordinateLocationError extends Error {
  constructor(message: string, options: CoordinateLocationErrorOptions = {}) {
    super(message, { cause: options.cause });

    this.name = "CoordinateLocationError";
  }
}

export interface CoordinateLocationInput {
  latitude: number;
  longitude: number;
  timezone?: string;
}

export type CoordinateLocationSource =
  | "reverse-geocoding"
  | "coordinate-fallback";

export interface CoordinateLocationResult {
  city: CitySearchResult;
  source: CoordinateLocationSource;
  lookupError?: CoordinateLocationError;
}

interface OpenMeteoReverseGeocodingResponse {
  results?: unknown;
}

interface OpenMeteoReverseGeocodingResult {
  id?: unknown;
  name?: unknown;
  country?: unknown;
  country_code?: unknown;
  admin1?: unknown;
  admin2?: unknown;
  timezone?: unknown;
  population?: unknown;
  elevation?: unknown;
}

export function createCoordinateCity(
  input: CoordinateLocationInput,
): CitySearchResult {
  const coordinates = normalizeCoordinates(input);
  const displayName = formatCoordinateDisplay(coordinates);

  return {
    id: buildCoordinateId(coordinates),
    name: "Your location",
    displayName,
    country: "Coordinates",
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    timezone: coordinates.timezone,
  };
}

export async function resolveCoordinateLocation(
  input: CoordinateLocationInput,
): Promise<CoordinateLocationResult> {
  const fallbackCity = createCoordinateCity(input);

  try {
    const readableCity = await fetchReadableCoordinateCity(fallbackCity);

    if (readableCity === null) {
      return {
        city: fallbackCity,
        source: "coordinate-fallback",
      };
    }

    return {
      city: readableCity,
      source: "reverse-geocoding",
    };
  } catch (error) {
    return {
      city: fallbackCity,
      source: "coordinate-fallback",
      lookupError:
        error instanceof CoordinateLocationError
          ? error
          : new CoordinateLocationError(
              "Unable to resolve a readable location name.",
              { cause: error },
            ),
    };
  }
}

export function formatCoordinateDisplay(input: CoordinateLocationInput): string {
  const coordinates = normalizeCoordinates(input);

  return `Your location (${formatCoordinateValue(
    coordinates.latitude,
    COORDINATE_DISPLAY_PRECISION,
  )}, ${formatCoordinateValue(
    coordinates.longitude,
    COORDINATE_DISPLAY_PRECISION,
  )})`;
}

function normalizeCoordinates(
  input: CoordinateLocationInput,
): Required<CoordinateLocationInput> {
  const latitude = asValidLatitude(input.latitude);
  const longitude = asValidLongitude(input.longitude);
  const timezone = asOptionalString(input.timezone) ?? DEFAULT_TIMEZONE;

  if (latitude === null || longitude === null) {
    throw new CoordinateLocationError(
      "Coordinates must include a valid latitude and longitude.",
    );
  }

  return { latitude, longitude, timezone };
}

async function fetchReadableCoordinateCity(
  fallbackCity: CitySearchResult,
): Promise<CitySearchResult | null> {
  const response = await fetch(buildReverseGeocodingUrl(fallbackCity));

  if (!response.ok) {
    throw new CoordinateLocationError("Open-Meteo reverse geocoding failed.");
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch (error) {
    throw new CoordinateLocationError(
      "Unable to parse the Open-Meteo reverse geocoding response.",
      { cause: error },
    );
  }

  if (!isRecord(payload)) {
    throw new CoordinateLocationError(
      "Open-Meteo reverse geocoding response was malformed.",
    );
  }

  return normalizeReverseGeocodingResponse(payload, fallbackCity);
}

function buildReverseGeocodingUrl(city: CitySearchResult): string {
  const url = new URL(OPEN_METEO_REVERSE_GEOCODING_ENDPOINT);

  url.searchParams.set("latitude", String(city.latitude));
  url.searchParams.set("longitude", String(city.longitude));
  url.searchParams.set("count", DEFAULT_RESULT_COUNT);
  url.searchParams.set("language", DEFAULT_LANGUAGE);
  url.searchParams.set("format", "json");

  return url.toString();
}

function normalizeReverseGeocodingResponse(
  response: OpenMeteoReverseGeocodingResponse,
  fallbackCity: CitySearchResult,
): CitySearchResult | null {
  if (response.results === undefined) {
    return null;
  }

  if (!Array.isArray(response.results)) {
    throw new CoordinateLocationError(
      "Open-Meteo reverse geocoding results were malformed.",
    );
  }

  for (const result of response.results) {
    const city = normalizeReverseGeocodingResult(result, fallbackCity);

    if (city !== null) {
      return city;
    }
  }

  return null;
}

function normalizeReverseGeocodingResult(
  result: unknown,
  fallbackCity: CitySearchResult,
): CitySearchResult | null {
  if (!isOpenMeteoReverseGeocodingResult(result)) {
    return null;
  }

  const name = asRequiredString(result.name);
  const country = asRequiredString(result.country);

  if (name === null || country === null) {
    return null;
  }

  const providerId = asProviderId(result.id);
  const admin1 = asOptionalString(result.admin1);
  const admin2 = asOptionalString(result.admin2);
  const countryCode = asOptionalString(result.country_code);
  const timezone = asOptionalString(result.timezone) ?? fallbackCity.timezone;
  const population = asOptionalNonNegativeNumber(result.population);
  const elevation = asOptionalNumber(result.elevation);

  return {
    id: providerId ?? fallbackCity.id,
    name,
    displayName: buildDisplayName({ name, admin1, country }),
    country,
    ...(countryCode === undefined ? {} : { countryCode }),
    ...(admin1 === undefined ? {} : { admin1 }),
    ...(admin2 === undefined ? {} : { admin2 }),
    latitude: fallbackCity.latitude,
    longitude: fallbackCity.longitude,
    timezone,
    ...(population === undefined ? {} : { population }),
    ...(elevation === undefined ? {} : { elevation }),
  };
}

function buildCoordinateId(input: CoordinateLocationInput): string {
  return `coordinates:${formatCoordinateValue(
    input.latitude,
    COORDINATE_ID_PRECISION,
  )},${formatCoordinateValue(input.longitude, COORDINATE_ID_PRECISION)}`;
}

function buildDisplayName({
  name,
  admin1,
  country,
}: {
  name: string;
  admin1?: string;
  country: string;
}): string {
  return [name, admin1, country].filter(Boolean).join(", ");
}

function formatCoordinateValue(value: number, precision: number): string {
  return value.toFixed(precision).replace("-0.", "0.");
}

function isOpenMeteoReverseGeocodingResult(
  result: unknown,
): result is OpenMeteoReverseGeocodingResult {
  return isRecord(result);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asProviderId(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return asRequiredString(value);
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

function asOptionalNumber(value: unknown): number | undefined {
  return asRequiredNumber(value) ?? undefined;
}

function asOptionalNonNegativeNumber(value: unknown): number | undefined {
  const numberValue = asRequiredNumber(value);

  if (numberValue === null || numberValue < 0) {
    return undefined;
  }

  return numberValue;
}

function asValidLatitude(value: unknown): number | null {
  const numberValue = asRequiredNumber(value);

  if (numberValue === null || numberValue < -90 || numberValue > 90) {
    return null;
  }

  return numberValue;
}

function asValidLongitude(value: unknown): number | null {
  const numberValue = asRequiredNumber(value);

  if (numberValue === null || numberValue < -180 || numberValue > 180) {
    return null;
  }

  return numberValue;
}
