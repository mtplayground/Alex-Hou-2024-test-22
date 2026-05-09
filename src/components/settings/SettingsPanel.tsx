import { useEffect, useId } from 'react'
import type { AppSettings } from '../../features/settings/types'

type SettingsPanelProps = {
  isOpen: boolean
  onClose: () => void
  settings: AppSettings
  onTemperatureUnitChange: (
    temperatureUnit: AppSettings['temperatureUnit']
  ) => void
  onClockFormatChange: (clockFormat: AppSettings['clockFormat']) => void
}

function formatSavedCity(settings: AppSettings): string {
  return settings.lastSelectedCity?.label ?? 'No saved city yet'
}

export function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onTemperatureUnitChange,
  onClockFormatChange,
}: SettingsPanelProps) {
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-end justify-center p-4 sm:items-center">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-950/25 sm:p-8"
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-emerald-700 uppercase">
                Settings
              </p>
              <h2
                id={titleId}
                className="mt-3 text-3xl font-semibold tracking-tight text-slate-950"
              >
                Preferences
              </h2>
              <p id={descriptionId} className="mt-3 text-sm text-slate-600">
                Choose how time and temperature are displayed across the app.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              aria-label="Close settings"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="mt-8 space-y-6">
            <section>
              <p className="text-sm font-medium text-slate-700">
                Temperature unit
              </p>
              <div className="mt-3 inline-flex rounded-full border border-slate-200 bg-slate-100 p-1 shadow-inner shadow-slate-200/50">
                {(['celsius', 'fahrenheit'] as const).map((unit) => {
                  const isActive = settings.temperatureUnit === unit

                  return (
                    <button
                      key={unit}
                      type="button"
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-slate-950 text-white shadow-sm'
                          : 'text-slate-700 hover:text-slate-950'
                      }`}
                      aria-pressed={isActive}
                      aria-label={`Display temperature in ${
                        unit === 'celsius' ? 'Celsius' : 'Fahrenheit'
                      }`}
                      onClick={() => {
                        onTemperatureUnitChange(unit)
                      }}
                    >
                      {unit === 'celsius' ? '°C' : '°F'}
                    </button>
                  )
                })}
              </div>
            </section>

            <section>
              <p className="text-sm font-medium text-slate-700">Clock format</p>
              <div className="mt-3 inline-flex rounded-full border border-slate-200 bg-slate-100 p-1 shadow-inner shadow-slate-200/50">
                {(['12h', '24h'] as const).map((format) => {
                  const isActive = settings.clockFormat === format

                  return (
                    <button
                      key={format}
                      type="button"
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-slate-950 text-white shadow-sm'
                          : 'text-slate-700 hover:text-slate-950'
                      }`}
                      aria-pressed={isActive}
                      aria-label={`Display time in ${format.toUpperCase()} format`}
                      onClick={() => {
                        onClockFormatChange(format)
                      }}
                    >
                      {format.toUpperCase()}
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-sm font-medium text-slate-700">
                Last selected city
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                {formatSavedCity(settings)}
              </p>
              {settings.lastSelectedCity !== null ? (
                <p className="mt-2 text-sm text-slate-500">
                  {settings.lastSelectedCity.subtitle}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Choose a city from the location picker to save it here.
                </p>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  )
}
