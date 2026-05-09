import { useState } from 'react'
import { Clock } from './components/clock/Clock'
import { LocationPicker } from './components/location/LocationPicker'
import { SettingsPanel } from './components/settings/SettingsPanel'
import { CurrentWeather } from './components/weather/CurrentWeather'
import { Forecast } from './components/weather/Forecast'
import { appConfig } from './config/env'
import type { OpenMeteoGeocodingResult } from './features/geocoding/types'
import { useLocation } from './features/geocoding/useLocation'
import { useSettings } from './features/settings/useSettings'
import type { SavedLocation } from './features/settings/types'

const DEFAULT_LOCATION: SavedLocation = {
  label: appConfig.defaultCity,
  latitude: 37.7749,
  longitude: -122.4194,
  subtitle: 'Preview coordinates until you choose a location.',
}

function buildResultSubtitle(result: OpenMeteoGeocodingResult): string {
  return [result.admin1, result.country].filter(Boolean).join(', ')
}

function App() {
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false)
  const location = useLocation()
  const { settings, setClockFormat, setLastSelectedCity, setTemperatureUnit } =
    useSettings()
  const activeLocation = settings.lastSelectedCity ?? DEFAULT_LOCATION

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
                  {activeLocation.label}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
                  {activeLocation.subtitle}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
                  onClick={() => {
                    setIsSettingsPanelOpen(true)
                  }}
                >
                  Settings
                </button>
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
            </div>
          </header>

          <div className="mt-6">
            <Clock
              clockFormat={settings.clockFormat}
              onClockFormatChange={setClockFormat}
            />
          </div>

          <div className="mt-6">
            <CurrentWeather
              latitude={activeLocation.latitude}
              longitude={activeLocation.longitude}
              temperatureUnit={settings.temperatureUnit}
              title={`Current weather in ${activeLocation.label}`}
            />
          </div>

          <div className="mt-6">
            <Forecast
              latitude={activeLocation.latitude}
              longitude={activeLocation.longitude}
              temperatureUnit={settings.temperatureUnit}
              title={`5-day outlook for ${activeLocation.label}`}
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
          setLastSelectedCity({
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

          setLastSelectedCity({
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

      <SettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => {
          setIsSettingsPanelOpen(false)
        }}
        settings={settings}
        onTemperatureUnitChange={setTemperatureUnit}
        onClockFormatChange={setClockFormat}
      />
    </>
  )
}

export default App
