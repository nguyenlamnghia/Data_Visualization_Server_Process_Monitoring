import { describe, expect, it } from 'vitest';
import { dailySummaries, processHistory, processRuns } from '../data/mockServerData';
import {
  calculateAverageFailureRate,
  filterProcessRuns,
  getDailyKpis,
  getProcessHistory,
  getRunsForDate,
} from './dashboardMetrics';

function expectedFailureRate(failedTasks: number, totalTasks: number): number {
  return Number(((failedTasks / totalTasks) * 100).toFixed(1));
}

describe('dashboard metrics', () => {
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

  it('filters process runs by date, type, and search text', () => {
    const runs = filterProcessRuns(processRuns, {
      date: '2016-03-20',
      type: 'Datasource',
      search: 'radiant',
    });
    expect(runs).toHaveLength(1);
    expect(runs[0].processName).toBe('Epic Radiant Orders');
  });

  it('treats blank, trimmed, and case-insensitive search consistently', () => {
    const blankSearchRuns = filterProcessRuns(processRuns, {
      date: '2016-03-20',
      type: 'All',
      search: '   ',
    });
    const trimmedCaseInsensitiveRuns = filterProcessRuns(processRuns, {
      date: '2016-03-20',
      type: 'All',
      search: '  RADIANT  ',
    });

    expect(blankSearchRuns).toHaveLength(getRunsForDate(processRuns, '2016-03-20').length);
    expect(trimmedCaseInsensitiveRuns.map((run) => run.processName)).toEqual([
      'Epic Radiant Orders',
    ]);
  });

  it('supports All and Workbook process type filters', () => {
    const allRuns = filterProcessRuns(processRuns, {
      date: '2016-03-20',
      type: 'All',
      search: '',
    });
    const workbookRuns = filterProcessRuns(processRuns, {
      date: '2016-03-20',
      type: 'Workbook',
      search: '',
    });

    expect(allRuns).toHaveLength(getRunsForDate(processRuns, '2016-03-20').length);
    expect(workbookRuns).toHaveLength(
      processRuns.filter((run) => run.date === '2016-03-20' && run.type === 'Workbook').length,
    );
    expect(workbookRuns.every((run) => run.type === 'Workbook')).toBe(true);
  });

  it('computes daily KPIs for selected date', () => {
    const kpis = getDailyKpis(getRunsForDate(processRuns, '2016-03-20'), dailySummaries);
    expect(kpis.failureRate).toBe(9.1);
    expect(kpis.failedTasks).toBe(2);
    expect(kpis.delayedTasks).toBeGreaterThanOrEqual(2);
  });

  it('falls back to the last summary for unknown KPI dates', () => {
    const kpis = getDailyKpis([], dailySummaries, '2016-04-01');

    expect(kpis.failureRate).toBe(9.1);
    expect(kpis.failedTasks).toBe(2);
    expect(kpis.totalTasks).toBe(22);
  });

  it('returns safe zero KPIs and baseline when summaries are empty', () => {
    const kpis = getDailyKpis([], []);

    expect(kpis).toEqual({
      failureRate: 0,
      failedTasks: 0,
      delayedTasks: 0,
      totalTasks: 0,
      baselineFailureRate: 0,
    });
    expect(calculateAverageFailureRate([])).toBe(0);
    expect(calculateAverageFailureRate([{ ...dailySummaries[0] }], dailySummaries[0].date)).toBe(
      0,
    );
  });

  it('computes average failure baseline excluding selected date outlier', () => {
    const baseline = calculateAverageFailureRate(dailySummaries, '2016-03-20');
    expect(baseline).toBeCloseTo(3.62, 1);
  });

  it('returns Epic Radiant Orders history with seven failures through March 20', () => {
    const history = getProcessHistory(processHistory, 'Epic Radiant Orders');

    expect(history.filter((run) => run.status === 'Failed')).toHaveLength(7);
    expect(history.some((run) => run.date === '2016-03-20')).toBe(true);
  });

  it('provides history for key non-Radiant demo processes', () => {
    const asapHistory = getProcessHistory(processHistory, 'Epic ASAP Events');
    const claimAgingHistory = getProcessHistory(processHistory, 'Revenue Cycle Claim Aging');

    expect(asapHistory.length).toBeGreaterThanOrEqual(14);
    expect(asapHistory.some((run) => run.status === 'Failed')).toBe(true);
    expect(claimAgingHistory.length).toBeGreaterThanOrEqual(14);
    expect(claimAgingHistory.some((run) => run.date === '2016-03-20')).toBe(true);
  });

  it('provides history for every March 20 demo process', () => {
    const march20Runs = getRunsForDate(processRuns, '2016-03-20');

    march20Runs.forEach((run) => {
      expect(getProcessHistory(processHistory, run.processName).length).toBeGreaterThan(0);
    });
  });

  it('uses summary failed task count when selected date has no process run details', () => {
    const copiedSummaries = dailySummaries.map((summary) => ({ ...summary }));
    const kpis = getDailyKpis([], copiedSummaries, '2016-03-13');

    expect(kpis.failureRate).toBe(13.6);
    expect(kpis.failedTasks).toBe(3);
    expect(kpis.delayedTasks).toBe(0);
  });
});
