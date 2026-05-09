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

## Quality setup

- TypeScript project references with strict compiler settings
- ESLint flat config with type-aware TypeScript rules
- Prettier for code formatting
- Tailwind CSS integrated through the Vite plugin and `src/index.css`
- Typed Vite environment loader in `src/config/env.ts`
