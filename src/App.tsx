import { useState } from 'react'
import { Clock, type ClockFormat } from './components/clock/Clock'
import { CurrentWeather } from './components/weather/CurrentWeather'
import { Forecast } from './components/weather/Forecast'
import { appConfig } from './config/env'
import { useLocation } from './features/geocoding/useLocation'

function App() {
  const [clockFormat, setClockFormat] = useState<ClockFormat>('24h')
  const location = useLocation()

  return (
    <main className="grid min-h-screen place-items-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <Clock clockFormat={clockFormat} onClockFormatChange={setClockFormat} />
        <div className="mt-6">
          <CurrentWeather
            latitude={37.7749}
            longitude={-122.4194}
            title="Current weather at 37.7749, -122.4194"
          />
        </div>
        <div className="mt-6">
          <Forecast
            latitude={37.7749}
            longitude={-122.4194}
            title="5-day outlook"
            forecastDays={5}
          />
        </div>
        <section className="mt-6 rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur">
          <p className="text-sm font-semibold tracking-[0.2em] text-violet-700 uppercase">
            Location
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Geolocation and city search
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Geolocation status: {location.geolocationStatus}
          </p>
          {location.location !== null ? (
            <p className="mt-2 text-sm text-slate-600">
              Current coordinates: {location.location.latitude.toFixed(4)},{' '}
              {location.location.longitude.toFixed(4)}
            </p>
          ) : null}
          {location.geolocationError !== null ? (
            <p className="mt-2 text-sm text-amber-700">
              {location.geolocationError}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
              onClick={() => {
                void location.searchCity(appConfig.defaultCity)
              }}
            >
              Search {appConfig.defaultCity}
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Search status: {location.searchStatus}
          </p>
          {location.searchError !== null ? (
            <p className="mt-2 text-sm text-red-700">{location.searchError}</p>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {location.searchResults.slice(0, 4).map((result) => (
              <article
                key={result.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="font-medium text-slate-900">{result.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {[result.admin1, result.country].filter(Boolean).join(', ')}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
                </p>
              </article>
            ))}
          </div>
        </section>
        <p className="mt-4 text-center text-sm text-slate-500">
          Default city from env:{' '}
          <span className="font-medium text-slate-700">
            {appConfig.defaultCity}
          </span>
        </p>
      </div>
    </main>
  )
}

export default App
