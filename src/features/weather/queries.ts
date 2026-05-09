import { queryOptions } from '@tanstack/react-query'
import { appConfig } from '../../config/env'
import { fetchOpenMeteoForecast } from './api'
import type { OpenMeteoForecastRequest } from './types'

export function openMeteoForecastQueryKey(request: OpenMeteoForecastRequest) {
  return ['weather', 'forecast', request] as const
}

export function openMeteoForecastQueryOptions(
  request: OpenMeteoForecastRequest
) {
  return queryOptions({
    queryKey: openMeteoForecastQueryKey(request),
    queryFn: () => fetchOpenMeteoForecast(request),
    staleTime: appConfig.refreshIntervalMs,
  })
}
