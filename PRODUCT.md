# Product Snapshot

## What This Project Is

`Alex-Hou-2024-test-22` is a frontend-only weather dashboard built with Vite, React, and TypeScript. It presents time, weather, forecast, location selection, and user preferences in a single responsive interface.

## What It Does Today

- Shows a live local clock with `12h` and `24h` display modes.
- Fetches current conditions and a 5-day forecast from Open-Meteo.
- Lets the user pick a location by city search or browser geolocation.
- Persists user preferences in `localStorage`:
  - temperature unit (`°C` / `°F`)
  - clock format (`12h` / `24h`)
  - last selected location
- Handles loading and error states for weather and location flows.

## What It Does Not Include

- No user accounts or login flow.
- No app-owned backend or database-backed features.
- No server-side rendering; this is a client-rendered SPA.

## Architecture

- `src/layout/AppShell.tsx`
  - owns the responsive page shell and header framing
- `src/components`
  - contains focused UI pieces such as `Clock`, `CurrentWeather`, `Forecast`, `LocationPicker`, and `SettingsPanel`
- `src/features/weather`
  - contains the typed Open-Meteo forecast/current-weather client, mapping logic, and React Query integration
- `src/features/geocoding`
  - contains the typed Open-Meteo geocoding client plus geolocation/search state
- `src/features/settings`
  - contains settings context and persistence logic

## Key Decisions

- React Query is the data-fetching layer.
- Open-Meteo is the weather and geocoding provider.
- Tailwind CSS is the styling system.
- Feature logic lives under `src/features`; presentational UI lives under `src/components`.
- Production output is a static build served behind nginx.

## Conventions

- Strict TypeScript, ESLint, and Prettier are part of the contract.
- Vite-safe environment values drive client config such as default city and refresh interval.
- `main` is the current source of truth.
