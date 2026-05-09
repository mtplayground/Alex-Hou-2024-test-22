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

export const OPEN_METEO_WEATHER_CODES = [
  0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77,
  80, 81, 82, 85, 86, 95, 96, 99,
] as const

export type OpenMeteoCurrentField = (typeof OPEN_METEO_CURRENT_FIELDS)[number]
export type OpenMeteoHourlyField = (typeof OPEN_METEO_HOURLY_FIELDS)[number]
export type OpenMeteoDailyField = (typeof OPEN_METEO_DAILY_FIELDS)[number]
export type OpenMeteoWeatherCode = (typeof OPEN_METEO_WEATHER_CODES)[number]

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
  Record<Exclude<OpenMeteoCurrentField, 'is_day' | 'weather_code'>, number> & {
    weather_code: OpenMeteoWeatherCode
  }
> & {
  time: string
  interval?: number
  is_day?: 0 | 1
}

type OpenMeteoHourlyData = {
  time: string[]
} & Partial<
  Record<Exclude<OpenMeteoHourlyField, 'time' | 'weather_code'>, number[]> & {
    weather_code: OpenMeteoWeatherCode[]
  }
>

type OpenMeteoDailyData = {
  time: string[]
  sunrise?: string[]
  sunset?: string[]
} & Partial<
  Record<
    Exclude<
      OpenMeteoDailyField,
      'time' | 'sunrise' | 'sunset' | 'weather_code'
    >,
    number[]
  > & {
    weather_code: OpenMeteoWeatherCode[]
  }
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
