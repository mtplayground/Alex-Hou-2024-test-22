import { QueryClient } from '@tanstack/react-query'
import { appConfig } from '../config/env'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: appConfig.refreshIntervalMs,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
