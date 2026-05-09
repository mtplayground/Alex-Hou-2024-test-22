import { useEffect, useState, type PropsWithChildren } from 'react'
import {
  DEFAULT_SETTINGS,
  SettingsContext,
  SETTINGS_STORAGE_KEY,
} from './context'
import type { AppSettings } from './types'

function readStoredSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS
  }

  const rawValue = window.localStorage.getItem(SETTINGS_STORAGE_KEY)

  if (rawValue === null) {
    return DEFAULT_SETTINGS
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<AppSettings>

    return {
      temperatureUnit:
        parsedValue.temperatureUnit === 'fahrenheit'
          ? 'fahrenheit'
          : DEFAULT_SETTINGS.temperatureUnit,
      clockFormat:
        parsedValue.clockFormat === '12h'
          ? '12h'
          : DEFAULT_SETTINGS.clockFormat,
      lastSelectedCity:
        parsedValue.lastSelectedCity !== null &&
        parsedValue.lastSelectedCity !== undefined &&
        typeof parsedValue.lastSelectedCity === 'object' &&
        typeof parsedValue.lastSelectedCity.label === 'string' &&
        typeof parsedValue.lastSelectedCity.latitude === 'number' &&
        typeof parsedValue.lastSelectedCity.longitude === 'number' &&
        typeof parsedValue.lastSelectedCity.subtitle === 'string'
          ? {
              label: parsedValue.lastSelectedCity.label,
              latitude: parsedValue.lastSelectedCity.latitude,
              longitude: parsedValue.lastSelectedCity.longitude,
              subtitle: parsedValue.lastSelectedCity.subtitle,
            }
          : DEFAULT_SETTINGS.lastSelectedCity,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AppSettings>(readStoredSettings)

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTemperatureUnit: (temperatureUnit) => {
          setSettings((currentSettings) => ({
            ...currentSettings,
            temperatureUnit,
          }))
        },
        setClockFormat: (clockFormat) => {
          setSettings((currentSettings) => ({
            ...currentSettings,
            clockFormat,
          }))
        },
        setLastSelectedCity: (lastSelectedCity) => {
          setSettings((currentSettings) => ({
            ...currentSettings,
            lastSelectedCity,
          }))
        },
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
