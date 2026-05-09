export type AppConfig = {
  defaultCity: string
  refreshIntervalMs: number
}

const DEFAULT_CONFIG: AppConfig = {
  defaultCity: 'San Francisco',
  refreshIntervalMs: 60_000,
}

function readDefaultCity(value: string | undefined): string {
  const normalizedValue = value?.trim()

  if (normalizedValue === undefined || normalizedValue.length === 0) {
    return DEFAULT_CONFIG.defaultCity
  }

  return normalizedValue
}

function readRefreshIntervalMs(value: string | undefined): number {
  if (value === undefined || value.trim().length === 0) {
    return DEFAULT_CONFIG.refreshIntervalMs
  }

  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(
      'VITE_REFRESH_INTERVAL_MS must be a positive integer representing milliseconds.'
    )
  }

  return parsedValue
}

export const appConfig: AppConfig = Object.freeze({
  defaultCity: readDefaultCity(import.meta.env.VITE_DEFAULT_CITY),
  refreshIntervalMs: readRefreshIntervalMs(
    import.meta.env.VITE_REFRESH_INTERVAL_MS
  ),
})
