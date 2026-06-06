# Dashboard Fidelity to Chapter 18 — Design

## Context

This capstone project rebuilds the Chapter 18 dashboard from *The Big Book of Dashboards*:
"Server Process Monitoring" (designer: Mark Jackson, Piedmont Healthcare; Tableau "Tableau
Server Data Status" dashboard). The current React + Vite + Recharts demo works, but several
design choices diverge from the author's original intent shown in Figures 18.1–18.5.

The goal of this iteration is to **correct the places where the demo contradicts the author's
deliberate design decisions**, while keeping a few presentation-polish additions (the KPI strip)
that aid the classroom demo.

This is a follow-up to the original spec at
`docs/superpowers/specs/2026-06-04-server-process-monitoring-dashboard-design.md`.

## Decisions Locked With User

- **Fidelity level:** Fix what contradicts the author's intent; keep the KPI strip polish.
- **Overview:** Merge the 14-day overview into a single block matching Figure 18.5 (remove the
  duplicate date-button strip).
- **Header:** Keep the new title `Server Process Monitoring`; fix the controls layout; remove the
  surplus `started_at / Last 14 days` control.
- **Search control:** Keep the text input (a justified polish over the original "All" dropdown).

## Divergences Identified (current demo vs. original)

1. **Gantt labels in a fixed left column** (`ProcessTimeline.tsx:122`) instead of next to the bars.
   The author deliberately labels the bars themselves so a failed (red) task's name sits where the
   eye already is (Figure 18.3, top view). This is the primary issue.
2. **Average-duration reference line drawn as a horizontal line below the bar**
   (`ProcessTimeline.tsx:141-148`). Figure 18.4 shows it as a **vertical solid tick crossing the
   bar** at the average-duration point.
3. **No green "work window" band** (~8am–5pm) behind the bars on the main timeline. The original
   has it; `ProcessHistory.tsx` already renders one, but `ProcessTimeline` does not.
4. **Overview is split** into a Recharts bar chart plus a separate clickable date-button strip
   (duplicated function). Figure 18.5 unifies these: one column per day, percentage printed on top
   of each column, date as an underlined link below, selected day rendered as a bold red block.
5. **Surplus header control** `started_at / Last 14 days` that is not present in the original.

## Scope of Changes

### 1. Gantt labels float beside the bars — `src/components/ProcessTimeline.tsx`

- Replace the fixed-left-column label (`foreignObject x=0 width=chartLeft-18`) with a label whose
  width extends to just before the bar's start: `width = chartLeft + actualX - gap`, text
  **right-aligned**, so the label's right edge stops just before the bar regardless of where the
  bar sits on the time axis.
- Color the label **red when `status === 'Failed'`** (matches Figures 18.3/18.4 where "Epic
  Radiant Orders" is red beside its red bar).
- Keep the label as a `<button>` to preserve accessibility and the existing
  `getByRole('button', {name})` test selectors.
- The label may overlay the empty grid area to the left of the bar; it must remain transparent and
  never overlap the bar itself.

### 2. Reference lines + work-window band — `src/components/ProcessTimeline.tsx`

- Change the average-duration mark from a horizontal line below the bar to a **vertical solid tick
  crossing the bar** at `actualX + averageWidth` (mirroring the correct treatment in
  `ProcessHistory.tsx:73`).
- Keep the dotted vertical line for scheduled start (already correct).
- Add a **green work-window band** (~8am–5pm) behind the bars, using the existing
  `--work-window` CSS variable, consistent with `ProcessHistory`.

### 3. Unified 14-day overview — `src/components/FailureOverview.tsx`

- Remove the Recharts `BarChart` and the separate `overview-date-strip`.
- Build one column strip (SVG or flex): each day is a pink column with the **percentage printed on
  top** and an **underlined, link-styled date label** beneath. The selected day renders as a
  **bold red block** with white percentage and emphasized date (Figure 18.5).
- Keep the **dotted red average line** across the columns. Clicking a column still changes the
  selected date.
- `recharts` becomes unused after this change; remove it from `package.json` dependencies.

### 4. Header controls cleanup — `src/components/DashboardHeader.tsx`

- Keep the title `Server Process Monitoring`.
- Remove the surplus `started_at / Last 14 days` control.
- Keep the Search **text input** and the Select Type dropdown; position the controls cluster at the
  **top-right**, matching the original layout.

### 5. Tests + verification

- Update `src/App.test.tsx`: remove the `Last 14 days` assertion (`:18`) tied to the removed
  control. All other tests remain valid (label still a button; search still a text input; type
  filter, date selection, modal, and history flows unchanged).
- Verification:
  - `npm run build` succeeds.
  - `npm run test` passes.
  - `npm run dev` visual check: the red label sits beside the red Epic Radiant Orders bar; the
    average mark is a vertical tick; the green work-window band is present; the overview is a single
    unified block; the header is tidy with no surplus control.

## Out of Scope (unchanged)

- Mock data (`src/data/mockServerData.ts`).
- `ProcessHistory` component (already matches the original detail view, Figure 18.2).
- Tooltip (Figure 18.1) and the simulated `View Refresh Task` modal.
- The KPI strip (kept as deliberate demo polish).
- Mobile-first optimization, backend, authentication.

## Author Design Decisions Preserved

- Labels on the bars, not in a left column (Figure 18.3).
- Dotted = scheduled start; solid = average duration (Figure 18.4).
- Gray = succeeded, red = failed (color encoding for pre-attentive scanning).
- Overview bar chart for 14-day context with an average reference line (Figure 18.5).
- Shneiderman flow preserved: overview (14-day) → zoom/filter (daily Gantt) → details on demand
  (tooltip / history).
