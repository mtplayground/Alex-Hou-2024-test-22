import { useEffect, useState } from 'react'
import { searchOpenMeteoLocations } from './api'
import type { OpenMeteoGeocodingResult } from './types'

type GeolocationStatus =
  | 'idle'
  | 'locating'
  | 'ready'
  | 'unsupported'
  | 'permission-denied'
  | 'error'
type SearchStatus = 'idle' | 'searching' | 'success' | 'error'

export type BrowserLocation = {
  latitude: number
  longitude: number
  accuracyMeters: number
}

export type UseLocationResult = {
  location: BrowserLocation | null
  geolocationStatus: GeolocationStatus
  geolocationError: string | null
  searchResults: OpenMeteoGeocodingResult[]
  searchStatus: SearchStatus
  searchError: string | null
  searchCity: (name: string) => Promise<OpenMeteoGeocodingResult[]>
}

export function useLocation(): UseLocationResult {
  const geolocationSupported =
    typeof navigator !== 'undefined' && 'geolocation' in navigator
  const [location, setLocation] = useState<BrowserLocation | null>(null)
  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationStatus>(
    geolocationSupported ? 'locating' : 'unsupported'
  )
  const [geolocationError, setGeolocationError] = useState<string | null>(
    geolocationSupported ? null : 'Browser geolocation is not available.'
  )
  const [searchResults, setSearchResults] = useState<
    OpenMeteoGeocodingResult[]
  >([])
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle')
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
    if (!geolocationSupported) {
      return
    }

    let isCancelled = false

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isCancelled) {
          return
        }

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
        })
        setGeolocationStatus('ready')
      },
      (error) => {
        if (isCancelled) {
          return
        }

        if (error.code === error.PERMISSION_DENIED) {
          setGeolocationStatus('permission-denied')
          setGeolocationError(
            'Location access was blocked. You can still search for a city manually.'
          )
          return
        }

        setGeolocationStatus('error')
        setGeolocationError(
          error.message || 'Unable to detect your current location.'
        )
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 300_000,
      }
    )

    return () => {
      isCancelled = true
    }
  }, [geolocationSupported])

  async function searchCity(name: string): Promise<OpenMeteoGeocodingResult[]> {
    const normalizedName = name.trim()

    if (normalizedName.length < 2) {
      setSearchResults([])
      setSearchStatus('idle')
      setSearchError('Enter at least 2 characters to search for a city.')
      return []
    }

    setSearchStatus('searching')
    setSearchError(null)

    try {
      const response = await searchOpenMeteoLocations({
        name: normalizedName,
      })
      const results = response.results ?? []

      setSearchResults(results)
      setSearchStatus('success')
      return results
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to search for locations.'

      setSearchResults([])
      setSearchStatus('error')
      setSearchError(message)
      return []
    }
  }

  return {
    location,
    geolocationStatus,
    geolocationError,
    searchResults,
    searchStatus,
    searchError,
    searchCity,
  }
}
