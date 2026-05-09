import type { ReactNode } from 'react'

type AppShellProps = {
  locationLabel: string
  locationSubtitle: string
  headerActions: ReactNode
  leftPanel: ReactNode
  rightPanel: ReactNode
}

export function AppShell({
  locationLabel,
  locationSubtitle,
  headerActions,
  leftPanel,
  rightPanel,
}: AppShellProps) {
  return (
    <>
      <a
        href="#main-content"
        className="absolute top-4 left-4 z-[60] -translate-y-20 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-lg transition focus:translate-y-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 2xl:px-10 2xl:py-10"
      >
        <div className="mx-auto w-full max-w-[1800px]">
          <header className="rounded-[2rem] border border-white/70 bg-white/80 px-6 py-6 shadow-2xl shadow-slate-900/10 backdrop-blur sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-indigo-800 uppercase">
                  Weather dashboard
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl 2xl:text-6xl">
                  {locationLabel}
                </h1>
                <p className="mt-3 max-w-3xl text-sm text-slate-500 sm:text-base 2xl:text-lg">
                  {locationSubtitle}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">{headerActions}</div>
            </div>
          </header>

          <div className="mt-6 grid gap-6 xl:min-h-[calc(100vh-14rem)] xl:grid-cols-[minmax(22rem,30rem)_minmax(0,1fr)] 2xl:gap-8">
            <aside className="flex flex-col gap-6">{leftPanel}</aside>
            <section
              aria-label="Weather details"
              className="flex flex-col gap-6"
            >
              {rightPanel}
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
