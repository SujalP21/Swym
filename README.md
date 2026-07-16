# Merchant Churn Dashboard

A production-oriented React MVP for Customer Success Managers to monitor merchant churn risk, prioritize outreach, and review explainable recommendations.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- TanStack Table
- Recharts
- Lucide React

## Features

- Mock portfolio of merchants across multiple industries
- LocalStorage-backed persistence with first-launch seed data
- Explainable weighted risk scoring
- Risk category assignment
- Recommendation engine with next-best-action selection
- Priority calculation based on risk and revenue value
- Executive KPI summary
- Searchable, filterable, sortable merchant table
- Recharts visualizations:
  - Risk Distribution
  - Revenue by Industry
  - Merchant Risk Trend
- Merchant detail page with:
  - Merchant profile
  - Risk contributors
  - Recommendation
  - Priority
  - Activity summary
  - Editable merchant status

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src
├── app              # App entry and route configuration
├── pages            # Route-level page components
├── components       # Reusable UI components grouped by domain
├── domain           # Pure TypeScript business logic
├── repository       # Persistence abstraction and LocalStorage implementation
├── store            # Zustand application state
├── types            # Shared TypeScript contracts
├── constants        # Shared app constants
├── utils            # Formatting and utility helpers
├── assets           # Static application assets
└── styles           # Global Tailwind styles
```

## Architecture Notes

- UI components consume derived dashboard state and avoid owning scoring logic.
- Domain logic is framework-agnostic TypeScript under `src/domain`.
- Persistence is accessed through a repository abstraction.
- The current repository implementation uses LocalStorage and seeds mock data on first launch.
- A future backend can replace `LocalStorageRepository` without changing the UI contract.
- The Zustand store coordinates loading, filtering, merchant updates, and derived dashboard rows.

## Data Reset

Mock data is stored in LocalStorage. Use the Settings page or the dashboard reset button to restore the seed dataset.

## Quality Checks

Before handing off changes, run:

```bash
npm run build
npm run lint
```

