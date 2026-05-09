import type {
  OpenMeteoGeocodingRequest,
  OpenMeteoGeocodingResponse,
  OpenMeteoGeocodingResult,
} from './types'

const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search'

function readStringRecord(
  value: unknown,
  label: string
): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Open-Meteo geocoding ${label} is not a valid object.`)
  }

  return value as Record<string, unknown>
}

function validateGeocodingResult(value: unknown): OpenMeteoGeocodingResult {
  const result = readStringRecord(value, 'result')

  for (const field of ['id', 'latitude', 'longitude'] as const) {
    if (typeof result[field] !== 'number') {
      throw new Error(
        `Open-Meteo geocoding result field "${field}" must be a number.`
      )
    }
  }

  if (typeof result.name !== 'string') {
    throw new Error(
      'Open-Meteo geocoding result field "name" must be a string.'
    )
  }

  for (const field of [
    'country',
    'country_code',
    'timezone',
    'feature_code',
    'admin1',
    'admin2',
    'admin3',
    'admin4',
  ] as const) {
    if (field in result && typeof result[field] !== 'string') {
      throw new Error(
        `Open-Meteo geocoding result field "${field}" must be a string.`
      )
    }
  }

  for (const field of [
    'elevation',
    'country_id',
    'population',
    'admin1_id',
    'admin2_id',
    'admin3_id',
    'admin4_id',
  ] as const) {
    if (field in result && typeof result[field] !== 'number') {
      throw new Error(
        `Open-Meteo geocoding result field "${field}" must be a number.`
      )
    }
  }

  if (
    result.postcodes !== undefined &&
    (!Array.isArray(result.postcodes) ||
      result.postcodes.some((postcode) => typeof postcode !== 'string'))
  ) {
    throw new Error(
      'Open-Meteo geocoding result field "postcodes" must be an array of strings.'
    )
  }

  return result as OpenMeteoGeocodingResult
}

function validateGeocodingResponse(
  payload: unknown
): OpenMeteoGeocodingResponse {
  const root = readStringRecord(payload, 'response')

  if (root.results === undefined) {
    return {}
  }

  if (!Array.isArray(root.results)) {
    throw new Error(
      'Open-Meteo geocoding response field "results" must be an array.'
    )
  }

  return {
    results: root.results.map(validateGeocodingResult),
  }
}

export function buildOpenMeteoGeocodingUrl({
  name,
  count = 10,
  language = 'en',
  countryCode,
}: OpenMeteoGeocodingRequest): string {
  const normalizedName = name.trim()

  if (normalizedName.length < 2) {
    throw new Error('Geocoding search requires at least 2 characters.')
  }

  if (!Number.isInteger(count) || count < 1 || count > 100) {
    throw new Error('Geocoding count must be an integer between 1 and 100.')
  }

  const searchParams = new URLSearchParams({
    name: normalizedName,
    count: count.toString(),
    language,
  })

  if (countryCode !== undefined && countryCode.trim().length > 0) {
    searchParams.set('countryCode', countryCode.trim().toUpperCase())
  }

  return `${GEOCODING_ENDPOINT}?${searchParams.toString()}`
}

export async function searchOpenMeteoLocations(
  request: OpenMeteoGeocodingRequest
): Promise<OpenMeteoGeocodingResponse> {
  const response = await fetch(buildOpenMeteoGeocodingUrl(request), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Open-Meteo geocoding request failed with status ${String(response.status)}.`
    )
  }

  return validateGeocodingResponse((await response.json()) as unknown)
}
