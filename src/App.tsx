import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Clock, type ClockFormat } from './components/clock/Clock'
import { appConfig } from './config/env'

function App() {
  const [clockFormat, setClockFormat] = useState<ClockFormat>('24h')
  const queryClient = useQueryClient()

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
      </div>
    </main>
  )
}

export default App
