import { appConfig } from './config/env'

function App() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-12">
        <div className="inline-flex items-center rounded-full bg-teal-100 px-4 py-1 text-sm font-semibold tracking-[0.2em] text-teal-800 uppercase">
          Issue 3 of 16
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Environment config is typed and loaded
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          The app now reads Vite environment variables through a typed config
          loader with validation and documented defaults.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
            <dt className="text-sm font-medium text-slate-300">Default city</dt>
            <dd className="mt-2 text-2xl font-semibold tracking-tight">
              {appConfig.defaultCity}
            </dd>
          </div>
          <div className="rounded-2xl bg-emerald-100 px-5 py-4 text-emerald-950">
            <dt className="text-sm font-medium text-emerald-700">
              Refresh interval
            </dt>
            <dd className="mt-2 text-2xl font-semibold tracking-tight">
              {appConfig.refreshIntervalMs.toLocaleString()} ms
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900">
            VITE_DEFAULT_CITY
          </span>
          <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900">
            VITE_REFRESH_INTERVAL_MS
          </span>
        </div>
      </section>
    </main>
  )
}

export default App
