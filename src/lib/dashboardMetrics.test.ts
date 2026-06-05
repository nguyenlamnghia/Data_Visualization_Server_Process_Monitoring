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
