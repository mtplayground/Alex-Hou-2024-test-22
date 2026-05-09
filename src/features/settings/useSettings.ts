import { useContext } from 'react'
import { SettingsContext } from './context'
import type { SettingsContextValue } from './context'

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext)

  if (value === null) {
    throw new Error('useSettings must be used within a SettingsProvider.')
  }

  return value
}
