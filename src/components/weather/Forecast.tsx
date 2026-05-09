import { useQuery } from '@tanstack/react-query'
import { SkeletonBlock } from '../ui/SkeletonBlock'
import {
  FORECAST_REFRESH_INTERVAL_MS,
  forecastQueryOptions,
} from '../../features/weather/forecast'
import type { TemperatureUnit } from '../../features/settings/types'
import {
  convertTemperature,
  getTemperatureUnitLabel,
} from '../../features/weather/temperature'

type ForecastProps = {
  latitude: number
  longitude: number
  title?: string
  forecastDays?: number
  temperatureUnit: TemperatureUnit
}

export function Forecast({
  latitude,
  longitude,
  title = 'Forecast',
  forecastDays = 5,
  temperatureUnit,
}: ForecastProps) {
  const forecastQuery = useQuery(
    forecastQueryOptions({
      latitude,
      longitude,
      forecastDays,
    })
  )

  if (forecastQuery.isPending) {
    return (
      <section
        aria-busy="true"
        aria-live="polite"
        className="w-full rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur"
      >
        <p className="text-sm font-semibold tracking-[0.2em] text-indigo-700 uppercase">
          Forecast
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <div className="mt-8 -mx-2 overflow-x-auto px-2">
          <div className="flex min-w-max gap-4">
            {Array.from({ length: forecastDays }).map((_, index) => (
              <div
                key={index}
                className="w-40 flex-none rounded-[1.5rem] border border-slate-200 bg-slate-950 px-5 py-6"
              >
                <SkeletonBlock className="h-4 w-16 bg-slate-700/80" />
                <SkeletonBlock className="mt-4 h-10 w-10 bg-slate-700/80" />
                <SkeletonBlock className="mt-4 h-4 w-24 bg-slate-700/80" />
                <SkeletonBlock className="mt-6 h-8 w-20 bg-slate-700/80" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (forecastQuery.isError) {
    return (
      <section
        aria-live="assertive"
        className="w-full rounded-[2rem] border border-red-200 bg-red-50/90 p-8 shadow-lg shadow-red-900/5"
      >
        <p className="text-sm font-semibold tracking-[0.2em] text-red-700 uppercase">
          Forecast
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-red-950">
          {title}
        </h2>
        <p className="mt-4 text-red-700">
          We couldn&apos;t load the daily outlook. Try again in a moment.
        </p>
        <button
          type="button"
          className="mt-5 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-800 transition hover:border-red-300 hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-100 focus-visible:outline-none"
          onClick={() => {
            void forecastQuery.refetch()
          }}
        >
          Retry forecast
        </button>
      </section>
    )
  }

  const days = forecastQuery.data
  const temperatureUnitLabel = getTemperatureUnitLabel(temperatureUnit)

  return (
    <section
      aria-labelledby="forecast-title"
      className="w-full rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-indigo-700 uppercase">
            Forecast
          </p>
          <h2
            id="forecast-title"
            className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          >
            {title}
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Refreshed every {FORECAST_REFRESH_INTERVAL_MS / 60_000} minutes
        </p>
      </div>

      <div className="mt-8 -mx-2 overflow-x-auto px-2">
        <div className="flex min-w-max gap-4">
          {days.map((day) => (
            <article
              key={day.date}
              className="w-40 flex-none rounded-[1.5rem] border border-slate-200 bg-slate-950 px-5 py-6 text-white shadow-lg shadow-slate-950/15"
            >
              <p className="text-sm font-medium tracking-[0.22em] text-sky-200 uppercase">
                {day.label}
              </p>
              <p className="mt-4 text-4xl" aria-hidden="true">
                {day.weatherIcon}
              </p>
              <p className="mt-4 text-sm text-slate-300">{day.weatherLabel}</p>
              <div className="mt-6 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">High</p>
                  <p className="text-2xl font-semibold tracking-tight">
                    {Math.round(
                      convertTemperature(day.temperatureMax, temperatureUnit)
                    )}
                    <span className="ml-1 text-sm text-slate-300">
                      {temperatureUnitLabel}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Low</p>
                  <p className="text-xl font-semibold tracking-tight text-slate-200">
                    {Math.round(
                      convertTemperature(day.temperatureMin, temperatureUnit)
                    )}
                    <span className="ml-1 text-sm text-slate-400">
                      {temperatureUnitLabel}
                    </span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
