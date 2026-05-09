export type ClockFormat = '12h' | '24h'
export type TemperatureUnit = 'celsius' | 'fahrenheit'

export type SavedLocation = {
  label: string
  latitude: number
  longitude: number
  subtitle: string
}

export type AppSettings = {
  temperatureUnit: TemperatureUnit
  clockFormat: ClockFormat
  lastSelectedCity: SavedLocation | null
}
