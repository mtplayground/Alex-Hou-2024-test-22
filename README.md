# Alex-Hou-2024-test-22

A Vite + React + TypeScript frontend scaffolded for incremental issue-based development.

## Prerequisites

- Node.js 20+
- npm 10+

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

The Vite dev server listens on `0.0.0.0:8080`.

## Environment variables

Copy `.env.example` to `.env` and adjust values as needed.

```bash
VITE_DEFAULT_CITY=San Francisco
VITE_REFRESH_INTERVAL_MS=60000
```

## Available scripts

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run format:check
npm run preview
```

## Docker

Build the production image:

```bash
docker build -t alex-hou-2024-test-22 .
```

Run the container on `0.0.0.0:8080`:

```bash
docker run --rm -p 8080:8080 alex-hou-2024-test-22
```

Override build-time Vite env variables if needed:

```bash
docker build \
  --build-arg VITE_DEFAULT_CITY="San Francisco" \
  --build-arg VITE_REFRESH_INTERVAL_MS=60000 \
  -t alex-hou-2024-test-22 .
```

## Quality setup

- TypeScript project references with strict compiler settings
- ESLint flat config with type-aware TypeScript rules
- Prettier for code formatting
- Tailwind CSS integrated through the Vite plugin and `src/index.css`
- Typed Vite environment loader in `src/config/env.ts`
- Reusable clock UI in `src/components/clock` with a per-second `useNow()` hook
- Local 12h/24h clock format toggle via the `clockFormat` prop
- React Query provider plus typed Open-Meteo forecast client under `src/features/weather`
- WMO weather code lookup with labels and emoji icons in `src/features/weather/weatherCodes.ts`
- `CurrentWeather` UI backed by a 10-minute React Query refresh in `src/components/weather/CurrentWeather.tsx`
- `Forecast` daily outlook cards in `src/components/weather/Forecast.tsx`
- Typed Open-Meteo geocoding client and `useLocation()` hook under `src/features/geocoding`
- Header-triggered `LocationPicker` modal/drawer in `src/components/location/LocationPicker.tsx`
- `SettingsPanel` and persisted `useSettings()` context under `src/features/settings`
- Multi-stage Docker build with nginx SPA routing
