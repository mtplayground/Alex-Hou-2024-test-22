export const OPEN_METEO_CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'is_day',
] as const

export const OPEN_METEO_HOURLY_FIELDS = [
  'time',
  'temperature_2m',
  'apparent_temperature',
  'precipitation_probability',
  'weather_code',
  'wind_speed_10m',
] as const

export const OPEN_METEO_DAILY_FIELDS = [
  'time',
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'sunrise',
  'sunset',
] as const

export type OpenMeteoCurrentField = (typeof OPEN_METEO_CURRENT_FIELDS)[number]
export type OpenMeteoHourlyField = (typeof OPEN_METEO_HOURLY_FIELDS)[number]
export type OpenMeteoDailyField = (typeof OPEN_METEO_DAILY_FIELDS)[number]

export type OpenMeteoForecastRequest = {
  latitude: number
  longitude: number
  timezone?: string
  current?: readonly OpenMeteoCurrentField[]
  hourly?: readonly OpenMeteoHourlyField[]
  daily?: readonly OpenMeteoDailyField[]
  forecastDays?: number
}

type OpenMeteoCurrentUnits = Partial<Record<OpenMeteoCurrentField, string>> & {
  time?: string
  interval?: string
}

type OpenMeteoHourlyUnits = Partial<Record<OpenMeteoHourlyField, string>>
type OpenMeteoDailyUnits = Partial<Record<OpenMeteoDailyField, string>>

type OpenMeteoCurrentData = Partial<
  Record<Exclude<OpenMeteoCurrentField, 'is_day'>, number>
> & {
  time: string
  interval?: number
  is_day?: 0 | 1
}

type OpenMeteoHourlyData = {
  time: string[]
} & Partial<Record<Exclude<OpenMeteoHourlyField, 'time'>, number[]>>

type OpenMeteoDailyData = {
  time: string[]
  sunrise?: string[]
  sunset?: string[]
} & Partial<
  Record<Exclude<OpenMeteoDailyField, 'time' | 'sunrise' | 'sunset'>, number[]>
>

export type OpenMeteoForecastResponse = {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units?: OpenMeteoCurrentUnits
  current?: OpenMeteoCurrentData
  hourly_units?: OpenMeteoHourlyUnits
  hourly?: OpenMeteoHourlyData
  daily_units?: OpenMeteoDailyUnits
  daily?: OpenMeteoDailyData
}
