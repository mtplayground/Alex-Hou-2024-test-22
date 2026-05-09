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
import { AppShell } from './layout/AppShell'

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
      <AppShell
        locationLabel={activeLocation.label}
        locationSubtitle={activeLocation.subtitle}
        headerActions={
          <>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:ring-4 focus-visible:ring-emerald-100 focus-visible:outline-none"
              aria-label="Open settings"
              onClick={() => {
                setIsSettingsPanelOpen(true)
              }}
            >
              Settings
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 focus-visible:ring-4 focus-visible:ring-slate-300 focus-visible:outline-none"
              aria-label="Open location picker"
              onClick={() => {
                setIsLocationPickerOpen(true)
              }}
            >
              Change location
            </button>
          </>
        }
        leftPanel={
          <Clock
            clockFormat={settings.clockFormat}
            onClockFormatChange={setClockFormat}
          />
        }
        rightPanel={
          <>
            <CurrentWeather
              latitude={activeLocation.latitude}
              longitude={activeLocation.longitude}
              temperatureUnit={settings.temperatureUnit}
              title={`Current weather in ${activeLocation.label}`}
            />
            <Forecast
              latitude={activeLocation.latitude}
              longitude={activeLocation.longitude}
              temperatureUnit={settings.temperatureUnit}
              title={`5-day outlook for ${activeLocation.label}`}
              forecastDays={5}
            />
          </>
        }
      />

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
