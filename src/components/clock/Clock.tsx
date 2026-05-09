import { useNow } from './useNow'
import type { ClockFormat } from '../../features/settings/types'

const timeFormatters: Record<ClockFormat, Intl.DateTimeFormat> = {
  '12h': new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }),
  '24h': new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }),
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

type ClockProps = {
  clockFormat: ClockFormat
  onClockFormatChange: (clockFormat: ClockFormat) => void
}

export function Clock({ clockFormat, onClockFormatChange }: ClockProps) {
  const now = useNow()

  return (
    <section className="w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold tracking-[0.2em] text-amber-900 uppercase">
            Issue 6 of 16
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Local time, updated every second
          </h1>
        </div>
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1 shadow-inner shadow-slate-200/50">
          {(['12h', '24h'] as const).map((format) => {
            const isActive = clockFormat === format

            return (
              <button
                key={format}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                aria-pressed={isActive}
                onClick={() => {
                  onClockFormatChange(format)
                }}
              >
                {format.toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
        The clock uses a dedicated <code>useNow()</code> hook backed by a
        one-second interval and switches between 12-hour and 24-hour display
        formats.
      </p>

      <div className="mt-10 rounded-[1.75rem] bg-slate-950 px-6 py-8 text-white shadow-lg shadow-slate-950/20 sm:px-8 sm:py-10">
        <p className="text-sm font-medium tracking-[0.28em] text-sky-200 uppercase">
          Current time
        </p>
        <time
          className="mt-4 block text-5xl font-semibold tracking-tight sm:text-7xl"
          dateTime={now.toISOString()}
        >
          {timeFormatters[clockFormat].format(now)}
        </time>
        <time
          className="mt-4 block text-base text-slate-300 sm:text-lg"
          dateTime={now.toISOString()}
        >
          {dateFormatter.format(now)}
        </time>
      </div>
    </section>
  )
}
