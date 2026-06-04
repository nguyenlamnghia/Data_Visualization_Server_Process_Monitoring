# Server Process Monitoring Dashboard Design

## Context

This capstone project rebuilds the Chapter 18 dashboard from *The Big Book of Dashboards*: "Server Process Monitoring." The original scenario is a business intelligence manager checking overnight Tableau Server processes before users arrive at work.

The demo will be a React + Vite single-page dashboard with simulated healthcare/Tableau data. The UI language will be English. The dashboard is optimized for a desktop or laptop 16:9 presentation screen.

## Dashboard Objective

The visualization dashboard helps an administrator answer the morning operations question:

> Did the overnight server refresh processes complete successfully, and which failed or delayed processes need immediate investigation?

The dashboard must support three operational decisions:

1. Decide whether the most recent overnight run was normal or an outlier.
2. Identify the failed or delayed process causing the issue.
3. Determine whether the selected process is a recurring problem or a one-off failure.

## Story

The selected story is the Chapter 18 "Server Process Monitoring" flow:

1. The administrator opens a morning dashboard.
2. The 14-day overview shows that March 20, 2016 has an unusually high failure rate.
3. The daily timeline reveals that `Epic Radiant Orders` failed after running much longer than usual.
4. The tooltip provides immediate diagnostic context and a `View Refresh Task` action.
5. The process summary shows that the same task has failed repeatedly over the previous month.

The narrative is intentionally top-down: overview, zoom/filter, details on demand.

## Chosen Approach

Use React + Vite, Recharts for the 14-day overview chart, and custom SVG for the Gantt-style process timelines.

This approach is selected because:

- Recharts gives a reliable, polished bar chart quickly.
- Custom SVG gives precise control over process labels, time scales, reference lines, hover states, and click interactions.
- The resulting app remains frontend-only and stable for classroom demo.

## Visual Direction

The visual direction is "Modern Demo": a polished presentation version that preserves the original dashboard story without copying the older Tableau styling exactly.

Design principles:

- Light, work-focused dashboard UI.
- Minimal decorative elements.
- Dense but readable operational layout.
- KPI strip near the top for demo clarity.
- Main timeline receives the most screen space.
- Failure states use red; successful processes use neutral gray.
- Scheduled start reference lines use dotted strokes.
- Average duration or average completion reference lines use solid strokes.
- Rounded corners stay subtle, at 8px or less.
- No nested cards.

## Application Structure

The app contains one main dashboard screen with these sections:

1. Header and controls
   - Title: `Server Process Monitoring`
   - Subtitle describing overnight process status
   - Search input
   - Type selector with `Datasource`, `Workbook`, and `All`
   - Date range selector set to `Last 14 days`

2. KPI strip
   - Failure rate for the selected day
   - Number of failed tasks
   - Number of delayed tasks
   - Average failure rate baseline for the recent period

3. 14-day failure overview
   - Bar chart showing daily failure percentage
   - Average failure rate reference line
   - Selected date highlighted
   - Clicking a date updates the rest of the dashboard

4. Daily process timeline
   - Custom SVG Gantt chart for all visible processes on the selected date
   - Process label placed near the corresponding bar
   - Red bars for failed processes
   - Gray bars for successful processes
   - Dotted scheduled start reference line per process
   - Solid average-duration reference line per process
   - Time grid and horizontal axis
   - Hover tooltip with process diagnostics
   - Click selection to open the historical detail section

5. Process detail summary
   - Appears when a process is selected
   - Shows one-month history for that process
   - Uses compact Gantt rows by date
   - Highlights repeated failures in red
   - Supports the story question: trend or one-off?

6. Demo task action
   - `View Refresh Task` appears in tooltip or detail panel
   - Opens a modal or toast explaining that this is a simulated jump to the server task

## Data Model

The app uses deterministic local mock data. No backend or external API is required.

Core entities:

```ts
type ProcessType = 'Datasource' | 'Workbook';
type ProcessStatus = 'Succeeded' | 'Failed';

interface DailyFailureSummary {
  date: string;
  label: string;
  failureRate: number;
  failedTasks: number;
  totalTasks: number;
}

interface ProcessRun {
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

interface ProcessHistoryRun {
  id: string;
  processName: string;
  date: string;
  status: ProcessStatus;
  actualStart: string;
  durationMinutes: number;
  averageDurationMinutes: number;
}
```

Seed data requirements:

- The default selected date is `2016-03-20`.
- The 14-day overview ends at `2016-03-20`.
- `2016-03-20` has a high failure rate around `6.7%`.
- `Epic Radiant Orders` is a prominent failed datasource process.
- `Epic Radiant Orders` has repeated failures in the previous month.
- Related healthcare process names mirror the book's context, including examples such as `Epic ASAP Events`, `Epic Medication Charges`, and `Epic MyChart Status`.

## Interactions

1. Date selection
   - Clicking a bar in the overview updates selected date, KPI values, process list, and selected process state.

2. Search
   - Filters visible processes by case-insensitive process name match.

3. Type filter
   - `Datasource` is the default.
   - `Workbook` shows workbook refreshes.
   - `All` shows both types.

4. Hover tooltip
   - Displays process name, date, status, start time, duration, average duration, and error message when present.
   - Provides a visible `View Refresh Task` action for failed tasks.

5. Process selection
   - Clicking a process selects it and reveals or updates the process history section.
   - Selected process is visually highlighted.

6. Demo action
   - Clicking `View Refresh Task` opens a simulated modal or toast.
   - The action does not navigate away from the dashboard.

## Error Handling And Empty States

The dashboard is frontend-only, so expected errors are interaction and filtering states rather than network failures.

Required states:

- No process matches search or filter: show a concise empty state in the timeline area.
- Selected process is filtered out: clear selection or show the selected process only if it still matches the active filters.
- Missing history for a selected process: show a compact "No history available" state.
- Invalid date selection cannot occur through normal UI controls; data helpers fall back to the default date if needed.

## Testing And Verification

Verification includes:

- `npm run build` succeeds.
- If lint or type-check scripts are available, they pass.
- The app starts with `npm run dev`.
- Default screen shows March 20, 2016 with high failure rate and `Epic Radiant Orders` as a visible failure.
- Clicking a 14-day overview bar updates the daily timeline.
- Search and type filters update visible processes.
- Hovering or focusing a process shows diagnostic details.
- Clicking a process opens the historical summary.
- `View Refresh Task` opens a simulated modal or toast.

## Out Of Scope

The first implementation will not include:

- Real Tableau Server integration.
- Authentication.
- Backend APIs.
- Persisted user preferences.
- Mobile-first optimization.
- A separate analysis or speaker-notes page.

## Capstone Discussion Points

The implementation supports the group's presentation requirements:

- Objective of the visualization dashboard.
- Story selected for the dashboard.
- How display choices support the story.
- Strengths of the dashboard.
- Weaknesses of the original dashboard.
- Possible improvements, especially improved presentation polish, KPI clarity, cleaner controls, and reduced label/reference-line overlap.
