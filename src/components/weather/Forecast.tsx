import { useQuery } from '@tanstack/react-query'
import {
  FORECAST_REFRESH_INTERVAL_MS,
  forecastQueryOptions,
} from '../../features/weather/forecast'

type ForecastProps = {
  latitude: number
  longitude: number
  title?: string
  forecastDays?: number
}

export function Forecast({
  latitude,
  longitude,
  title = 'Forecast',
  forecastDays = 5,
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
      <section className="w-full rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur">
        <p className="text-sm font-semibold tracking-[0.2em] text-indigo-700 uppercase">
          Forecast
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-4 text-slate-600">Loading the upcoming forecast...</p>
      </section>
    )
  }

  if (forecastQuery.isError) {
    return (
      <section className="w-full rounded-[2rem] border border-red-200 bg-red-50/90 p-8 shadow-lg shadow-red-900/5">
        <p className="text-sm font-semibold tracking-[0.2em] text-red-700 uppercase">
          Forecast
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-red-950">
          {title}
        </h2>
        <p className="mt-4 text-red-700">
          Unable to load the daily outlook right now.
        </p>
      </section>
    )
  }

  const days = forecastQuery.data

  return (
    <section className="w-full rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-indigo-700 uppercase">
            Forecast
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
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
                    {Math.round(day.temperatureMax)}
                    <span className="ml-1 text-sm text-slate-300">
                      {day.temperatureUnit}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Low</p>
                  <p className="text-xl font-semibold tracking-tight text-slate-200">
                    {Math.round(day.temperatureMin)}
                    <span className="ml-1 text-sm text-slate-400">
                      {day.temperatureUnit}
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
