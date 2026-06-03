import type { CitySearchResult } from "../types/city";

const OPEN_METEO_GEOCODING_ENDPOINT =
  "https://geocoding-api.open-meteo.com/v1/search";
const DEFAULT_RESULT_COUNT = "10";
const DEFAULT_LANGUAGE = "en";

type GeocodingErrorOptions = {
  status?: number;
  cause?: unknown;
};

export class GeocodingError extends Error {
  readonly status?: number;

  constructor(message: string, options: GeocodingErrorOptions = {}) {
    super(message, { cause: options.cause });

    this.name = "GeocodingError";
    this.status = options.status;
  }
}

interface OpenMeteoGeocodingResponse {
  results?: unknown;
}

interface OpenMeteoGeocodingResult {
  id?: unknown;
  name?: unknown;
  country?: unknown;
  country_code?: unknown;
  admin1?: unknown;
  admin2?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  timezone?: unknown;
  population?: unknown;
  elevation?: unknown;
}

export async function searchCities(
  query: string,
): Promise<CitySearchResult[]> {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length === 0) {
    return [];
  }

  const response = await fetchGeocodingResults(normalizedQuery);

  return normalizeGeocodingResponse(response);
}

async function fetchGeocodingResults(
  query: string,
): Promise<OpenMeteoGeocodingResponse> {
  const url = buildGeocodingUrl(query);
  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new GeocodingError(
      "Unable to reach the Open-Meteo geocoding service.",
      { cause: error },
    );
  }

  if (!response.ok) {
    throw new GeocodingError("Open-Meteo geocoding request failed.", {
      status: response.status,
    });
  }

  try {
    const payload: unknown = await response.json();

    if (!isRecord(payload)) {
      throw new GeocodingError(
        "Open-Meteo geocoding response was malformed.",
        { status: response.status },
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof GeocodingError) {
      throw error;
    }

    throw new GeocodingError(
      "Unable to parse the Open-Meteo geocoding response.",
      { status: response.status, cause: error },
    );
  }
}

function buildGeocodingUrl(query: string): string {
  const url = new URL(OPEN_METEO_GEOCODING_ENDPOINT);

  url.searchParams.set("name", query);
  url.searchParams.set("count", DEFAULT_RESULT_COUNT);
  url.searchParams.set("language", DEFAULT_LANGUAGE);
  url.searchParams.set("format", "json");

  return url.toString();
}

function normalizeGeocodingResponse(
  response: OpenMeteoGeocodingResponse,
): CitySearchResult[] {
  if (response.results === undefined) {
    return [];
  }

  if (!Array.isArray(response.results)) {
    throw new GeocodingError("Open-Meteo geocoding results were malformed.");
  }

  return response.results.flatMap((result) => {
    const city = normalizeGeocodingResult(result);

    return city === null ? [] : [city];
  });
}

function normalizeGeocodingResult(result: unknown): CitySearchResult | null {
  if (!isOpenMeteoGeocodingResult(result)) {
    return null;
  }

  const id = asProviderId(result.id);
  const name = asRequiredString(result.name);
  const country = asRequiredString(result.country);
  const latitude = asRequiredNumber(result.latitude);
  const longitude = asRequiredNumber(result.longitude);
  const timezone = asRequiredString(result.timezone);

  if (
    id === null ||
    name === null ||
    country === null ||
    latitude === null ||
    longitude === null ||
    timezone === null
  ) {
    return null;
  }

  const admin1 = asOptionalString(result.admin1);
  const admin2 = asOptionalString(result.admin2);
  const countryCode = asOptionalString(result.country_code);
  const population = asOptionalNonNegativeNumber(result.population);
  const elevation = asOptionalNumber(result.elevation);

  return {
    id,
    name,
    displayName: buildDisplayName({ name, admin1, country }),
    country,
    ...(countryCode === undefined ? {} : { countryCode }),
    ...(admin1 === undefined ? {} : { admin1 }),
    ...(admin2 === undefined ? {} : { admin2 }),
    latitude,
    longitude,
    timezone,
    ...(population === undefined ? {} : { population }),
    ...(elevation === undefined ? {} : { elevation }),
  };
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

function isOpenMeteoGeocodingResult(
  result: unknown,
): result is OpenMeteoGeocodingResult {
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
