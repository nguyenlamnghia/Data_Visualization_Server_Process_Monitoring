# Complete Demo Dataset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete deterministic 14-day demo dataset where every overview day has 18-24 process rows, summary KPIs match visible task counts, and key demo processes have useful history.

**Architecture:** Keep the existing frontend-only data flow and public exports from `src/data/mockServerData.ts`. Replace the current thin mock arrays with deterministic module-local templates that produce plain exported arrays for summaries, daily runs, and process history. Update tests and README story numbers to match the internally consistent March 20 rate of `9.1%`.

**Tech Stack:** React 19, Vite, TypeScript, Vitest, Testing Library.

---

## File Structure

- Modify `src/data/mockServerData.ts`: owns the mock data exports. Add private catalog/spec/helper functions, export plain `dailySummaries`, `processRuns`, and `processHistory`.
- Modify `src/lib/dashboardMetrics.test.ts`: owns data-helper and dataset consistency tests.
- Modify `src/App.test.tsx`: owns rendered dashboard interaction tests.
- Modify `README.md`: keeps the demo story aligned with the updated March 20 KPI.

No component changes are planned. If a component test fails because text changed from the dataset, update the test expectation rather than changing layout.

---

### Task 1: Add Dataset Consistency Tests

**Files:**
- Modify: `src/lib/dashboardMetrics.test.ts`

- [ ] **Step 1: Replace the first March 20 test with the expanded dataset expectation**

In `src/lib/dashboardMetrics.test.ts`, replace the test named `uses March 20, 2016 as the high-failure demo day` with:

```ts
  it('uses March 20, 2016 as the high-failure demo day with consistent counts', () => {
    const march20 = dailySummaries.find((summary) => summary.date === '2016-03-20');
    const march20Runs = getRunsForDate(processRuns, '2016-03-20');
    const radiantOrders = march20Runs.find(
      (run) => run.processName === 'Epic Radiant Orders',
    );

    expect(march20).toEqual({
      date: '2016-03-20',
      label: 'Mar 20',
      failureRate: 9.1,
      failedTasks: 2,
      totalTasks: 22,
    });
    expect(radiantOrders?.status).toBe('Failed');
    expect(radiantOrders?.durationMinutes).toBeGreaterThan(
      radiantOrders?.averageDurationMinutes ?? 0,
    );
  });
```

- [ ] **Step 2: Add a helper for rounded failure rate expectations**

Below the imports in `src/lib/dashboardMetrics.test.ts`, add:

```ts
function expectedFailureRate(failedTasks: number, totalTasks: number): number {
  return Number(((failedTasks / totalTasks) * 100).toFixed(1));
}
```

- [ ] **Step 3: Add the daily consistency test**

Inside `describe('dashboard metrics', () => {`, after the March 20 test, add:

```ts
  it('keeps every daily summary consistent with visible process runs', () => {
    expect(dailySummaries).toHaveLength(14);

    dailySummaries.forEach((summary) => {
      const runs = getRunsForDate(processRuns, summary.date);
      const failedRuns = runs.filter((run) => run.status === 'Failed');

      expect(runs.length).toBeGreaterThanOrEqual(18);
      expect(runs.length).toBeLessThanOrEqual(24);
      expect(summary.totalTasks).toBe(runs.length);
      expect(summary.failedTasks).toBe(failedRuns.length);
      expect(summary.failureRate).toBe(
        expectedFailureRate(summary.failedTasks, summary.totalTasks),
      );
      expect(runs.some((run) => run.type === 'Datasource')).toBe(true);
    });
  });
```

- [ ] **Step 4: Add a non-Radiant history coverage test**

After the existing `returns Epic Radiant Orders history with seven failures through March 20` test, add:

```ts
  it('provides history for key non-Radiant demo processes', () => {
    const asapHistory = getProcessHistory(processHistory, 'Epic ASAP Events');
    const claimAgingHistory = getProcessHistory(processHistory, 'Revenue Cycle Claim Aging');

    expect(asapHistory.length).toBeGreaterThanOrEqual(14);
    expect(asapHistory.some((run) => run.status === 'Failed')).toBe(true);
    expect(claimAgingHistory.length).toBeGreaterThanOrEqual(14);
    expect(claimAgingHistory.some((run) => run.date === '2016-03-20')).toBe(true);
  });
```

- [ ] **Step 5: Update existing KPI expectations to the new consistent dataset**

In the test named `computes daily KPIs for selected date`, replace:

```ts
    expect(kpis.failureRate).toBe(6.7);
    expect(kpis.failedTasks).toBe(4);
```

with:

```ts
    expect(kpis.failureRate).toBe(9.1);
    expect(kpis.failedTasks).toBe(2);
```

In the test named `falls back to the last summary for unknown KPI dates`, replace:

```ts
    expect(kpis.failureRate).toBe(6.7);
    expect(kpis.failedTasks).toBe(4);
    expect(kpis.totalTasks).toBe(60);
```

with:

```ts
    expect(kpis.failureRate).toBe(9.1);
    expect(kpis.failedTasks).toBe(2);
    expect(kpis.totalTasks).toBe(22);
```

In the test named `computes average failure baseline excluding selected date outlier`, replace:

```ts
    expect(baseline).toBeCloseTo(2.77, 1);
```

with:

```ts
    expect(baseline).toBeCloseTo(3.62, 1);
```

In the test named `uses summary failed task count when selected date has no process run details`, replace:

```ts
    expect(kpis.failureRate).toBe(7.1);
    expect(kpis.failedTasks).toBe(5);
```

with:

```ts
    expect(kpis.failureRate).toBe(13.6);
    expect(kpis.failedTasks).toBe(3);
```

- [ ] **Step 6: Run the targeted tests and confirm they fail on the current dataset**

Run:

```bash
npm run test -- src/lib/dashboardMetrics.test.ts
```

Expected: FAIL because March 20 still has `failureRate: 6.7`, `totalTasks: 60`, only March 20 has daily run details, and non-Radiant history is missing.

Do not commit yet. The failing tests are the red step for the dataset implementation.

---

### Task 2: Replace Thin Mock Data With Deterministic Complete Dataset

**Files:**
- Modify: `src/data/mockServerData.ts`
- Test: `src/lib/dashboardMetrics.test.ts`

- [ ] **Step 1: Replace `src/data/mockServerData.ts` with deterministic templates**

Replace the full file with:

```ts
import type { DailyFailureSummary, ProcessHistoryRun, ProcessRun, ProcessStatus, ProcessType } from '../types';

export const DEFAULT_DATE = '2016-03-20';

interface ProcessTemplate {
  slug: string;
  processName: string;
  type: ProcessType;
  scheduledTime: string;
  averageDurationMinutes: number;
}

interface RunOverride {
  status?: ProcessStatus;
  delayMinutes?: number;
  durationMinutes?: number;
  errorMessage?: string;
}

interface DaySpec {
  date: string;
  count: number;
  overrides: Record<string, RunOverride>;
}

interface HistorySpec {
  processName: string;
  slug: string;
  averageDurationMinutes: number;
  startTime: string;
  failedDates: string[];
  durationOverrides?: Record<string, number>;
  startOverrides?: Record<string, string>;
}

const processCatalog: ProcessTemplate[] = [
  { slug: 'radiant-orders', processName: 'Epic Radiant Orders', type: 'Datasource', scheduledTime: '10:30', averageDurationMinutes: 124.93 },
  { slug: 'asap-events', processName: 'Epic ASAP Events', type: 'Datasource', scheduledTime: '11:00', averageDurationMinutes: 45.2 },
  { slug: 'medication-charges', processName: 'Epic Medication Charges', type: 'Workbook', scheduledTime: '12:00', averageDurationMinutes: 41.5 },
  { slug: 'claim-aging', processName: 'Revenue Cycle Claim Aging', type: 'Datasource', scheduledTime: '13:30', averageDurationMinutes: 38.0 },
  { slug: 'mychart-status', processName: 'Epic MyChart Status', type: 'Workbook', scheduledTime: '09:00', averageDurationMinutes: 18.8 },
  { slug: 'bed-board', processName: 'Epic Bed Board Census', type: 'Datasource', scheduledTime: '07:00', averageDurationMinutes: 15.9 },
  { slug: 'surgical-case-volume', processName: 'Surgical Case Volume', type: 'Workbook', scheduledTime: '08:15', averageDurationMinutes: 30.1 },
  { slug: 'sepsis-warning', processName: 'Sepsis Early Warning', type: 'Workbook', scheduledTime: '08:45', averageDurationMinutes: 17.5 },
  { slug: 'refill-queue', processName: 'Pharmacy Refill Queue', type: 'Datasource', scheduledTime: '09:30', averageDurationMinutes: 21.0 },
  { slug: 'lab-turnaround', processName: 'Lab Result Turnaround', type: 'Workbook', scheduledTime: '10:00', averageDurationMinutes: 20.4 },
  { slug: 'encounter-arrival', processName: 'Encounter Arrival Feed', type: 'Datasource', scheduledTime: '14:00', averageDurationMinutes: 29.6 },
  { slug: 'access-wait-times', processName: 'Patient Access Wait Times', type: 'Workbook', scheduledTime: '15:00', averageDurationMinutes: 24.7 },
  { slug: 'inpatient-census', processName: 'Inpatient Census Snapshot', type: 'Datasource', scheduledTime: '05:45', averageDurationMinutes: 19.6 },
  { slug: 'or-utilization', processName: 'OR Utilization Summary', type: 'Workbook', scheduledTime: '06:30', averageDurationMinutes: 34.2 },
  { slug: 'claims-denial', processName: 'Claims Denial Worklist', type: 'Datasource', scheduledTime: '12:45', averageDurationMinutes: 32.8 },
  { slug: 'radiology-volume', processName: 'Radiology Volume Monitor', type: 'Workbook', scheduledTime: '16:00', averageDurationMinutes: 27.4 },
  { slug: 'ed-throughput', processName: 'ED Throughput Dashboard', type: 'Workbook', scheduledTime: '17:15', averageDurationMinutes: 36.5 },
  { slug: 'supply-par', processName: 'Supply PAR Replenishment', type: 'Datasource', scheduledTime: '18:30', averageDurationMinutes: 23.9 },
  { slug: 'quality-core-measures', processName: 'Quality Core Measures', type: 'Workbook', scheduledTime: '19:00', averageDurationMinutes: 44.6 },
  { slug: 'readmission-risk', processName: 'Readmission Risk Scores', type: 'Datasource', scheduledTime: '20:30', averageDurationMinutes: 52.3 },
  { slug: 'ambulatory-visits', processName: 'Ambulatory Visit Volume', type: 'Workbook', scheduledTime: '21:15', averageDurationMinutes: 31.7 },
  { slug: 'provider-productivity', processName: 'Provider Productivity Rollup', type: 'Datasource', scheduledTime: '22:00', averageDurationMinutes: 40.5 },
  { slug: 'infection-surveillance', processName: 'Infection Surveillance Feed', type: 'Datasource', scheduledTime: '23:15', averageDurationMinutes: 48.2 },
  { slug: 'payer-contracts', processName: 'Payer Contract Variance', type: 'Workbook', scheduledTime: '23:45', averageDurationMinutes: 35.8 },
];

const daySpecs: DaySpec[] = [
  { date: '2016-03-07', count: 20, overrides: {} },
  {
    date: '2016-03-08',
    count: 21,
    overrides: {
      'claim-aging': {
        status: 'Failed',
        delayMinutes: 18,
        durationMinutes: 74.2,
        errorMessage: 'ODBC SQL error: payer remittance staging table was unavailable during claim aging refresh.',
      },
    },
  },
  {
    date: '2016-03-09',
    count: 22,
    overrides: {
      'radiant-orders': {
        status: 'Failed',
        delayMinutes: 7,
        durationMinutes: 210.8,
        errorMessage: 'Tableau Data Engine SQL error: Radiant Orders extract exceeded tempdb workspace limit.',
      },
    },
  },
  { date: '2016-03-10', count: 20, overrides: { 'readmission-risk': { delayMinutes: 32, durationMinutes: 87.4 } } },
  {
    date: '2016-03-11',
    count: 19,
    overrides: {
      'medication-charges': {
        status: 'Failed',
        delayMinutes: 8,
        durationMinutes: 91.3,
        errorMessage: 'Tableau backgrounder failed: duplicate medication charge keys returned from Clarity.',
      },
    },
  },
  { date: '2016-03-12', count: 21, overrides: { 'radiant-orders': { status: 'Failed', delayMinutes: 11, durationMinutes: 226.9, errorMessage: 'Tableau Data Engine SQL error: Radiant Orders query timed out during extract refresh.' } } },
  {
    date: '2016-03-13',
    count: 22,
    overrides: {
      'asap-events': {
        status: 'Failed',
        delayMinutes: 64,
        durationMinutes: 118.6,
        errorMessage: 'SQL Server exception: lock request timeout while refreshing emergency department events.',
      },
      'medication-charges': {
        status: 'Failed',
        delayMinutes: 19,
        durationMinutes: 84.1,
        errorMessage: 'Tableau backgrounder failed: medication charge extract returned duplicate keys.',
      },
      'lab-turnaround': {
        status: 'Failed',
        delayMinutes: 22,
        durationMinutes: 69.5,
        errorMessage: 'Lab turnaround workbook failed after the LIS extract returned an incomplete batch.',
      },
    },
  },
  { date: '2016-03-14', count: 20, overrides: {} },
  {
    date: '2016-03-15',
    count: 21,
    overrides: {
      'asap-events': {
        status: 'Failed',
        delayMinutes: 16,
        durationMinutes: 99.2,
        errorMessage: 'SQL Server exception: emergency department feed lock timeout.',
      },
    },
  },
  {
    date: '2016-03-16',
    count: 22,
    overrides: {
      'radiant-orders': {
        status: 'Failed',
        delayMinutes: 8,
        durationMinutes: 198.3,
        errorMessage: 'Tableau Data Engine SQL error: Radiant Orders query timed out during tempdb sort.',
      },
    },
  },
  { date: '2016-03-17', count: 20, overrides: { 'provider-productivity': { delayMinutes: 25, durationMinutes: 72.6 } } },
  {
    date: '2016-03-18',
    count: 21,
    overrides: {
      'claim-aging': {
        status: 'Failed',
        delayMinutes: 12,
        durationMinutes: 70.4,
        errorMessage: 'ODBC SQL error: claim aging extract could not complete before remittance staging closed.',
      },
    },
  },
  { date: '2016-03-19', count: 20, overrides: {} },
  {
    date: '2016-03-20',
    count: 22,
    overrides: {
      'radiant-orders': {
        status: 'Failed',
        delayMinutes: 385,
        durationMinutes: 414.93,
        errorMessage: 'Tableau Data Engine SQL error: [EpicCaboodle].[RadiantOrders] query timed out while waiting for tempdb sort workspace.',
      },
      'claim-aging': {
        status: 'Failed',
        delayMinutes: 11,
        durationMinutes: 65.8,
        errorMessage: 'ODBC SQL error: claim aging extract could not complete before payer remittance staging closed.',
      },
    },
  },
];

const historyDates = [
  '2016-02-22',
  '2016-02-24',
  '2016-02-25',
  '2016-02-26',
  '2016-02-29',
  '2016-03-01',
  '2016-03-02',
  '2016-03-03',
  '2016-03-04',
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
  '2016-03-20',
];

const historySpecs: HistorySpec[] = [
  {
    processName: 'Epic Radiant Orders',
    slug: 'radiant-orders',
    averageDurationMinutes: 124.93,
    startTime: '10:34',
    failedDates: ['2016-02-24', '2016-03-01', '2016-03-04', '2016-03-09', '2016-03-12', '2016-03-16', '2016-03-20'],
    durationOverrides: {
      '2016-02-24': 188.4,
      '2016-03-01': 202.1,
      '2016-03-04': 194.6,
      '2016-03-09': 210.8,
      '2016-03-12': 226.9,
      '2016-03-16': 198.3,
      '2016-03-20': 414.93,
    },
    startOverrides: { '2016-03-20': '16:55' },
  },
  {
    processName: 'Epic ASAP Events',
    slug: 'asap-events',
    averageDurationMinutes: 45.2,
    startTime: '11:04',
    failedDates: ['2016-03-13', '2016-03-15'],
    durationOverrides: { '2016-03-13': 118.6, '2016-03-15': 99.2 },
  },
  {
    processName: 'Epic Medication Charges',
    slug: 'medication-charges',
    averageDurationMinutes: 41.5,
    startTime: '12:05',
    failedDates: ['2016-03-11', '2016-03-13'],
    durationOverrides: { '2016-03-11': 91.3, '2016-03-13': 84.1 },
  },
  {
    processName: 'Revenue Cycle Claim Aging',
    slug: 'claim-aging',
    averageDurationMinutes: 38.0,
    startTime: '13:36',
    failedDates: ['2016-03-08', '2016-03-18', '2016-03-20'],
    durationOverrides: { '2016-03-08': 74.2, '2016-03-18': 70.4, '2016-03-20': 65.8 },
    startOverrides: { '2016-03-20': '13:41' },
  },
  {
    processName: 'Epic MyChart Status',
    slug: 'mychart-status',
    averageDurationMinutes: 18.8,
    startTime: '09:02',
    failedDates: [],
  },
  {
    processName: 'Epic Bed Board Census',
    slug: 'bed-board',
    averageDurationMinutes: 15.9,
    startTime: '07:03',
    failedDates: [],
  },
  {
    processName: 'Lab Result Turnaround',
    slug: 'lab-turnaround',
    averageDurationMinutes: 20.4,
    startTime: '10:02',
    failedDates: ['2016-03-13'],
    durationOverrides: { '2016-03-13': 69.5 },
  },
];

function addMinutes(date: string, time: string, minutes: number): string {
  const [hourPart, minutePart] = time.split(':');
  const totalMinutes = Number(hourPart) * 60 + Number(minutePart) + minutes;
  const dayOffset = Math.floor(totalMinutes / 1440);
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;
  const timestampDate = new Date(`${date}T00:00:00Z`);
  timestampDate.setUTCDate(timestampDate.getUTCDate() + dayOffset);
  const datePart = timestampDate.toISOString().slice(0, 10);
  return `${datePart}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
}

function labelForDate(date: string): string {
  const [, , day] = date.split('-');
  return `Mar ${Number(day)}`;
}

function roundedFailureRate(failedTasks: number, totalTasks: number): number {
  return Number(((failedTasks / totalTasks) * 100).toFixed(1));
}

function buildRun(day: DaySpec, template: ProcessTemplate, index: number): ProcessRun {
  const override = day.overrides[template.slug];
  const status = override?.status ?? 'Succeeded';
  const daySeed = Number(day.date.slice(-2));
  const baseDelay = (daySeed + index * 3) % 8;
  const delayMinutes = override?.delayMinutes ?? baseDelay;
  const durationVariance = ((daySeed + index) % 5) - 2;
  const defaultDuration = Number(
    Math.max(5, template.averageDurationMinutes + durationVariance * 2.4).toFixed(1),
  );
  const durationMinutes = override?.durationMinutes ?? defaultDuration;

  return {
    id: `run-${day.date.replaceAll('-', '')}-${template.slug}`,
    processName: template.processName,
    type: template.type,
    date: day.date,
    status,
    scheduledStart: addMinutes(day.date, template.scheduledTime, 0),
    actualStart: addMinutes(day.date, template.scheduledTime, delayMinutes),
    durationMinutes,
    averageDurationMinutes: template.averageDurationMinutes,
    ...(override?.errorMessage ? { errorMessage: override.errorMessage } : {}),
  };
}

function buildProcessRuns(): ProcessRun[] {
  return daySpecs.flatMap((day) =>
    processCatalog.slice(0, day.count).map((template, index) => buildRun(day, template, index)),
  );
}

function buildDailySummaries(runs: ProcessRun[]): DailyFailureSummary[] {
  return daySpecs.map((day) => {
    const dayRuns = runs.filter((run) => run.date === day.date);
    const failedTasks = dayRuns.filter((run) => run.status === 'Failed').length;
    return {
      date: day.date,
      label: labelForDate(day.date),
      failureRate: roundedFailureRate(failedTasks, dayRuns.length),
      failedTasks,
      totalTasks: dayRuns.length,
    };
  });
}

function buildHistory(spec: HistorySpec): ProcessHistoryRun[] {
  return historyDates.map((date, index) => {
    const failed = spec.failedDates.includes(date);
    const durationVariance = ((index % 5) - 2) * 1.7;
    const durationMinutes =
      spec.durationOverrides?.[date] ??
      Number(Math.max(5, spec.averageDurationMinutes + durationVariance).toFixed(1));
    const actualStart = spec.startOverrides?.[date]
      ? addMinutes(date, spec.startOverrides[date], 0)
      : addMinutes(date, spec.startTime, index % 4);

    return {
      id: `history-${spec.slug}-${date.replaceAll('-', '')}`,
      processName: spec.processName,
      date,
      status: failed ? 'Failed' : 'Succeeded',
      actualStart,
      durationMinutes,
      averageDurationMinutes: spec.averageDurationMinutes,
    };
  });
}

export const processRuns: ProcessRun[] = buildProcessRuns();

export const dailySummaries: DailyFailureSummary[] = buildDailySummaries(processRuns);

export const processHistory: ProcessHistoryRun[] = historySpecs.flatMap(buildHistory);
```

- [ ] **Step 2: Run data tests**

Run:

```bash
npm run test -- src/lib/dashboardMetrics.test.ts
```

Expected: FAIL only if the existing Workbook-count test still expects the old hard-coded count of `6`.

- [ ] **Step 3: If the existing Workbook-count test fails, update it to compare against filtered data**

In `src/lib/dashboardMetrics.test.ts`, replace this assertion:

```ts
    expect(workbookRuns).toHaveLength(6);
```

with:

```ts
    expect(workbookRuns).toHaveLength(
      processRuns.filter((run) => run.date === '2016-03-20' && run.type === 'Workbook').length,
    );
```

- [ ] **Step 4: Run data tests again**

Run:

```bash
npm run test -- src/lib/dashboardMetrics.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the dataset and data tests**

Run:

```bash
git add src/data/mockServerData.ts src/lib/dashboardMetrics.test.ts
git commit -m "feat: expand deterministic demo dataset"
```

Expected: commit succeeds and includes only the dataset file plus data tests.

---

### Task 3: Update App Interaction Tests For Expanded Data

**Files:**
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Update the default KPI expectation**

In the test named `renders the dashboard header, KPIs, and March 20 overview state`, replace:

```ts
    expect(screen.getByText('Failure Rate').parentElement).toHaveTextContent('6.7%');
```

with:

```ts
    expect(screen.getByText('Failure Rate').parentElement).toHaveTextContent('9.1%');
```

- [ ] **Step 2: Update the date-selection test for March 7**

In the test named `can select a date with accessible controls and keeps failure averages consistent`, replace the click and assertions with:

```ts
    await user.click(screen.getByRole('button', { name: '7 Mar, 0.0% failed' }));

    expect(screen.getByRole('button', { name: '7 Mar, 0.0% failed' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('Failure Rate').parentElement).toHaveTextContent('0.0%');
    expect(screen.getByText('14-Day Avg').parentElement).toHaveTextContent('4.3%');
    expect(
      within(screen.getByRole('region', { name: /14-day failure overview/i })).getByText(
        'Avg 4.3%',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/No processes match the current filters/i)).not.toBeInTheDocument();
```

- [ ] **Step 3: Update the overview March 20 accessible label**

In the test named `renders a single overview block with a clickable column per day`, replace:

```ts
      within(region).getByRole('button', { name: '20 Mar, 6.7% failed' }),
```

with:

```ts
      within(region).getByRole('button', { name: '20 Mar, 9.1% failed' }),
```

- [ ] **Step 4: Add an interaction test for the secondary outlier day**

After the overview block test, add:

```ts
  it('shows populated process rows when selecting the March 13 secondary outlier', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/select type/i), 'All');
    await user.click(screen.getByRole('button', { name: '13 Mar, 13.6% failed' }));

    expect(screen.getByText(/Epic ASAP Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Epic Medication Charges/i)).toBeInTheDocument();
    expect(screen.getByText(/Lab Result Turnaround/i)).toBeInTheDocument();
    expect(screen.queryByText(/No processes match the current filters/i)).not.toBeInTheDocument();
  });
```

- [ ] **Step 5: Add an interaction test for non-Radiant history**

After the existing process history test, add:

```ts
  it('opens history for a non-Radiant demo process', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Revenue Cycle Claim Aging/i }));

    expect(
      screen.getByRole('heading', { name: /Revenue Cycle Claim Aging: summary/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3 failures in the previous month/i)).toBeInTheDocument();
  });
```

- [ ] **Step 6: Run app tests**

Run:

```bash
npm run test -- src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit app test updates**

Run:

```bash
git add src/App.test.tsx
git commit -m "test: cover expanded demo interactions"
```

Expected: commit succeeds and includes only `src/App.test.tsx`.

---

### Task 4: Update README Demo Story Numbers

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update the default failure rate in README**

In `README.md`, replace:

```md
- Failure rate: 6.7%
```

with:

```md
- Failure rate: 9.1%
```

- [ ] **Step 2: Add a note that the demo dataset is complete across the overview**

After the default demo state list, add:

```md
The local mock dataset includes detailed process rows for every day in the 14-day overview, plus one-month history for the main demo processes.
```

- [ ] **Step 3: Commit README update**

Run:

```bash
git add README.md
git commit -m "docs: align demo story with expanded dataset"
```

Expected: commit succeeds and includes only `README.md`.

---

### Task 5: Full Verification

**Files:**
- Verify: `src/data/mockServerData.ts`
- Verify: `src/lib/dashboardMetrics.test.ts`
- Verify: `src/App.test.tsx`
- Verify: `README.md`

- [ ] **Step 1: Run the full test suite**

Run:

```bash
npm run test
```

Expected: PASS for all Vitest tests.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: TypeScript checks pass and Vite builds `dist`.

- [ ] **Step 3: Inspect git status**

Run:

```bash
git status --short
```

Expected: only unrelated pre-existing untracked docs remain, or no changes if every task commit succeeded. Do not stage unrelated docs or generated `dist` output unless the repository already tracks those exact files and they changed because of the build.

- [ ] **Step 4: Report verification**

Final report should include:

```md
Implemented the expanded deterministic demo dataset.
Verification:
- `npm run test` passed.
- `npm run build` passed.

March 20 now uses 22 visible task rows, 2 failures, and a consistent 9.1% failure rate.
```
