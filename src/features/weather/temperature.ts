import type { TemperatureUnit } from '../settings/types'

export function convertTemperature(
  valueInCelsius: number,
  temperatureUnit: TemperatureUnit
): number {
  if (temperatureUnit === 'fahrenheit') {
    return valueInCelsius * 1.8 + 32
  }

  return valueInCelsius
}

export function getTemperatureUnitLabel(
  temperatureUnit: TemperatureUnit
): string {
  return temperatureUnit === 'fahrenheit' ? '°F' : '°C'
}
