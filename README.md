# VITAL Site Suitability Analysis

A React + TypeScript decision-support app for evaluating and comparing retail site candidates. The app captures site facts, scores each location across standardized criteria, and generates side-by-side comparisons with weighted totals and recommendation summaries.

## Features

- Site intake form for address, economics, physical features, tenancy context, and notes.
- Per-site scoring workflow with six weighted criteria.
- Dashboard with add/edit/delete controls.
- Comparison view with print-friendly output for internal review packets.
- Local persistence through a storage abstraction layer (`src/storage.ts`) to keep backend migration isolated.

## Install / Run / Build

```bash
npm install
npm run dev
npm run build
```

## Customize Criteria and Weights

1. Open `src/types.ts`.
2. Update `defaultCriteriaConfig` to change labels, criterion ids, or weights.
3. Ensure total weights sum to `1.0` for straightforward interpretation.
4. New criteria flow through the scoring form and comparison table automatically.

## Storage Layer Swap (PostgreSQL / Supabase)

The app currently uses `localStorage` through functions in `src/storage.ts`:

- `getSites`, `saveSite`, `deleteSite`
- `getEvaluations`, `saveEvaluation`

To migrate to PostgreSQL or Supabase later:

1. Keep component/page code unchanged and replace only function internals in `src/storage.ts`.
2. Convert sync return values to async (`Promise`-based) in this module.
3. Update calling code in `src/App.tsx` (and any future data hooks) to await those functions.
4. Map each function to API endpoints or direct Supabase client calls while preserving function signatures as closely as possible.

This isolates infrastructure changes to one module instead of the entire UI.
