import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Clock, type ClockFormat } from './components/clock/Clock'
import { appConfig } from './config/env'
import { getOpenMeteoWeatherCodePresentation } from './features/weather/weatherCodes'

function App() {
  const [clockFormat, setClockFormat] = useState<ClockFormat>('24h')
  const queryClient = useQueryClient()
  const weatherCodePreview = [0, 63, 95].map((code) => ({
    code,
    presentation: getOpenMeteoWeatherCodePresentation(code),
  }))

  return (
    <main className="grid min-h-screen place-items-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <Clock clockFormat={clockFormat} onClockFormatChange={setClockFormat} />
        <p className="mt-4 text-center text-sm text-slate-500">
          Default city from env:{' '}
          <span className="font-medium text-slate-700">
            {appConfig.defaultCity}
          </span>
        </p>
        <p className="mt-2 text-center text-sm text-slate-500">
          React Query client ready with{' '}
          <span className="font-medium text-slate-700">
            {queryClient.getDefaultOptions().queries?.staleTime?.toString() ??
              '0'}{' '}
            ms
          </span>{' '}
          stale time.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {weatherCodePreview.map(({ code, presentation }) => (
            <div
              key={code}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm"
            >
              <span aria-hidden="true" className="text-base">
                {presentation.icon}
              </span>
              <span className="font-medium">{presentation.label}</span>
              <span className="text-slate-400">WMO {code}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App
