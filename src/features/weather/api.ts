import {
  OPEN_METEO_CURRENT_FIELDS,
  OPEN_METEO_DAILY_FIELDS,
  OPEN_METEO_HOURLY_FIELDS,
  OPEN_METEO_WEATHER_CODES,
  type OpenMeteoForecastRequest,
  type OpenMeteoForecastResponse,
} from './types'

export type {
  OpenMeteoForecastRequest,
  OpenMeteoForecastResponse,
} from './types'

const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

const currentFieldSet = new Set<string>(OPEN_METEO_CURRENT_FIELDS)
const hourlyFieldSet = new Set<string>(OPEN_METEO_HOURLY_FIELDS)
const dailyFieldSet = new Set<string>(OPEN_METEO_DAILY_FIELDS)
const weatherCodeSet = new Set<number>(OPEN_METEO_WEATHER_CODES)

function assertFiniteCoordinate(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`)
  }
}

function assertRange(
  value: number,
  label: string,
  minimum: number,
  maximum: number
): void {
  if (value < minimum || value > maximum) {
    throw new Error(
      `${label} must be between ${String(minimum)} and ${String(maximum)}.`
    )
  }
}

function assertForecastDays(value: number | undefined): void {
  if (value === undefined) {
    return
  }

  if (!Number.isInteger(value) || value < 1 || value > 16) {
    throw new Error('forecastDays must be an integer between 1 and 16.')
  }
}

function assertFields(
  fields: readonly string[] | undefined,
  label: string,
  allowedFields: ReadonlySet<string>
): void {
  if (fields === undefined) {
    return
  }

  if (fields.length === 0) {
    throw new Error(`${label} must include at least one field when provided.`)
  }

  for (const field of fields) {
    if (!allowedFields.has(field)) {
      throw new Error(`Unsupported ${label} field: ${field}.`)
    }
  }
}

function readStringRecord(
  value: unknown,
  label: string
): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Open-Meteo ${label} is not a valid object.`)
  }

  return value as Record<string, unknown>
}

function validateNumberField(
  payload: Record<string, unknown>,
  field: string
): void {
  if (field in payload && typeof payload[field] !== 'number') {
    throw new Error(`Open-Meteo response field "${field}" must be a number.`)
  }
}

function validateStringArrayField(
  payload: Record<string, unknown>,
  field: string
): void {
  const value = payload[field]

  if (
    value !== undefined &&
    (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string'))
  ) {
    throw new Error(
      `Open-Meteo response field "${field}" must be an array of strings.`
    )
  }
}

function validateNumberArrayField(
  payload: Record<string, unknown>,
  field: string
): void {
  const value = payload[field]

  if (
    value !== undefined &&
    (!Array.isArray(value) || value.some((entry) => typeof entry !== 'number'))
  ) {
    throw new Error(
      `Open-Meteo response field "${field}" must be an array of numbers.`
    )
  }
}

function validateWeatherCode(value: unknown, field: string): void {
  if (typeof value !== 'number' || !weatherCodeSet.has(value)) {
    throw new Error(
      `Open-Meteo response field "${field}" must be a supported WMO weather code.`
    )
  }
}

function validateWeatherCodeArray(
  payload: Record<string, unknown>,
  field: string
): void {
  const value = payload[field]

  if (
    value !== undefined &&
    (!Array.isArray(value) ||
      value.some(
        (entry) => typeof entry !== 'number' || !weatherCodeSet.has(entry)
      ))
  ) {
    throw new Error(
      `Open-Meteo response field "${field}" must be an array of supported WMO weather codes.`
    )
  }
}

function validateForecastResponse(payload: unknown): OpenMeteoForecastResponse {
  const root = readStringRecord(payload, 'response')

  for (const field of [
    'latitude',
    'longitude',
    'generationtime_ms',
    'utc_offset_seconds',
    'elevation',
  ] as const) {
    if (typeof root[field] !== 'number') {
      throw new Error(`Open-Meteo response field "${field}" must be a number.`)
    }
  }

  for (const field of ['timezone', 'timezone_abbreviation'] as const) {
    if (typeof root[field] !== 'string') {
      throw new Error(`Open-Meteo response field "${field}" must be a string.`)
    }
  }

  if (root.current !== undefined) {
    const current = readStringRecord(root.current, 'current')

    if (typeof current.time !== 'string') {
      throw new Error('Open-Meteo current.time must be a string.')
    }

    if (
      current.interval !== undefined &&
      typeof current.interval !== 'number'
    ) {
      throw new Error('Open-Meteo current.interval must be a number.')
    }

    if (
      current.is_day !== undefined &&
      current.is_day !== 0 &&
      current.is_day !== 1
    ) {
      throw new Error('Open-Meteo current.is_day must be 0 or 1.')
    }

    for (const field of OPEN_METEO_CURRENT_FIELDS) {
      if (field === 'weather_code') {
        validateWeatherCode(current.weather_code, field)
      } else if (field !== 'is_day') {
        validateNumberField(current, field)
      }
    }
  }

  if (root.hourly !== undefined) {
    const hourly = readStringRecord(root.hourly, 'hourly')

    validateStringArrayField(hourly, 'time')

    for (const field of OPEN_METEO_HOURLY_FIELDS) {
      if (field === 'weather_code') {
        validateWeatherCodeArray(hourly, field)
      } else if (field !== 'time') {
        validateNumberArrayField(hourly, field)
      }
    }
  }

  if (root.daily !== undefined) {
    const daily = readStringRecord(root.daily, 'daily')

    validateStringArrayField(daily, 'time')
    validateStringArrayField(daily, 'sunrise')
    validateStringArrayField(daily, 'sunset')

    for (const field of OPEN_METEO_DAILY_FIELDS) {
      if (field === 'weather_code') {
        validateWeatherCodeArray(daily, field)
      } else if (
        field !== 'time' &&
        field !== 'sunrise' &&
        field !== 'sunset'
      ) {
        validateNumberArrayField(daily, field)
      }
    }
  }

  return root as OpenMeteoForecastResponse
}

function appendFields(
  searchParams: URLSearchParams,
  key: 'current' | 'hourly' | 'daily',
  fields: readonly string[] | undefined
): void {
  if (fields !== undefined && fields.length > 0) {
    searchParams.set(key, fields.join(','))
  }
}

export function buildOpenMeteoForecastUrl({
  latitude,
  longitude,
  timezone = 'auto',
  current,
  hourly,
  daily,
  forecastDays,
}: OpenMeteoForecastRequest): string {
  assertFiniteCoordinate(latitude, 'latitude')
  assertFiniteCoordinate(longitude, 'longitude')
  assertRange(latitude, 'latitude', -90, 90)
  assertRange(longitude, 'longitude', -180, 180)
  assertForecastDays(forecastDays)
  assertFields(current, 'current', currentFieldSet)
  assertFields(hourly, 'hourly', hourlyFieldSet)
  assertFields(daily, 'daily', dailyFieldSet)

  const searchParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    timezone,
  })

  if (forecastDays !== undefined) {
    searchParams.set('forecast_days', forecastDays.toString())
  }

  appendFields(searchParams, 'current', current)
  appendFields(searchParams, 'hourly', hourly)
  appendFields(searchParams, 'daily', daily)

  return `${FORECAST_ENDPOINT}?${searchParams.toString()}`
}

export async function fetchOpenMeteoForecast(
  request: OpenMeteoForecastRequest
): Promise<OpenMeteoForecastResponse> {
  const response = await fetch(buildOpenMeteoForecastUrl(request), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Open-Meteo forecast request failed with status ${String(response.status)}.`
    )
  }

  return validateForecastResponse((await response.json()) as unknown)
}
