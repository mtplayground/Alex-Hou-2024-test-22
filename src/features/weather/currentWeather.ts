import { queryOptions } from '@tanstack/react-query'
import { appConfig } from '../../config/env'
import { fetchOpenMeteoForecast } from './api'
import type { OpenMeteoForecastResponse, OpenMeteoWeatherCode } from './types'
import { getOpenMeteoWeatherCodePresentation } from './weatherCodes'

export const CURRENT_WEATHER_REFRESH_INTERVAL_MS = 600_000

const CURRENT_WEATHER_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'weather_code',
  'wind_speed_10m',
] as const

export type CurrentWeatherRequest = {
  latitude: number
  longitude: number
  timezone?: string
}

export type CurrentWeatherData = {
  latitude: number
  longitude: number
  observedAt: string
  temperature: number
  temperatureUnit: string
  feelsLike: number
  feelsLikeUnit: string
  humidity: number
  humidityUnit: string
  windSpeed: number
  windSpeedUnit: string
  weatherCode: OpenMeteoWeatherCode
  weatherLabel: string
  weatherIcon: string
}

function readNumber(value: number | undefined, label: string): number {
  if (value === undefined) {
    throw new Error(`Open-Meteo current weather is missing ${label}.`)
  }

  return value
}

function mapForecastToCurrentWeather(
  response: OpenMeteoForecastResponse
): CurrentWeatherData {
  if (response.current === undefined) {
    throw new Error('Open-Meteo forecast response is missing current weather.')
  }

  const { current, current_units: currentUnits } = response
  const weatherCode = current.weather_code

  if (weatherCode === undefined) {
    throw new Error('Open-Meteo current weather is missing weather_code.')
  }

  const presentation = getOpenMeteoWeatherCodePresentation(weatherCode)

  return {
    latitude: response.latitude,
    longitude: response.longitude,
    observedAt: current.time,
    temperature: readNumber(current.temperature_2m, 'temperature_2m'),
    temperatureUnit: currentUnits?.temperature_2m ?? '°C',
    feelsLike: readNumber(current.apparent_temperature, 'apparent_temperature'),
    feelsLikeUnit: currentUnits?.apparent_temperature ?? '°C',
    humidity: readNumber(current.relative_humidity_2m, 'relative_humidity_2m'),
    humidityUnit: currentUnits?.relative_humidity_2m ?? '%',
    windSpeed: readNumber(current.wind_speed_10m, 'wind_speed_10m'),
    windSpeedUnit: currentUnits?.wind_speed_10m ?? 'km/h',
    weatherCode,
    weatherLabel: presentation.label,
    weatherIcon: presentation.icon,
  }
}

function buildDemoCurrentWeather(): CurrentWeatherData {
  return {
    latitude: 37.7749,
    longitude: -122.4194,
    observedAt: new Date().toISOString(),
    temperature: 18.9,
    temperatureUnit: '°C',
    feelsLike: 18.1,
    feelsLikeUnit: '°C',
    humidity: 72,
    humidityUnit: '%',
    windSpeed: 13.2,
    windSpeedUnit: 'km/h',
    weatherCode: 2,
    weatherLabel: 'Partly cloudy',
    weatherIcon: '⛅',
  }
}

export function currentWeatherQueryOptions(request: CurrentWeatherRequest) {
  const isDemoWeather = appConfig.weatherSource === 'demo'

  return queryOptions({
    queryKey: ['weather', 'current', request] as const,
    queryFn: async () =>
      mapForecastToCurrentWeather(
        await fetchOpenMeteoForecast({
          latitude: request.latitude,
          longitude: request.longitude,
          current: CURRENT_WEATHER_FIELDS,
          ...(request.timezone === undefined
            ? {}
            : { timezone: request.timezone }),
        })
      ),
    enabled: !isDemoWeather,
    initialData: isDemoWeather ? buildDemoCurrentWeather : undefined,
    staleTime: CURRENT_WEATHER_REFRESH_INTERVAL_MS,
    refetchInterval: CURRENT_WEATHER_REFRESH_INTERVAL_MS,
  })
}
