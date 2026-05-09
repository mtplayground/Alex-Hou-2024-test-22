# Product Snapshot

## What This Project Is

`Alex-Hou-2024-test-22` is a responsive weather dashboard built with Vite, React, and TypeScript. It combines a live local clock, current weather, short forecast, city search, browser geolocation, and user preferences into a single front-end app.

## What It Does Today

- Shows a live clock that updates every second and supports `12h` and `24h` display.
- Fetches current conditions and a multi-day forecast from Open-Meteo.
- Lets the user choose a location by city search or browser geolocation.
- Persists user settings in `localStorage`:
  - temperature unit (`°C` / `°F`)
  - clock format (`12h` / `24h`)
  - last selected city
- Handles loading, error, and empty states for weather and location flows.
- Includes accessibility and polish work:
  - keyboard-friendly dialogs and controls
  - ARIA labels and live regions where needed
  - skip link, favicon, page title, and meta description

## Architecture

- `src/layout`
  - `AppShell` owns the responsive two-panel page structure and header.
- `src/components`
  - UI is split into focused components: `Clock`, `CurrentWeather`, `Forecast`, `LocationPicker`, and `SettingsPanel`.
- `src/features/weather`
  - Typed Open-Meteo forecast/current-weather client, React Query helpers, weather-code mapping, and temperature formatting.
- `src/features/geocoding`
  - Typed Open-Meteo geocoding client plus `useLocation()` for geolocation and city search.
- `src/features/settings`
  - App settings context and persistence logic.

## Key Decisions

- React Query is the data-fetching layer.
- Open-Meteo is the external weather and geocoding provider.
- Tailwind CSS is the styling system.
- Environment variables are limited to Vite-safe config in `.env`.
- The production container is a static build served by nginx.

## Conventions

- Strict TypeScript, ESLint, and Prettier are part of the contract.
- Feature logic lives under `src/features`; presentational UI lives under `src/components`.
- `main` is the source of truth for the current product state.
