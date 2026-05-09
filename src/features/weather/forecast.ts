import { queryOptions } from '@tanstack/react-query'
import { fetchOpenMeteoForecast } from './api'
import type { OpenMeteoForecastResponse, OpenMeteoWeatherCode } from './types'
import { getOpenMeteoWeatherCodePresentation } from './weatherCodes'

export const FORECAST_REFRESH_INTERVAL_MS = 600_000

const DAILY_FORECAST_FIELDS = [
  'time',
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
] as const

export type ForecastRequest = {
  latitude: number
  longitude: number
  timezone?: string
  forecastDays?: number
}

export type ForecastDay = {
  date: string
  label: string
  weatherCode: OpenMeteoWeatherCode
  weatherLabel: string
  weatherIcon: string
  temperatureMax: number
  temperatureMin: number
  temperatureUnit: string
}

function readNumberArray(value: number[] | undefined, label: string): number[] {
  if (value === undefined) {
    throw new Error(`Open-Meteo daily forecast is missing ${label}.`)
  }

  return value
}

function readWeatherCodeArray(
  value: OpenMeteoWeatherCode[] | undefined
): OpenMeteoWeatherCode[] {
  if (value === undefined) {
    throw new Error('Open-Meteo daily forecast is missing weather_code.')
  }

  return value
}

const weekdayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
})

function mapForecastToDays(response: OpenMeteoForecastResponse): ForecastDay[] {
  if (response.daily === undefined) {
    throw new Error('Open-Meteo forecast response is missing daily forecast.')
  }

  const dates = response.daily.time
  const weatherCodes = readWeatherCodeArray(response.daily.weather_code)
  const temperaturesMax = readNumberArray(
    response.daily.temperature_2m_max,
    'temperature_2m_max'
  )
  const temperaturesMin = readNumberArray(
    response.daily.temperature_2m_min,
    'temperature_2m_min'
  )
  const dayCount = Math.min(
    dates.length,
    weatherCodes.length,
    temperaturesMax.length,
    temperaturesMin.length
  )
  const temperatureUnit = response.daily_units?.temperature_2m_max ?? '°C'

  const forecastDays: ForecastDay[] = []

  for (let index = 0; index < dayCount; index += 1) {
    const date = dates[index]
    const weatherCode = weatherCodes[index]
    const temperatureMax = temperaturesMax[index]
    const temperatureMin = temperaturesMin[index]

    if (
      date === undefined ||
      weatherCode === undefined ||
      temperatureMax === undefined ||
      temperatureMin === undefined
    ) {
      continue
    }

    const presentation = getOpenMeteoWeatherCodePresentation(weatherCode)

    forecastDays.push({
      date,
      label: weekdayFormatter.format(new Date(date)),
      weatherCode,
      weatherLabel: presentation.label,
      weatherIcon: presentation.icon,
      temperatureMax,
      temperatureMin,
      temperatureUnit,
    })
  }

  return forecastDays
}

export function forecastQueryOptions({
  latitude,
  longitude,
  timezone,
  forecastDays = 5,
}: ForecastRequest) {
  return queryOptions({
    queryKey: [
      'weather',
      'forecast',
      'daily',
      { latitude, longitude, forecastDays, timezone },
    ] as const,
    queryFn: async () =>
      mapForecastToDays(
        await fetchOpenMeteoForecast({
          latitude,
          longitude,
          daily: DAILY_FORECAST_FIELDS,
          forecastDays,
          ...(timezone === undefined ? {} : { timezone }),
        })
      ),
    staleTime: FORECAST_REFRESH_INTERVAL_MS,
    refetchInterval: FORECAST_REFRESH_INTERVAL_MS,
  })
}
