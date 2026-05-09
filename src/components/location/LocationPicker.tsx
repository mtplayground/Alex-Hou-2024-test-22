import { useEffect, useState } from 'react'
import type {
  BrowserLocation,
  UseLocationResult,
} from '../../features/geocoding/useLocation'
import type { OpenMeteoGeocodingResult } from '../../features/geocoding/types'

type LocationPickerProps = {
  isOpen: boolean
  onClose: () => void
  onSearchCity: UseLocationResult['searchCity']
  onSelectResult: (result: OpenMeteoGeocodingResult) => void
  onUseMyLocation: () => void
  searchResults: OpenMeteoGeocodingResult[]
  searchStatus: UseLocationResult['searchStatus']
  searchError: string | null
  geolocationStatus: UseLocationResult['geolocationStatus']
  geolocationError: string | null
  currentLocation: BrowserLocation | null
  defaultSearchValue: string
}

function buildResultSubtitle(result: OpenMeteoGeocodingResult): string {
  return [result.admin1, result.country].filter(Boolean).join(', ')
}

function getGeolocationButtonLabel(
  geolocationStatus: UseLocationResult['geolocationStatus']
): string {
  switch (geolocationStatus) {
    case 'locating':
      return 'Locating...'
    case 'ready':
      return 'Use my location'
    case 'permission-denied':
      return 'Location blocked'
    case 'unsupported':
      return 'Geolocation unavailable'
    case 'error':
      return 'Unable to locate'
    default:
      return 'Use my location'
  }
}

export function LocationPicker({
  isOpen,
  onClose,
  onSearchCity,
  onSelectResult,
  onUseMyLocation,
  searchResults,
  searchStatus,
  searchError,
  geolocationStatus,
  geolocationError,
  currentLocation,
  defaultSearchValue,
}: LocationPickerProps) {
  const [searchTerm, setSearchTerm] = useState(defaultSearchValue)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-end justify-center p-4 sm:items-center">
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Choose location"
          className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-950/25 sm:p-8"
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-violet-700 uppercase">
                Location picker
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Search or use your location
              </h2>
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault()
              void onSearchCity(searchTerm)
            }}
          >
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
              }}
              placeholder="Search for a city"
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-950 outline-none transition focus:border-violet-400 focus:bg-white"
            />
            <button
              type="submit"
              className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={currentLocation === null}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition enabled:hover:border-slate-300 enabled:hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onUseMyLocation}
            >
              {getGeolocationButtonLabel(geolocationStatus)}
            </button>
            {currentLocation !== null ? (
              <p className="text-sm text-slate-500">
                {currentLocation.latitude.toFixed(4)},{' '}
                {currentLocation.longitude.toFixed(4)}
              </p>
            ) : null}
          </div>

          {geolocationError !== null ? (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {geolocationError}
            </div>
          ) : null}

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Results</p>
              <p className="text-sm text-slate-500">Status: {searchStatus}</p>
            </div>
            {searchError !== null ? (
              <p className="mt-3 text-sm text-red-700">{searchError}</p>
            ) : null}
            <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
              {searchResults.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                  {searchStatus === 'success'
                    ? `No cities matched "${searchTerm}". Try a broader search.`
                    : 'Search for a city to see matching locations.'}
                </div>
              ) : (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-violet-300 hover:bg-white"
                    onClick={() => {
                      onSelectResult(result)
                    }}
                  >
                    <p className="font-medium text-slate-950">{result.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {buildResultSubtitle(result)}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {result.latitude.toFixed(4)},{' '}
                      {result.longitude.toFixed(4)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
