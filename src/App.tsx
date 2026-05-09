import { useState } from 'react'
import { Clock, type ClockFormat } from './components/clock/Clock'
import { CurrentWeather } from './components/weather/CurrentWeather'
import { Forecast } from './components/weather/Forecast'
import { appConfig } from './config/env'

function App() {
  const [clockFormat, setClockFormat] = useState<ClockFormat>('24h')

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
