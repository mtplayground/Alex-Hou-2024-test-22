import {
  QueryClientProvider,
  type QueryClientProviderProps,
} from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { SettingsProvider } from '../features/settings/SettingsProvider'
import { queryClient } from '../lib/queryClient'

type AppProvidersProps = PropsWithChildren<{
  queryClientOverride?: QueryClientProviderProps['client']
}>

export function AppProviders({
  children,
  queryClientOverride,
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClientOverride ?? queryClient}>
      <SettingsProvider>{children}</SettingsProvider>
    </QueryClientProvider>
  )
}
