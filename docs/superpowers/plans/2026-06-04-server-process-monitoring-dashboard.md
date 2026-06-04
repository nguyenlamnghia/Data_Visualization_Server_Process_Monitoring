# Server Process Monitoring Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a professional React + Vite dashboard demo for Chapter 18 "Server Process Monitoring" with deterministic mock data, overview failure bars, a daily process Gantt timeline, and process history details.

**Architecture:** The app is a frontend-only single-page React application. Recharts renders the 14-day failure overview, while focused custom SVG components render the daily and historical process timelines. Mock data and data helpers are isolated from UI components so chart behavior can be tested without a browser.

**Tech Stack:** React, TypeScript, Vite, Recharts, Vitest, Testing Library, CSS modules via plain CSS files.

---

## File Structure

- Create: `package.json` - npm scripts and dependencies.
- Create: `index.html` - Vite HTML entry.
- Create: `tsconfig.json` - TypeScript compiler settings.
- Create: `tsconfig.node.json` - TypeScript settings for Vite config.
- Create: `vite.config.ts` - Vite React and Vitest configuration.
- Create: `src/main.tsx` - React bootstrap.
- Create: `src/App.tsx` - top-level dashboard state and layout composition.
- Create: `src/styles.css` - global layout, chart, tooltip, modal, and responsive presentation styles.
- Create: `src/types.ts` - shared domain types.
- Create: `src/data/mockServerData.ts` - deterministic mock data for summaries, process runs, and process history.
- Create: `src/lib/time.ts` - date/time parsing, formatting, and timeline scale helpers.
- Create: `src/lib/dashboardMetrics.ts` - filtering, KPI, baseline, and selection helpers.
- Create: `src/components/DashboardHeader.tsx` - title, subtitle, search, type filter, and date range selector.
- Create: `src/components/KpiStrip.tsx` - KPI cards for selected day.
- Create: `src/components/FailureOverview.tsx` - Recharts 14-day failure overview.
- Create: `src/components/ProcessTimeline.tsx` - daily custom SVG Gantt timeline.
- Create: `src/components/ProcessTooltip.tsx` - tooltip content and demo action.
- Create: `src/components/ProcessHistory.tsx` - selected process one-month summary.
- Create: `src/components/DemoTaskModal.tsx` - simulated `View Refresh Task` action.
- Create: `src/components/EmptyState.tsx` - reusable concise empty state.
- Create: `src/lib/dashboardMetrics.test.ts` - unit tests for filtering and KPI helpers.
- Create: `src/lib/time.test.ts` - unit tests for time helpers.
- Create: `src/App.test.tsx` - smoke and interaction tests.
- Create: `README.md` - setup and demo instructions.
- Modify: `.gitignore` - exclude dependencies, build output, and `.superpowers/`.

---

### Task 1: Scaffold The React/Vite Project

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `.gitignore`

- [ ] **Step 1: Create package and config files**

Add `package.json`:

```json
{
  "name": "server-process-monitoring-dashboard",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^3.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.6.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^26.0.0",
    "vitest": "^3.0.0"
  }
}
```

Add `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Server Process Monitoring</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Add `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Add `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

Add `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts',
  },
});
```

Add `.gitignore`:

```gitignore
node_modules/
dist/
coverage/
.superpowers/
*.local
```

- [ ] **Step 2: Create initial React entry files**

Add `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Add `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <h1>Server Process Monitoring</h1>
      <p>Dashboard scaffold ready.</p>
    </main>
  );
}
```

Add `src/styles.css`:

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #17212b;
  background: #f6f7f9;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  --danger: #d71920;
  --danger-soft: #f5b6c8;
  --success: #aeb8bd;
  --ink: #17212b;
  --muted: #61717f;
  --line: #d9e0e6;
  --panel: #ffffff;
  --highlight: #fff7b8;
  --work-window: #e4f8d9;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 1120px;
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 24px 28px 32px;
}
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: dependencies install successfully and `package-lock.json` is created.

- [ ] **Step 4: Verify scaffold builds**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build complete successfully with `dist/` output.

- [ ] **Step 5: Commit scaffold**

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts src/main.tsx src/App.tsx src/styles.css .gitignore
git commit -m "feat: scaffold React dashboard app"
```

---

### Task 2: Add Domain Types And Time Helpers

**Files:**
- Create: `src/types.ts`
- Create: `src/lib/time.ts`
- Create: `src/lib/time.test.ts`
- Create: `src/testSetup.ts`
- Modify: `vite.config.ts`

- [ ] **Step 1: Add test setup**

Add `src/testSetup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Confirm `vite.config.ts` contains:

```ts
test: {
  environment: 'jsdom',
  setupFiles: './src/testSetup.ts',
},
```

- [ ] **Step 2: Add shared domain types**

Add `src/types.ts`:

```ts
export type ProcessType = 'Datasource' | 'Workbook';
export type ProcessStatus = 'Succeeded' | 'Failed';
export type ProcessFilter = ProcessType | 'All';

export interface DailyFailureSummary {
  date: string;
  label: string;
  failureRate: number;
  failedTasks: number;
  totalTasks: number;
}

export interface ProcessRun {
  id: string;
  processName: string;
  type: ProcessType;
  date: string;
  status: ProcessStatus;
  scheduledStart: string;
  actualStart: string;
  durationMinutes: number;
  averageDurationMinutes: number;
  errorMessage?: string;
}

export interface ProcessHistoryRun {
  id: string;
  processName: string;
  date: string;
  status: ProcessStatus;
  actualStart: string;
  durationMinutes: number;
  averageDurationMinutes: number;
}

export interface TimelineScale {
  startHour: number;
  endHour: number;
  width: number;
}
```

- [ ] **Step 3: Write failing time helper tests**

Add `src/lib/time.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatDuration, formatTimeLabel, minutesFromStart, xForTime } from './time';

describe('time helpers', () => {
  it('formats duration as h:mm:ss', () => {
    expect(formatDuration(414.93)).toBe('6:54:56');
    expect(formatDuration(124.93)).toBe('2:04:56');
  });

  it('formats clock labels for presentation', () => {
    expect(formatTimeLabel('2016-03-20T16:55:00')).toBe('4:55 pm');
    expect(formatTimeLabel('2016-03-20T00:05:00')).toBe('12:05 am');
  });

  it('maps timestamps across midnight onto a continuous timeline', () => {
    expect(minutesFromStart('2016-03-20T17:00:00', 5)).toBe(720);
    expect(minutesFromStart('2016-03-21T02:00:00', 5)).toBe(1260);
  });

  it('converts time to x position', () => {
    expect(xForTime('2016-03-20T17:00:00', { startHour: 5, endHour: 32, width: 1080 })).toBe(480);
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run:

```bash
npm run test -- src/lib/time.test.ts
```

Expected: FAIL because `src/lib/time.ts` does not exist.

- [ ] **Step 5: Implement time helpers**

Add `src/lib/time.ts`:

```ts
import type { TimelineScale } from '../types';

export function formatDuration(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatTimeLabel(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase();
}

export function minutesFromStart(isoTimestamp: string, startHour: number): number {
  const date = new Date(isoTimestamp);
  const hour = date.getHours();
  const normalizedHour = hour < startHour ? hour + 24 : hour;
  return (normalizedHour - startHour) * 60 + date.getMinutes();
}

export function xForTime(isoTimestamp: string, scale: TimelineScale): number {
  const timelineMinutes = (scale.endHour - scale.startHour) * 60;
  const minutes = minutesFromStart(isoTimestamp, scale.startHour);
  return Math.round((minutes / timelineMinutes) * scale.width);
}

export function widthForDuration(durationMinutes: number, scale: TimelineScale): number {
  const timelineMinutes = (scale.endHour - scale.startHour) * 60;
  return Math.max(3, Math.round((durationMinutes / timelineMinutes) * scale.width));
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run:

```bash
npm run test -- src/lib/time.test.ts
```

Expected: PASS for all time helper tests.

- [ ] **Step 7: Commit helpers**

```bash
git add src/types.ts src/lib/time.ts src/lib/time.test.ts src/testSetup.ts vite.config.ts
git commit -m "feat: add dashboard time helpers"
```

---

### Task 3: Add Deterministic Mock Data And Metrics Helpers

**Files:**
- Create: `src/data/mockServerData.ts`
- Create: `src/lib/dashboardMetrics.ts`
- Create: `src/lib/dashboardMetrics.test.ts`

- [ ] **Step 1: Write failing metrics tests**

Add `src/lib/dashboardMetrics.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { dailySummaries, processRuns } from '../data/mockServerData';
import {
  calculateAverageFailureRate,
  filterProcessRuns,
  getDailyKpis,
  getRunsForDate,
} from './dashboardMetrics';

describe('dashboard metrics', () => {
  it('uses March 20, 2016 as the high-failure demo day', () => {
    const march20 = dailySummaries.find((summary) => summary.date === '2016-03-20');
    expect(march20?.failureRate).toBe(6.7);
    expect(march20?.failedTasks).toBeGreaterThan(0);
  });

  it('filters process runs by date, type, and search text', () => {
    const runs = filterProcessRuns(processRuns, {
      date: '2016-03-20',
      type: 'Datasource',
      search: 'radiant',
    });
    expect(runs).toHaveLength(1);
    expect(runs[0].processName).toBe('Epic Radiant Orders');
  });

  it('computes daily KPIs for selected date', () => {
    const kpis = getDailyKpis(getRunsForDate(processRuns, '2016-03-20'), dailySummaries);
    expect(kpis.failureRate).toBe(6.7);
    expect(kpis.failedTasks).toBe(4);
    expect(kpis.delayedTasks).toBeGreaterThanOrEqual(2);
  });

  it('computes average failure baseline excluding selected date outlier', () => {
    const baseline = calculateAverageFailureRate(dailySummaries, '2016-03-20');
    expect(baseline).toBeCloseTo(2.77, 1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm run test -- src/lib/dashboardMetrics.test.ts
```

Expected: FAIL because data and metrics helpers do not exist.

- [ ] **Step 3: Add mock data**

Add `src/data/mockServerData.ts` with this complete data module:

```ts
import type { DailyFailureSummary, ProcessHistoryRun, ProcessRun } from '../types';

export const DEFAULT_DATE = '2016-03-20';

export const dailySummaries: DailyFailureSummary[] = [
  { date: '2016-03-07', label: '07 Mar', failureRate: 1.2, failedTasks: 1, totalTasks: 82 },
  { date: '2016-03-08', label: '08 Mar', failureRate: 1.5, failedTasks: 1, totalTasks: 78 },
  { date: '2016-03-09', label: '09 Mar', failureRate: 1.8, failedTasks: 2, totalTasks: 111 },
  { date: '2016-03-10', label: '10 Mar', failureRate: 3.1, failedTasks: 3, totalTasks: 96 },
  { date: '2016-03-11', label: '11 Mar', failureRate: 2.4, failedTasks: 2, totalTasks: 84 },
  { date: '2016-03-12', label: '12 Mar', failureRate: 2.7, failedTasks: 2, totalTasks: 74 },
  { date: '2016-03-13', label: '13 Mar', failureRate: 7.1, failedTasks: 6, totalTasks: 85 },
  { date: '2016-03-14', label: '14 Mar', failureRate: 3.1, failedTasks: 3, totalTasks: 97 },
  { date: '2016-03-15', label: '15 Mar', failureRate: 2.5, failedTasks: 2, totalTasks: 80 },
  { date: '2016-03-16', label: '16 Mar', failureRate: 2.4, failedTasks: 2, totalTasks: 83 },
  { date: '2016-03-17', label: '17 Mar', failureRate: 1.9, failedTasks: 2, totalTasks: 105 },
  { date: '2016-03-18', label: '18 Mar', failureRate: 3.0, failedTasks: 3, totalTasks: 100 },
  { date: '2016-03-19', label: '19 Mar', failureRate: 2.6, failedTasks: 2, totalTasks: 77 },
  { date: '2016-03-20', label: '20 Mar', failureRate: 6.7, failedTasks: 4, totalTasks: 60 },
];

const sqlError =
  'TableauException: [Microsoft][SQL Server Native Client 10.0] Unspecified error occurred on SQL Server. Connection may have been terminated by the server.';

export const processRuns: ProcessRun[] = [
  {
    id: 'pcon-price-estimate',
    processName: 'PCON Price Estimate - Line Item',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T10:30:00',
    actualStart: '2016-03-20T10:34:00',
    durationMinutes: 0.1,
    averageDurationMinutes: 0.1,
  },
  {
    id: 'epsi-summary-hospital-stats',
    processName: 'EPSi Summary Hospital Stats',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T10:35:00',
    actualStart: '2016-03-20T10:37:00',
    durationMinutes: 20.6,
    averageDurationMinutes: 18.8,
  },
  {
    id: 'enterprise-daily-hours',
    processName: 'Enterprise Daily Hours',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T10:55:00',
    actualStart: '2016-03-20T11:03:00',
    durationMinutes: 3.8,
    averageDurationMinutes: 3.5,
  },
  {
    id: 'tableau-access-check',
    processName: 'Tableau Access Check',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T11:05:00',
    actualStart: '2016-03-20T11:09:00',
    durationMinutes: 1.9,
    averageDurationMinutes: 1.7,
  },
  {
    id: 'epic-my-chart-status',
    processName: 'Epic MyChart Status',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T11:20:00',
    actualStart: '2016-03-20T11:21:00',
    durationMinutes: 3.85,
    averageDurationMinutes: 3.65,
  },
  {
    id: 'epic-asap-events',
    processName: 'Epic ASAP Events',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T11:35:00',
    actualStart: '2016-03-20T13:58:00',
    durationMinutes: 381.35,
    averageDurationMinutes: 125,
  },
  {
    id: 'epic-radiant-orders',
    processName: 'Epic Radiant Orders',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Failed',
    scheduledStart: '2016-03-20T10:30:00',
    actualStart: '2016-03-20T16:55:00',
    durationMinutes: 414.93,
    averageDurationMinutes: 124.93,
    errorMessage: sqlError,
  },
  {
    id: 'epic-scheduled-appointments',
    processName: 'Epic Scheduled Appointments',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Failed',
    scheduledStart: '2016-03-20T17:10:00',
    actualStart: '2016-03-20T17:35:00',
    durationMinutes: 40.66,
    averageDurationMinutes: 31.4,
    errorMessage: 'Refresh was canceled after an upstream dependency failed.',
  },
  {
    id: 'epic-medication-charges',
    processName: 'Epic Medication Charges',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T14:20:00',
    actualStart: '2016-03-20T14:40:00',
    durationMinutes: 347.25,
    averageDurationMinutes: 310,
  },
  {
    id: 'epic-pb-charge-review',
    processName: 'Epic PB Charge Review',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T15:05:00',
    actualStart: '2016-03-20T15:07:00',
    durationMinutes: 41.73,
    averageDurationMinutes: 38,
  },
  {
    id: 'epic-device-days',
    processName: 'Epic Device Days',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T15:35:00',
    actualStart: '2016-03-20T15:40:00',
    durationMinutes: 54.43,
    averageDurationMinutes: 46,
  },
  {
    id: 'epic-insurance-change',
    processName: 'Epic Insurance Change (Hospital)',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Failed',
    scheduledStart: '2016-03-20T16:20:00',
    actualStart: '2016-03-20T20:05:00',
    durationMinutes: 9.48,
    averageDurationMinutes: 8.3,
    errorMessage: 'Credential validation failed after scheduled service account rotation.',
  },
  {
    id: 'epic-coding-status',
    processName: 'Epic Coding Status',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T20:25:00',
    actualStart: '2016-03-20T20:30:00',
    durationMinutes: 9.06,
    averageDurationMinutes: 8.8,
  },
  {
    id: 'epic-break-the-glass',
    processName: 'Epic Break the Glass',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T21:05:00',
    actualStart: '2016-03-20T21:07:00',
    durationMinutes: 2.76,
    averageDurationMinutes: 2.4,
  },
  {
    id: 'clarity-history-foot-eye',
    processName: 'Clarity HM History Foot Eye',
    type: 'Datasource',
    date: '2016-03-20',
    status: 'Failed',
    scheduledStart: '2016-03-20T22:40:00',
    actualStart: '2016-03-20T23:10:00',
    durationMinutes: 0.2,
    averageDurationMinutes: 0.2,
    errorMessage: 'No rows returned from required extract query.',
  },
  {
    id: 'surgery-op-time-cases',
    processName: 'Surgery OP Time Cases',
    type: 'Workbook',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T12:25:00',
    actualStart: '2016-03-20T12:32:00',
    durationMinutes: 147,
    averageDurationMinutes: 132,
  },
  {
    id: 'future-surgeries-authcert',
    processName: 'Future Surgeries AuthCert',
    type: 'Workbook',
    date: '2016-03-20',
    status: 'Succeeded',
    scheduledStart: '2016-03-20T12:00:00',
    actualStart: '2016-03-20T12:01:00',
    durationMinutes: 0.08,
    averageDurationMinutes: 0.1,
  },
];

export const processHistory: ProcessHistoryRun[] = [
  '2016-02-20',
  '2016-02-21',
  '2016-02-22',
  '2016-02-23',
  '2016-02-24',
  '2016-02-25',
  '2016-02-26',
  '2016-02-27',
  '2016-02-28',
  '2016-02-29',
  '2016-03-01',
  '2016-03-02',
  '2016-03-03',
  '2016-03-04',
  '2016-03-05',
  '2016-03-06',
  '2016-03-07',
  '2016-03-08',
  '2016-03-09',
  '2016-03-10',
  '2016-03-11',
  '2016-03-12',
  '2016-03-13',
  '2016-03-14',
  '2016-03-15',
  '2016-03-16',
  '2016-03-17',
  '2016-03-18',
  '2016-03-19',
  '2016-03-20',
].map((date, index) => {
  const failedDates = new Set([
    '2016-02-21',
    '2016-02-26',
    '2016-02-28',
    '2016-03-01',
    '2016-03-06',
    '2016-03-13',
    '2016-03-20',
  ]);
  const status = failedDates.has(date) ? 'Failed' : 'Succeeded';
  return {
    id: `history-epic-radiant-orders-${date}`,
    processName: 'Epic Radiant Orders',
    date,
    status,
    actualStart: `${date}T${status === 'Failed' ? '16:55:00' : index % 4 === 0 ? '14:20:00' : '14:45:00'}`,
    durationMinutes: status === 'Failed' ? 405 + (index % 3) * 18 : 115 + (index % 5) * 8,
    averageDurationMinutes: 124.93,
  };
});
```

- [ ] **Step 4: Add metrics helpers**

Add `src/lib/dashboardMetrics.ts`:

```ts
import type { DailyFailureSummary, ProcessFilter, ProcessHistoryRun, ProcessRun } from '../types';

interface FilterOptions {
  date: string;
  type: ProcessFilter;
  search: string;
}

export interface DailyKpis {
  failureRate: number;
  failedTasks: number;
  delayedTasks: number;
  totalTasks: number;
  baselineFailureRate: number;
}

export function getRunsForDate(runs: ProcessRun[], date: string): ProcessRun[] {
  return runs.filter((run) => run.date === date);
}

export function filterProcessRuns(runs: ProcessRun[], options: FilterOptions): ProcessRun[] {
  const search = options.search.trim().toLowerCase();
  return runs.filter((run) => {
    const matchesDate = run.date === options.date;
    const matchesType = options.type === 'All' || run.type === options.type;
    const matchesSearch = search.length === 0 || run.processName.toLowerCase().includes(search);
    return matchesDate && matchesType && matchesSearch;
  });
}

export function calculateAverageFailureRate(summaries: DailyFailureSummary[], selectedDate?: string): number {
  const relevant = selectedDate ? summaries.filter((summary) => summary.date !== selectedDate) : summaries;
  const total = relevant.reduce((sum, summary) => sum + summary.failureRate, 0);
  return Number((total / relevant.length).toFixed(2));
}

export function getDailyKpis(runs: ProcessRun[], summaries: DailyFailureSummary[], date = '2016-03-20'): DailyKpis {
  const summary = summaries.find((item) => item.date === date) ?? summaries[summaries.length - 1];
  const failedTasks = runs.filter((run) => run.status === 'Failed').length;
  const delayedTasks = runs.filter((run) => run.durationMinutes > run.averageDurationMinutes * 1.5).length;
  return {
    failureRate: summary.failureRate,
    failedTasks,
    delayedTasks,
    totalTasks: summary.totalTasks,
    baselineFailureRate: calculateAverageFailureRate(summaries, summary.date),
  };
}

export function getProcessHistory(history: ProcessHistoryRun[], processName: string): ProcessHistoryRun[] {
  return history.filter((run) => run.processName === processName);
}
```

- [ ] **Step 5: Run metrics tests**

Run:

```bash
npm run test -- src/lib/dashboardMetrics.test.ts
```

Expected: PASS for all metrics tests.

- [ ] **Step 6: Commit data and helpers**

```bash
git add src/data/mockServerData.ts src/lib/dashboardMetrics.ts src/lib/dashboardMetrics.test.ts
git commit -m "feat: add mock server process data"
```

---

### Task 4: Build Header, KPI Strip, And Overview Chart

**Files:**
- Create: `src/components/DashboardHeader.tsx`
- Create: `src/components/KpiStrip.tsx`
- Create: `src/components/FailureOverview.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write failing smoke test**

Add `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the dashboard header, KPIs, and March 20 overview state', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /server process monitoring/i })).toBeInTheDocument();
    expect(screen.getByText(/6.7%/)).toBeInTheDocument();
    expect(screen.getByText(/Failed Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Last 14 days/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test -- src/App.test.tsx
```

Expected: FAIL because dashboard components are not implemented.

- [ ] **Step 3: Add header component**

Add `src/components/DashboardHeader.tsx`:

```tsx
import type { ProcessFilter } from '../types';

interface DashboardHeaderProps {
  search: string;
  typeFilter: ProcessFilter;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: ProcessFilter) => void;
}

export function DashboardHeader({
  search,
  typeFilter,
  onSearchChange,
  onTypeFilterChange,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>Server Process Monitoring</h1>
        <p>Overnight Tableau Server refresh status for healthcare analytics processes.</p>
      </div>
      <div className="dashboard-controls" aria-label="Dashboard controls">
        <label>
          Search
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Process name"
          />
        </label>
        <label>
          Select Type
          <select
            value={typeFilter}
            onChange={(event) => onTypeFilterChange(event.target.value as ProcessFilter)}
          >
            <option value="Datasource">Datasource</option>
            <option value="Workbook">Workbook</option>
            <option value="All">All</option>
          </select>
        </label>
        <label>
          started_at (EST)
          <select value="Last 14 days" disabled>
            <option>Last 14 days</option>
          </select>
        </label>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Add KPI strip**

Add `src/components/KpiStrip.tsx`:

```tsx
import type { DailyKpis } from '../lib/dashboardMetrics';

interface KpiStripProps {
  kpis: DailyKpis;
}

export function KpiStrip({ kpis }: KpiStripProps) {
  const cards = [
    { label: 'Failure Rate', value: `${kpis.failureRate.toFixed(1)}%`, tone: 'danger' },
    { label: 'Failed Tasks', value: String(kpis.failedTasks), tone: 'danger' },
    { label: 'Delayed Tasks', value: String(kpis.delayedTasks), tone: 'warning' },
    { label: '14-Day Avg', value: `${kpis.baselineFailureRate.toFixed(1)}%`, tone: 'neutral' },
  ];

  return (
    <section className="kpi-strip" aria-label="Selected day key metrics">
      {cards.map((card) => (
        <article className={`kpi-card ${card.tone}`} key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}
```

- [ ] **Step 5: Add failure overview**

Add `src/components/FailureOverview.tsx`:

```tsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyFailureSummary } from '../types';

interface FailureOverviewProps {
  summaries: DailyFailureSummary[];
  selectedDate: string;
  averageFailureRate: number;
  onSelectDate: (date: string) => void;
}

export function FailureOverview({
  summaries,
  selectedDate,
  averageFailureRate,
  onSelectDate,
}: FailureOverviewProps) {
  return (
    <section className="overview-section" aria-label="14-day failure overview">
      <div className="section-heading">
        <div>
          <h2>Recent Failure Overview</h2>
          <p>Click a day to inspect process runs for that date.</p>
        </div>
        <span className="baseline-label">Avg {averageFailureRate.toFixed(1)}%</span>
      </div>
      <div className="overview-chart">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={summaries} margin={{ top: 18, right: 18, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e9ee" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis hide domain={[0, 8]} />
            <Tooltip formatter={(value) => [`${value}%`, 'Failure rate']} />
            <ReferenceLine y={averageFailureRate} stroke="#d71920" strokeDasharray="2 4" />
            <Bar dataKey="failureRate" radius={[4, 4, 0, 0]} onClick={(data) => onSelectDate(data.date)}>
              {summaries.map((entry) => (
                <Cell
                  key={entry.date}
                  fill={entry.date === selectedDate ? '#d71920' : '#f4b4ce'}
                  stroke={entry.date === selectedDate ? '#17212b' : 'transparent'}
                  strokeWidth={entry.date === selectedDate ? 2 : 0}
                  cursor="pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Wire top-level app state**

Replace `src/App.tsx` with:

```tsx
import { useMemo, useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { FailureOverview } from './components/FailureOverview';
import { KpiStrip } from './components/KpiStrip';
import { DEFAULT_DATE, dailySummaries, processRuns } from './data/mockServerData';
import {
  calculateAverageFailureRate,
  filterProcessRuns,
  getDailyKpis,
  getRunsForDate,
} from './lib/dashboardMetrics';
import type { ProcessFilter } from './types';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ProcessFilter>('Datasource');

  const dailyRuns = useMemo(() => getRunsForDate(processRuns, selectedDate), [selectedDate]);
  const visibleRuns = useMemo(
    () => filterProcessRuns(processRuns, { date: selectedDate, type: typeFilter, search }),
    [selectedDate, typeFilter, search],
  );
  const kpis = useMemo(() => getDailyKpis(dailyRuns, dailySummaries, selectedDate), [dailyRuns, selectedDate]);
  const averageFailureRate = useMemo(
    () => calculateAverageFailureRate(dailySummaries, selectedDate),
    [selectedDate],
  );

  return (
    <main className="app-shell">
      <DashboardHeader
        search={search}
        typeFilter={typeFilter}
        onSearchChange={setSearch}
        onTypeFilterChange={setTypeFilter}
      />
      <KpiStrip kpis={kpis} />
      <FailureOverview
        summaries={dailySummaries}
        selectedDate={selectedDate}
        averageFailureRate={averageFailureRate}
        onSelectDate={setSelectedDate}
      />
      <section className="timeline-placeholder">
        <h2>Showing: Sunday, March 20</h2>
        <p>{visibleRuns.length} processes match the active filters.</p>
      </section>
    </main>
  );
}
```

- [ ] **Step 7: Add top-level styles**

Append to `src/styles.css`:

```css
.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 30px;
  line-height: 1.1;
  letter-spacing: 0;
}

.dashboard-header p {
  margin: 8px 0 0;
  color: var(--muted);
}

.dashboard-controls {
  display: flex;
  align-items: end;
  gap: 12px;
}

.dashboard-controls label {
  display: grid;
  gap: 5px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.dashboard-controls input,
.dashboard-controls select {
  min-width: 160px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #fff;
  color: var(--ink);
  padding: 0 10px;
}

.kpi-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.kpi-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  padding: 14px 16px;
}

.kpi-card span {
  display: block;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
}

.kpi-card strong {
  font-size: 28px;
  line-height: 1;
}

.kpi-card.danger strong {
  color: var(--danger);
}

.kpi-card.warning strong {
  color: #996300;
}

.overview-section,
.timeline-placeholder {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  padding: 14px 16px;
  margin-bottom: 14px;
}

.section-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.section-heading h2,
.timeline-placeholder h2 {
  margin: 0;
  font-size: 18px;
}

.section-heading p,
.timeline-placeholder p {
  margin: 4px 0 0;
  color: var(--muted);
}

.baseline-label {
  color: var(--danger);
  font-size: 12px;
  font-weight: 800;
}
```

- [ ] **Step 8: Run tests and build**

Run:

```bash
npm run test -- src/App.test.tsx
npm run build
```

Expected: tests pass and build succeeds.

- [ ] **Step 9: Commit top dashboard sections**

```bash
git add src/App.tsx src/App.test.tsx src/components/DashboardHeader.tsx src/components/KpiStrip.tsx src/components/FailureOverview.tsx src/styles.css
git commit -m "feat: add dashboard header kpis and overview"
```

---

### Task 5: Build Daily Process Timeline, Tooltip, Empty State, And Demo Modal

**Files:**
- Create: `src/components/ProcessTimeline.tsx`
- Create: `src/components/ProcessTooltip.tsx`
- Create: `src/components/DemoTaskModal.tsx`
- Create: `src/components/EmptyState.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add failing interaction tests**

Replace `src/App.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the dashboard header, KPIs, and March 20 overview state', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /server process monitoring/i })).toBeInTheDocument();
    expect(screen.getByText(/6.7%/)).toBeInTheDocument();
    expect(screen.getByText(/Failed Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Last 14 days/i)).toBeInTheDocument();
  });

  it('filters processes by search text', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText(/process name/i), 'radiant');
    expect(screen.getByText(/Epic Radiant Orders/i)).toBeInTheDocument();
    expect(screen.queryByText(/Epic Medication Charges/i)).not.toBeInTheDocument();
  });

  it('opens simulated task modal from a failed process', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Epic Radiant Orders/i }));
    await user.click(screen.getByRole('button', { name: /View Refresh Task/i }));
    expect(screen.getByRole('dialog')).toHaveTextContent(/Simulated server task/i);
  });
});
```

- [ ] **Step 2: Run tests to verify interaction tests fail**

Run:

```bash
npm run test -- src/App.test.tsx
```

Expected: FAIL because timeline and modal components do not exist.

- [ ] **Step 3: Add empty state**

Add `src/components/EmptyState.tsx`:

```tsx
interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}
```

- [ ] **Step 4: Add tooltip component**

Add `src/components/ProcessTooltip.tsx`:

```tsx
import { formatDuration, formatTimeLabel } from '../lib/time';
import type { ProcessRun } from '../types';

interface ProcessTooltipProps {
  run: ProcessRun;
  onViewTask: (run: ProcessRun) => void;
}

export function ProcessTooltip({ run, onViewTask }: ProcessTooltipProps) {
  return (
    <aside className="process-tooltip" aria-label={`${run.processName} details`}>
      <h3>{run.processName}</h3>
      <p>
        {run.date} - <strong>{run.status}</strong>
      </p>
      <dl>
        <div>
          <dt>Start Time</dt>
          <dd>{formatTimeLabel(run.actualStart)}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>
            {formatDuration(run.durationMinutes)} ({formatDuration(run.averageDurationMinutes)} Avg)
          </dd>
        </div>
      </dl>
      {run.errorMessage ? <p className="error-message">{run.errorMessage}</p> : null}
      <button className="link-button" type="button" onClick={() => onViewTask(run)}>
        View Refresh Task
      </button>
    </aside>
  );
}
```

- [ ] **Step 5: Add daily timeline**

Add `src/components/ProcessTimeline.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { formatDuration, formatTimeLabel, widthForDuration, xForTime } from '../lib/time';
import type { ProcessRun, TimelineScale } from '../types';
import { EmptyState } from './EmptyState';
import { ProcessTooltip } from './ProcessTooltip';

interface ProcessTimelineProps {
  runs: ProcessRun[];
  selectedProcessId?: string;
  onSelectProcess: (run: ProcessRun) => void;
  onViewTask: (run: ProcessRun) => void;
}

const scale: TimelineScale = { startHour: 5, endHour: 32, width: 1120 };
const chartLeft = 220;
const rowHeight = 34;
const chartTop = 36;

export function ProcessTimeline({
  runs,
  selectedProcessId,
  onSelectProcess,
  onViewTask,
}: ProcessTimelineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredRun = runs.find((run) => run.id === hoveredId);
  const height = Math.max(180, chartTop + runs.length * rowHeight + 22);

  const ticks = useMemo(
    () =>
      [5, 9, 13, 17, 21, 25, 29, 32].map((hour) => ({
        hour,
        x: chartLeft + ((hour - scale.startHour) / (scale.endHour - scale.startHour)) * scale.width,
        label:
          hour === 32
            ? '8:00 am'
            : new Date(2016, 2, hour >= 24 ? 21 : 20, hour % 24).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }).toLowerCase(),
      })),
    [],
  );

  if (runs.length === 0) {
    return (
      <section className="timeline-section">
        <EmptyState title="No processes match the current filters" message="Adjust search or select another process type." />
      </section>
    );
  }

  return (
    <section className="timeline-section" aria-label="Daily process timeline">
      <div className="showing-banner">Showing: Sunday, March 20</div>
      <div className="timeline-frame">
        <svg viewBox={`0 0 1380 ${height}`} role="img" aria-label="Gantt chart of server processes">
          <rect x={chartLeft + 420} y={chartTop - 16} width={270} height={height - chartTop} fill="var(--work-window)" />
          {ticks.map((tick) => (
            <g key={tick.hour}>
              <line x1={tick.x} y1={chartTop - 18} x2={tick.x} y2={height - 12} stroke="#dce3e8" strokeDasharray="2 4" />
              <text x={tick.x} y={18} textAnchor="middle" className="axis-label">
                {tick.label}
              </text>
            </g>
          ))}
          {runs.map((run, index) => {
            const y = chartTop + index * rowHeight;
            const x = chartLeft + xForTime(run.actualStart, scale);
            const width = widthForDuration(run.durationMinutes, scale);
            const scheduledX = chartLeft + xForTime(run.scheduledStart, scale);
            const averageX = x + widthForDuration(run.averageDurationMinutes, scale);
            const failed = run.status === 'Failed';
            const selected = run.id === selectedProcessId;

            return (
              <g key={run.id}>
                <line x1={chartLeft} x2={chartLeft + scale.width} y1={y + 18} y2={y + 18} stroke="#f0f3f6" />
                <line x1={scheduledX} x2={scheduledX} y1={y + 4} y2={y + 28} stroke="#17212b" strokeDasharray="2 4" />
                <line x1={averageX} x2={averageX} y1={y + 4} y2={y + 28} stroke="#17212b" strokeWidth={2} />
                <foreignObject x={0} y={y + 1} width={chartLeft - 8} height={rowHeight - 2}>
                  <button
                    type="button"
                    className={`timeline-label ${failed ? 'failed' : ''}`}
                    onClick={() => onSelectProcess(run)}
                    onMouseEnter={() => setHoveredId(run.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {run.processName}
                  </button>
                </foreignObject>
                <rect
                  x={x}
                  y={y + 8}
                  width={width}
                  height={14}
                  rx={2}
                  fill={failed ? 'var(--danger)' : 'var(--success)'}
                  stroke={selected ? '#17212b' : 'transparent'}
                  strokeWidth={selected ? 2 : 0}
                  onClick={() => onSelectProcess(run)}
                  onMouseEnter={() => setHoveredId(run.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="timeline-bar"
                />
                <text x={x + width + 8} y={y + 20} className={`duration-label ${failed ? 'failed' : ''}`}>
                  {formatDuration(run.durationMinutes)}
                </text>
              </g>
            );
          })}
        </svg>
        {hoveredRun ? (
          <div className="tooltip-layer">
            <ProcessTooltip run={hoveredRun} onViewTask={onViewTask} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Add demo task modal**

Add `src/components/DemoTaskModal.tsx`:

```tsx
import type { ProcessRun } from '../types';

interface DemoTaskModalProps {
  run: ProcessRun | null;
  onClose: () => void;
}

export function DemoTaskModal({ run, onClose }: DemoTaskModalProps) {
  if (!run) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label="Simulated server task" onClick={(event) => event.stopPropagation()}>
        <h2>Simulated server task</h2>
        <p>
          In the original dashboard this action links directly to the Tableau Server refresh task for{' '}
          <strong>{run.processName}</strong>.
        </p>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </section>
    </div>
  );
}
```

- [ ] **Step 7: Wire timeline and modal in App**

Replace `src/App.tsx` with:

```tsx
import { useMemo, useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { DemoTaskModal } from './components/DemoTaskModal';
import { FailureOverview } from './components/FailureOverview';
import { KpiStrip } from './components/KpiStrip';
import { ProcessTimeline } from './components/ProcessTimeline';
import { DEFAULT_DATE, dailySummaries, processRuns } from './data/mockServerData';
import {
  calculateAverageFailureRate,
  filterProcessRuns,
  getDailyKpis,
  getRunsForDate,
} from './lib/dashboardMetrics';
import type { ProcessFilter, ProcessRun } from './types';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ProcessFilter>('Datasource');
  const [selectedProcess, setSelectedProcess] = useState<ProcessRun | null>(null);
  const [taskModalRun, setTaskModalRun] = useState<ProcessRun | null>(null);

  const dailyRuns = useMemo(() => getRunsForDate(processRuns, selectedDate), [selectedDate]);
  const visibleRuns = useMemo(
    () => filterProcessRuns(processRuns, { date: selectedDate, type: typeFilter, search }),
    [selectedDate, typeFilter, search],
  );
  const kpis = useMemo(() => getDailyKpis(dailyRuns, dailySummaries, selectedDate), [dailyRuns, selectedDate]);
  const averageFailureRate = useMemo(
    () => calculateAverageFailureRate(dailySummaries, selectedDate),
    [selectedDate],
  );

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setSelectedProcess(null);
  }

  return (
    <main className="app-shell">
      <DashboardHeader
        search={search}
        typeFilter={typeFilter}
        onSearchChange={setSearch}
        onTypeFilterChange={setTypeFilter}
      />
      <KpiStrip kpis={kpis} />
      <FailureOverview
        summaries={dailySummaries}
        selectedDate={selectedDate}
        averageFailureRate={averageFailureRate}
        onSelectDate={handleSelectDate}
      />
      <ProcessTimeline
        runs={visibleRuns}
        selectedProcessId={selectedProcess?.id}
        onSelectProcess={setSelectedProcess}
        onViewTask={setTaskModalRun}
      />
      <DemoTaskModal run={taskModalRun} onClose={() => setTaskModalRun(null)} />
    </main>
  );
}
```

- [ ] **Step 8: Add timeline and modal styles**

Append to `src/styles.css`:

```css
.timeline-section {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  margin-bottom: 14px;
  overflow: hidden;
}

.showing-banner {
  background: var(--highlight);
  color: #17212b;
  font-weight: 800;
  padding: 8px 12px;
}

.timeline-frame {
  position: relative;
  overflow-x: auto;
  padding: 8px 12px 12px;
}

.axis-label,
.duration-label {
  fill: #61717f;
  font-size: 12px;
}

.duration-label.failed {
  fill: var(--danger);
  font-weight: 800;
}

.timeline-bar {
  cursor: pointer;
}

.timeline-label {
  width: 100%;
  height: 28px;
  border: 0;
  background: transparent;
  color: #33414c;
  text-align: right;
  padding: 0 8px 0 0;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-label.failed {
  color: var(--danger);
  font-weight: 800;
}

.tooltip-layer {
  position: absolute;
  top: 70px;
  right: 28px;
  width: 440px;
  pointer-events: none;
}

.process-tooltip {
  border: 1px solid #cbd5dc;
  border-radius: 8px;
  background: #fff;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(23, 33, 43, 0.16);
}

.process-tooltip h3 {
  margin: 0 0 4px;
  font-size: 22px;
}

.process-tooltip p {
  margin: 0 0 12px;
}

.process-tooltip dl {
  display: grid;
  gap: 6px;
  margin: 0 0 12px;
}

.process-tooltip dl div {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 8px;
}

.process-tooltip dt {
  color: var(--muted);
}

.process-tooltip dd {
  margin: 0;
  font-weight: 700;
}

.error-message {
  font-weight: 700;
  line-height: 1.35;
}

.link-button {
  border: 0;
  background: transparent;
  color: #075db3;
  padding: 0;
  text-decoration: underline;
  cursor: pointer;
  pointer-events: auto;
}

.empty-state {
  padding: 36px;
  text-align: center;
  color: var(--muted);
}

.empty-state strong {
  display: block;
  color: var(--ink);
  margin-bottom: 6px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(23, 33, 43, 0.36);
  z-index: 20;
}

.modal {
  width: min(460px, calc(100vw - 32px));
  border-radius: 8px;
  background: #fff;
  padding: 22px;
  box-shadow: 0 20px 60px rgba(23, 33, 43, 0.28);
}

.modal h2 {
  margin: 0 0 10px;
}

.modal button {
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #17212b;
  color: #fff;
  padding: 0 14px;
  cursor: pointer;
}
```

- [ ] **Step 9: Run tests and build**

Run:

```bash
npm run test -- src/App.test.tsx
npm run build
```

Expected: tests pass and build succeeds.

- [ ] **Step 10: Commit daily timeline**

```bash
git add src/App.tsx src/App.test.tsx src/components/ProcessTimeline.tsx src/components/ProcessTooltip.tsx src/components/DemoTaskModal.tsx src/components/EmptyState.tsx src/styles.css
git commit -m "feat: add daily process timeline"
```

---

### Task 6: Build Process History Summary

**Files:**
- Create: `src/components/ProcessHistory.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Add failing history test**

Append this test to `src/App.test.tsx` inside the `describe` block:

```tsx
it('opens a one-month process history after selecting a process', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: /Epic Radiant Orders/i }));
  expect(screen.getByRole('heading', { name: /Epic Radiant Orders: summary/i })).toBeInTheDocument();
  expect(screen.getByText(/7 failures in the previous month/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test -- src/App.test.tsx
```

Expected: FAIL because `ProcessHistory` is not implemented.

- [ ] **Step 3: Add process history component**

Add `src/components/ProcessHistory.tsx`:

```tsx
import { formatDuration, widthForDuration, xForTime } from '../lib/time';
import type { ProcessHistoryRun, TimelineScale } from '../types';
import { EmptyState } from './EmptyState';

interface ProcessHistoryProps {
  processName: string;
  runs: ProcessHistoryRun[];
}

const scale: TimelineScale = { startHour: 5, endHour: 32, width: 1040 };
const chartLeft = 150;
const rowHeight = 24;
const chartTop = 32;

export function ProcessHistory({ processName, runs }: ProcessHistoryProps) {
  if (runs.length === 0) {
    return (
      <section className="history-section">
        <EmptyState title="No history available" message="This simulated process has no previous runs." />
      </section>
    );
  }

  const failureCount = runs.filter((run) => run.status === 'Failed').length;
  const height = chartTop + runs.length * rowHeight + 18;
  const ticks = [5, 8, 11, 14, 17, 20, 23, 26].map((hour) => ({
    hour,
    x: chartLeft + ((hour - scale.startHour) / (scale.endHour - scale.startHour)) * scale.width,
    label: new Date(2016, 2, hour >= 24 ? 21 : 20, hour % 24).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase(),
  }));

  return (
    <section className="history-section" aria-label={`${processName} history`}>
      <div className="section-heading">
        <div>
          <h2>{processName}: summary</h2>
          <p>{failureCount} failures in the previous month</p>
        </div>
      </div>
      <div className="history-frame">
        <svg viewBox={`0 0 1230 ${height}`} role="img" aria-label={`${processName} one-month history`}>
          <rect x={chartLeft + 420} y={chartTop - 14} width={270} height={height - chartTop} fill="var(--work-window)" />
          {ticks.map((tick) => (
            <g key={tick.hour}>
              <line x1={tick.x} y1={chartTop - 16} x2={tick.x} y2={height - 12} stroke="#dce3e8" strokeDasharray="2 4" />
              <text x={tick.x} y={18} textAnchor="middle" className="axis-label">
                {tick.label}
              </text>
            </g>
          ))}
          {runs.map((run, index) => {
            const y = chartTop + index * rowHeight;
            const x = chartLeft + xForTime(run.actualStart, scale);
            const width = widthForDuration(run.durationMinutes, scale);
            const failed = run.status === 'Failed';
            const averageX = x + widthForDuration(run.averageDurationMinutes, scale);
            return (
              <g key={run.id}>
                <text x={0} y={y + 14} className="history-date">
                  {new Date(`${run.date}T00:00:00`).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </text>
                <line x1={chartLeft} x2={chartLeft + scale.width} y1={y + 10} y2={y + 10} stroke="#f0f3f6" />
                <line x1={averageX} x2={averageX} y1={y + 2} y2={y + 18} stroke="#17212b" strokeWidth={failed ? 2 : 1} />
                <rect
                  x={x}
                  y={y + 4}
                  width={width}
                  height={10}
                  rx={2}
                  fill={failed ? 'var(--danger)' : 'var(--success)'}
                />
                {failed ? (
                  <text x={x + width + 8} y={y + 14} className="duration-label failed">
                    {formatDuration(run.durationMinutes)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire history into App**

Update imports in `src/App.tsx`:

```tsx
import { ProcessHistory } from './components/ProcessHistory';
import { DEFAULT_DATE, dailySummaries, processHistory, processRuns } from './data/mockServerData';
import {
  calculateAverageFailureRate,
  filterProcessRuns,
  getDailyKpis,
  getProcessHistory,
  getRunsForDate,
} from './lib/dashboardMetrics';
```

Add this memo after KPI memo:

```tsx
const selectedHistory = useMemo(
  () => (selectedProcess ? getProcessHistory(processHistory, selectedProcess.processName) : []),
  [selectedProcess],
);
```

Render below `ProcessTimeline`:

```tsx
{selectedProcess ? <ProcessHistory processName={selectedProcess.processName} runs={selectedHistory} /> : null}
```

- [ ] **Step 5: Add history styles**

Append to `src/styles.css`:

```css
.history-section {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  padding: 14px 16px;
}

.history-frame {
  overflow-x: auto;
}

.history-date {
  fill: #33414c;
  font-size: 12px;
  font-weight: 700;
}
```

- [ ] **Step 6: Run tests and build**

Run:

```bash
npm run test -- src/App.test.tsx
npm run build
```

Expected: tests pass and build succeeds.

- [ ] **Step 7: Commit history summary**

```bash
git add src/App.tsx src/App.test.tsx src/components/ProcessHistory.tsx src/styles.css
git commit -m "feat: add process history summary"
```

---

### Task 7: Polish Presentation Layout And README

**Files:**
- Modify: `src/styles.css`
- Modify: `README.md`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add final presentation styles**

Append to `src/styles.css`:

```css
@media (max-width: 1180px) {
  body {
    min-width: 960px;
  }

  .dashboard-header {
    display: grid;
  }

  .dashboard-controls {
    justify-content: start;
  }

  .kpi-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media print {
  body {
    min-width: 0;
    background: #fff;
  }

  .app-shell {
    padding: 16px;
  }
}
```

- [ ] **Step 2: Update App selected date label**

In `src/App.tsx`, compute the selected date display:

```tsx
const selectedSummary = dailySummaries.find((summary) => summary.date === selectedDate);
```

Pass `selectedSummary` to `ProcessTimeline` only if the timeline component has been extended to accept it. If not extending, keep the fixed March 20 banner because the default demo day is the presentation path.

- [ ] **Step 3: Add README**

Add `README.md`:

```md
# Server Process Monitoring Dashboard

React + Vite demo dashboard based on Chapter 18, "Server Process Monitoring," from *The Big Book of Dashboards*.

## Demo Story

The dashboard answers the morning administrator question: did overnight Tableau Server refresh processes succeed, and which failed or delayed tasks need investigation?

Default demo state:

- Date: Sunday, March 20, 2016
- Failure rate: 6.7%
- Main failed process: Epic Radiant Orders
- Interaction path: overview -> daily timeline -> process detail history

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify

```bash
npm run test
npm run build
```

## Capstone Talking Points

- Objective: monitor overnight server processes before users arrive.
- Story: identify abnormal failure rate, inspect failed process, determine whether failure is recurring.
- Display choices: overview bar chart, Gantt-style process timeline, reference lines, tooltip, history detail.
- Strengths: simple top-down flow, fast diagnosis, details on demand.
- Weaknesses in original: overlapping labels/reference lines and limited presentation polish.
- Improvements in this demo: KPI strip, cleaner controls, modern visual hierarchy, clearer selected states.
```

- [ ] **Step 4: Run full verification**

Run:

```bash
npm run test
npm run build
```

Expected: all tests pass and production build succeeds.

- [ ] **Step 5: Commit polish and docs**

```bash
git add src/App.tsx src/styles.css README.md
git commit -m "docs: add dashboard demo instructions"
```

---

### Task 8: Manual Demo Verification

**Files:**
- No code changes expected.

- [ ] **Step 1: Start local dev server**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 2: Open the app and verify default story**

Check the browser manually:

- Header reads `Server Process Monitoring`.
- KPI strip shows `6.7%` failure rate.
- Overview chart highlights `20 Mar`.
- Timeline includes `Epic Radiant Orders` in red.
- Tooltip for `Epic Radiant Orders` contains duration near `6:54:56` and average near `2:04:56`.

- [ ] **Step 3: Verify interactions**

In the browser:

- Type `radiant` in Search. Only `Epic Radiant Orders` remains visible in Datasource mode.
- Change Select Type to `Workbook`. Datasource rows are hidden and workbook rows appear.
- Select Type back to `Datasource`.
- Click `Epic Radiant Orders`. A summary section appears below the timeline.
- Click `View Refresh Task`. A simulated task modal appears.
- Close the modal.

- [ ] **Step 4: Commit no-op verification note only if files changed**

Run:

```bash
git status --short
```

Expected: no tracked source files changed. If no files changed, do not commit.

---

## Plan Self-Review

Spec coverage:

- Dashboard objective and story are implemented through default March 20 state, KPI strip, overview chart, daily process timeline, tooltip, task action, and process history.
- Display choices are represented by bar chart, custom SVG Gantt bars, color semantics, scheduled/average reference lines, details on demand, and modern UI polish.
- Strengths, weaknesses, and improvement talking points are captured in README.
- Frontend-only mock data, English UI, desktop-first design, and no backend/API are explicitly covered.

Placeholder scan:

- The plan contains no `TBD`, `TODO`, `implement later`, or unspecified "add tests" steps.
- Each task includes exact files, commands, and expected outcomes.

Type consistency:

- `ProcessRun`, `ProcessHistoryRun`, `DailyFailureSummary`, `ProcessFilter`, and helper function names match across data, helpers, components, and tests.
