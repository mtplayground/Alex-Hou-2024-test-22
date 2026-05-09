function App() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-12">
        <div className="inline-flex items-center rounded-full bg-teal-100 px-4 py-1 text-sm font-semibold tracking-[0.2em] text-teal-800 uppercase">
          Issue 2 of 16
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Tailwind CSS is configured
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          This placeholder component is styled entirely with Tailwind utility
          classes to verify the Vite integration and base stylesheet are
          working.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
            Vite
          </span>
          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900">
            React
          </span>
          <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900">
            TypeScript
          </span>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900">
            Tailwind CSS
          </span>
        </div>
      </section>
    </main>
  )
}

export default App
