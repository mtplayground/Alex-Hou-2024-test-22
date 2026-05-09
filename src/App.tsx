import { useState } from 'react'
import { Clock, type ClockFormat } from './components/clock/Clock'
import { LocationPicker } from './components/location/LocationPicker'
import { CurrentWeather } from './components/weather/CurrentWeather'
import { Forecast } from './components/weather/Forecast'
import { appConfig } from './config/env'
import type { OpenMeteoGeocodingResult } from './features/geocoding/types'
import { useLocation } from './features/geocoding/useLocation'

type SelectedLocation = {
  label: string
  latitude: number
  longitude: number
  subtitle: string
}

const DEFAULT_LOCATION: SelectedLocation = {
  label: appConfig.defaultCity,
  latitude: 37.7749,
  longitude: -122.4194,
  subtitle: 'Preview coordinates until you choose a location.',
}

function buildResultSubtitle(result: OpenMeteoGeocodingResult): string {
  return [result.admin1, result.country].filter(Boolean).join(', ')
}

function App() {
  const [clockFormat, setClockFormat] = useState<ClockFormat>('24h')
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation>(DEFAULT_LOCATION)
  const location = useLocation()

  return (
    <>
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto w-full max-w-5xl">
          <header className="rounded-[2rem] border border-white/70 bg-white/80 px-6 py-6 shadow-2xl shadow-slate-900/10 backdrop-blur sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-violet-700 uppercase">
                  Weather dashboard
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {selectedLocation.label}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
                  {selectedLocation.subtitle}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
                onClick={() => {
                  setIsLocationPickerOpen(true)
                }}
              >
                Change location
              </button>
            </div>
          </header>

          <div className="mt-6">
            <Clock
              clockFormat={clockFormat}
              onClockFormatChange={setClockFormat}
            />
          </div>

          <div className="mt-6">
            <CurrentWeather
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
              title={`Current weather in ${selectedLocation.label}`}
            />
          </div>

          <div className="mt-6">
            <Forecast
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
              title={`5-day outlook for ${selectedLocation.label}`}
              forecastDays={5}
            />
          </div>
        </div>
      </main>

      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => {
          setIsLocationPickerOpen(false)
        }}
        onSearchCity={location.searchCity}
        onSelectResult={(result) => {
          setSelectedLocation({
            label: result.name,
            latitude: result.latitude,
            longitude: result.longitude,
            subtitle:
              buildResultSubtitle(result) ||
              'Selected from city search results.',
          })
          setIsLocationPickerOpen(false)
        }}
        onUseMyLocation={() => {
          if (location.location === null) {
            return
          }

          setSelectedLocation({
            label: 'My location',
            latitude: location.location.latitude,
            longitude: location.location.longitude,
            subtitle: `Accuracy ±${String(
              Math.round(location.location.accuracyMeters)
            )} m`,
          })
          setIsLocationPickerOpen(false)
        }}
        searchResults={location.searchResults}
        searchStatus={location.searchStatus}
        searchError={location.searchError}
        geolocationStatus={location.geolocationStatus}
        geolocationError={location.geolocationError}
        currentLocation={location.location}
        defaultSearchValue={appConfig.defaultCity}
      />
    </>
  )
}

export default App
