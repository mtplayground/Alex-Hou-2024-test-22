import { createContext } from 'react'
import type {
  AppSettings,
  ClockFormat,
  SavedLocation,
  TemperatureUnit,
} from './types'

export const SETTINGS_STORAGE_KEY = 'alex-hou-2024-test-22:settings'

export const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'celsius',
  clockFormat: '24h',
  lastSelectedCity: null,
}

export type SettingsContextValue = {
  settings: AppSettings
  setTemperatureUnit: (temperatureUnit: TemperatureUnit) => void
  setClockFormat: (clockFormat: ClockFormat) => void
  setLastSelectedCity: (lastSelectedCity: SavedLocation | null) => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)
