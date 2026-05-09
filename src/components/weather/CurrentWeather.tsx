import { useQuery } from '@tanstack/react-query'
import { SkeletonBlock } from '../ui/SkeletonBlock'
import {
  CURRENT_WEATHER_REFRESH_INTERVAL_MS,
  currentWeatherQueryOptions,
} from '../../features/weather/currentWeather'
import type { TemperatureUnit } from '../../features/settings/types'
import {
  convertTemperature,
  getTemperatureUnitLabel,
} from '../../features/weather/temperature'

type CurrentWeatherProps = {
  latitude: number
  longitude: number
  title?: string
  temperatureUnit: TemperatureUnit
}

const observedAtFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
  day: 'numeric',
})

function formatMeasurement(value: number, unit: string): string {
  return `${value.toFixed(1)} ${unit}`
}

export function CurrentWeather({
  latitude,
  longitude,
  title = 'Current weather',
  temperatureUnit,
}: CurrentWeatherProps) {
  const weatherQuery = useQuery(
    currentWeatherQueryOptions({
      latitude,
      longitude,
    })
  )

  if (weatherQuery.isPending) {
    return (
      <section
        aria-busy="true"
        aria-live="polite"
        className="w-full rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur"
      >
        <p className="text-sm font-semibold tracking-[0.2em] text-sky-700 uppercase">
          Weather
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[1.75rem] bg-slate-950 px-6 py-8 text-white">
            <SkeletonBlock className="h-4 w-24 bg-slate-700/80" />
            <SkeletonBlock className="mt-6 h-10 w-40 bg-slate-700/80" />
            <SkeletonBlock className="mt-8 h-14 w-36 bg-slate-700/80" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <SkeletonBlock className="h-28 bg-slate-200" />
            <SkeletonBlock className="h-28 bg-slate-200" />
            <SkeletonBlock className="h-28 bg-slate-200" />
          </div>
        </div>
      </section>
    )
  }

  if (weatherQuery.isError) {
    return (
      <section
        aria-live="assertive"
        className="w-full rounded-[2rem] border border-red-200 bg-red-50/90 p-8 shadow-lg shadow-red-900/5"
      >
        <p className="text-sm font-semibold tracking-[0.2em] text-red-700 uppercase">
          Weather
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-red-950">
          {title}
        </h2>
        <p className="mt-4 text-red-700">
          We couldn&apos;t load the latest current conditions. Check your
          connection and try again.
        </p>
        <button
          type="button"
          className="mt-5 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-800 transition hover:border-red-300 hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-100 focus-visible:outline-none"
          onClick={() => {
            void weatherQuery.refetch()
          }}
        >
          Retry current weather
        </button>
      </section>
    )
  }

  const weather = weatherQuery.data
  const displayTemperature = convertTemperature(
    weather.temperature,
    temperatureUnit
  )
  const displayFeelsLike = convertTemperature(
    weather.feelsLike,
    temperatureUnit
  )
  const temperatureUnitLabel = getTemperatureUnitLabel(temperatureUnit)

  return (
    <section
      aria-labelledby="current-weather-title"
      className="w-full rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-sky-700 uppercase">
            Weather
          </p>
          <h2
            id="current-weather-title"
            className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Refreshed every {CURRENT_WEATHER_REFRESH_INTERVAL_MS / 60_000}{' '}
            minutes
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Updated {observedAtFormatter.format(new Date(weather.observedAt))}
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[1.75rem] bg-slate-950 px-6 py-8 text-white shadow-lg shadow-slate-950/20">
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="text-5xl">
              {weather.weatherIcon}
            </span>
            <div>
              <p className="text-sm font-medium tracking-[0.28em] text-sky-200 uppercase">
                Condition
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {weather.weatherLabel}
              </p>
            </div>
          </div>
          <p className="mt-8 text-6xl font-semibold tracking-tight">
            {Math.round(displayTemperature)}
            <span className="ml-2 text-2xl font-medium text-slate-300">
              {temperatureUnitLabel}
            </span>
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-2xl bg-sky-50 px-5 py-4 text-sky-950">
            <dt className="text-sm font-medium text-sky-700">Feels like</dt>
            <dd className="mt-2 text-2xl font-semibold tracking-tight">
              {formatMeasurement(displayFeelsLike, temperatureUnitLabel)}
            </dd>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-emerald-950">
            <dt className="text-sm font-medium text-emerald-700">Wind speed</dt>
            <dd className="mt-2 text-2xl font-semibold tracking-tight">
              {formatMeasurement(weather.windSpeed, weather.windSpeedUnit)}
            </dd>
          </div>
          <div className="rounded-2xl bg-amber-50 px-5 py-4 text-amber-950">
            <dt className="text-sm font-medium text-amber-700">Humidity</dt>
            <dd className="mt-2 text-2xl font-semibold tracking-tight">
              {formatMeasurement(weather.humidity, weather.humidityUnit)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
