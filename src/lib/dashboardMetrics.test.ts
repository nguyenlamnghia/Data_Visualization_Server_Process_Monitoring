import { describe, expect, it } from 'vitest';
import { dailySummaries, processHistory, processRuns } from '../data/mockServerData';
import {
  calculateAverageFailureRate,
  filterProcessRuns,
  getDailyKpis,
  getProcessHistory,
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

    expect(blankSearchRuns).toHaveLength(processRuns.length);
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

    expect(allRuns).toHaveLength(processRuns.length);
    expect(workbookRuns).toHaveLength(6);
    expect(workbookRuns.every((run) => run.type === 'Workbook')).toBe(true);
  });

  it('computes daily KPIs for selected date', () => {
    const kpis = getDailyKpis(getRunsForDate(processRuns, '2016-03-20'), dailySummaries);
    expect(kpis.failureRate).toBe(6.7);
    expect(kpis.failedTasks).toBe(4);
    expect(kpis.delayedTasks).toBeGreaterThanOrEqual(2);
  });

  it('falls back to the last summary for unknown KPI dates', () => {
    const kpis = getDailyKpis([], dailySummaries, '2016-04-01');

    expect(kpis.failureRate).toBe(6.7);
    expect(kpis.failedTasks).toBe(4);
    expect(kpis.totalTasks).toBe(60);
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
    expect(calculateAverageFailureRate([{ ...dailySummaries[0] }])).toBe(1.2);
  });

  it('computes a stable 14-day average failure baseline including the selected date', () => {
    const baseline = calculateAverageFailureRate(dailySummaries);
    const highDayKpis = getDailyKpis(getRunsForDate(processRuns, '2016-03-20'), dailySummaries);
    const lowDayKpis = getDailyKpis(getRunsForDate(processRuns, '2016-03-07'), dailySummaries);

    expect(baseline).toBeCloseTo(3.06, 2);
    expect(highDayKpis.baselineFailureRate).toBe(baseline);
    expect(lowDayKpis.baselineFailureRate).toBe(baseline);
  });

  it('returns Epic Radiant Orders history with seven failures through March 20', () => {
    const history = getProcessHistory(processHistory, 'Epic Radiant Orders');

    expect(history.filter((run) => run.status === 'Failed')).toHaveLength(7);
    expect(history.some((run) => run.date === '2016-03-20')).toBe(true);
  });

  it('uses summary failed task count when selected date has no process run details', () => {
    const copiedSummaries = dailySummaries.map((summary) => ({ ...summary }));
    const kpis = getDailyKpis([], copiedSummaries, '2016-03-13');

    expect(kpis.failureRate).toBe(7.1);
    expect(kpis.failedTasks).toBe(5);
    expect(kpis.delayedTasks).toBe(0);
  });
});
