# Complete Demo Dataset Design

## Context

The current Server Process Monitoring Dashboard has enough mock data to tell the default
March 20, 2016 story, but it is thin outside that path:

- `dailySummaries` has 14 days.
- `processRuns` has detailed task rows only for March 20.
- `processHistory` exists only for `Epic Radiant Orders`.

That means clicking most days in the overview produces an empty timeline, and selecting most
tasks cannot show a meaningful history. The demo needs a fuller deterministic dataset so the
presenter can move around the dashboard without leaving the story.

## Decisions Locked With User

- Scope: keep the existing 14-day overview from `2016-03-07` through `2016-03-20`.
- Data style: use consistent, deterministic demo data that is easy to explain.
- Daily task volume: each day should have 18-24 task rows.
- `dailySummaries.totalTasks` should match the number of task rows shown for that day.
- Recommended approach approved: static deterministic mock data organized around a fixed
  process set and repeatable day patterns.

## Goals

1. Make every overview day useful to click during the demo.
2. Keep March 20 as the primary high-failure story day.
3. Keep March 13 as a secondary outlier so the overview has more than one notable event.
4. Make KPI values internally consistent with the task rows.
5. Provide history for the processes most likely to be selected during demo.
6. Avoid UI refactoring unless a test or data consistency issue requires a small adjustment.

## Non-Goals

- Do not add a backend, API, persistence layer, or external data generator.
- Do not expand the overview beyond 14 days.
- Do not create 50-100 task rows per day.
- Do not change the visual design or layout as part of this dataset work.
- Do not remove the empty-state fallback; it remains useful for search/filter cases and
  lower-priority tasks without history.

## Data Architecture

All mock data remains in `src/data/mockServerData.ts` and continues to export:

- `DEFAULT_DATE`
- `dailySummaries`
- `processRuns`
- `processHistory`

The implementation should keep the app frontend-only. Data can be authored as static arrays or as
small deterministic templates inside the mock data file, but consumers should continue receiving
plain arrays with the existing TypeScript shapes:

- `DailyFailureSummary`
- `ProcessRun`
- `ProcessHistoryRun`

No component should need to know how the dataset was produced.

## Daily Summary Rules

For each date from `2016-03-07` to `2016-03-20`:

- There must be 18-24 `ProcessRun` rows.
- `totalTasks` must equal the count of `ProcessRun` rows for that date.
- `failedTasks` must equal the count of rows whose `status` is `Failed`.
- `failureRate` must equal `failedTasks / totalTasks * 100`, rounded to one decimal place.
- Labels should stay in the current short format, such as `Mar 7`.

March 20 remains the default selected date and the main demo day:

- `DEFAULT_DATE` remains `2016-03-20`.
- `Epic Radiant Orders` must be one of the March 20 failures and remain the most visually
  prominent failure.
- March 20 should use `totalTasks: 22` and `failedTasks: 2`, giving `failureRate: 9.1`.

The previous demo value, `6.7%`, cannot satisfy all approved constraints at the same time:
18-24 task rows per day, integer failed-task counts, and `totalTasks` matching the visible
timeline rows. This spec resolves the conflict by prioritizing internal consistency and the
approved 18-24 row-count range. Tests and README story numbers should be updated from `6.7%` to
the new consistent March 20 rate.

## Process Run Design

Use a fixed process catalog of roughly 22 healthcare/Tableau refresh jobs, mixed between
`Datasource` and `Workbook`. The catalog should include existing story names:

- `Epic Radiant Orders`
- `Epic ASAP Events`
- `Epic Medication Charges`
- `Revenue Cycle Claim Aging`
- `Epic MyChart Status`
- `Epic Bed Board Census`
- `Surgical Case Volume`
- `Sepsis Early Warning`
- `Pharmacy Refill Queue`
- `Lab Result Turnaround`
- `Encounter Arrival Feed`
- `Patient Access Wait Times`

Additional names should stay in the same domain, such as census, claims, lab, access, pharmacy,
OR, inpatient, and revenue-cycle reporting.

Each daily row should include:

- Stable id using date and process slug.
- Process name and type.
- Date matching the selected day.
- Scheduled start.
- Actual start.
- Duration.
- Average duration.
- Optional error message for failures.

Time patterns should support the current timeline scale:

- Scheduled and actual starts should usually fall between 5:00 AM and 11:59 PM.
- A small number of delayed or long-running tasks may extend late into the evening.
- Failed tasks should often have duration greater than average duration.
- Successful tasks may still be delayed sometimes, so the delayed KPI remains useful.

## Failure Story Patterns

March 20:

- Main story day.
- `Epic Radiant Orders` fails with a long duration and late actual start.
- At least one additional failure or severe delay may appear, but it should not compete with
  `Epic Radiant Orders` as the primary story.

March 13:

- Secondary outlier.
- Use 2-3 failures across different process types.
- Good for showing that the overview can reveal more than one notable day.

Normal days:

- 0-1 failures, sometimes 2 on moderate days.
- A few delayed-but-succeeded tasks.
- Search and type filters should still return useful rows.

## Process History Design

Expand `processHistory` beyond `Epic Radiant Orders` for the processes most likely to be selected
during demo:

- `Epic Radiant Orders`
- `Epic ASAP Events`
- `Epic Medication Charges`
- `Revenue Cycle Claim Aging`
- `Epic MyChart Status`
- `Epic Bed Board Census`
- `Lab Result Turnaround`

`Epic Radiant Orders` keeps the strongest history story:

- It should continue to show seven failures in the previous month, including March 20.
- Its March 20 history row should match the March 20 process run.

Other process histories should be smaller and less severe:

- 14-22 rows per highlighted process is enough.
- Failed/high-duration processes should have a few prior failures or delays.
- Stable successful processes should be mostly succeeded, giving the presenter contrast.

The history section does not need to exist for every process in the catalog. The existing empty
state remains the fallback for lower-priority rows.

## Data Flow

The existing data flow remains unchanged:

1. `App` imports arrays from `mockServerData`.
2. Date selection filters `processRuns` by date.
3. Type and search filters refine visible rows.
4. KPI helpers compute daily metrics from the selected date rows and `dailySummaries`.
5. Process selection looks up matching history rows by process name.

Any helper introduced in `mockServerData.ts` should be private to that module unless tests need a
small exported helper for consistency checks. Prefer testing the exported arrays directly.

## Error Handling

Expected fallback behavior remains:

- Search or type filter can still produce "No processes match the current filters."
- Selecting a process with no history can still show "No history available."
- Unknown KPI dates continue to use the helper fallback behavior already covered by tests.

The dataset should reduce accidental empty states during normal demo clicks, not eliminate all
possible empty states.

## Testing Plan

Update or add tests for:

- Every `dailySummaries` row has 18-24 matching `processRuns`.
- `totalTasks`, `failedTasks`, and `failureRate` are consistent with rows for that date.
- Every overview day can be selected without showing the default filter empty state for the
  selected process type, or the test explicitly switches the type filter to `All`.
- March 20 still starts as the default demo state, has `failureRate: 9.1`, and includes
  `Epic Radiant Orders` as a failed process.
- `Epic Radiant Orders` history still contains seven failures and includes March 20.
- Search and type filters continue to work with the larger dataset.
- At least one non-Radiant process selection shows history.

Verification commands:

- `npm run test`
- `npm run build`

## Open Implementation Notes

- The current default type filter is `Datasource`. Ensure each day has enough datasource rows so
  clicking overview days still shows a populated timeline by default.
- Keep generated ids stable and human-readable to make debugging straightforward.
