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

export function calculateAverageFailureRate(
  summaries: DailyFailureSummary[],
  selectedDate?: string,
): number {
  const relevant = selectedDate
    ? summaries.filter((summary) => summary.date !== selectedDate)
    : summaries;
  if (relevant.length === 0) {
    return 0;
  }
  const total = relevant.reduce((sum, summary) => sum + summary.failureRate, 0);
  return Number((total / relevant.length).toFixed(2));
}

export function getDailyKpis(
  runs: ProcessRun[],
  summaries: DailyFailureSummary[],
  date = '2016-03-20',
): DailyKpis {
  const summary = summaries.find((item) => item.date === date) ?? summaries[summaries.length - 1];
  if (!summary) {
    return {
      failureRate: 0,
      failedTasks: 0,
      delayedTasks: 0,
      totalTasks: 0,
      baselineFailureRate: 0,
    };
  }
  const delayedTasks = runs.filter(
    (run) => run.durationMinutes > run.averageDurationMinutes * 1.5,
  ).length;
  return {
    failureRate: summary.failureRate,
    failedTasks: summary.failedTasks,
    delayedTasks,
    totalTasks: summary.totalTasks,
    baselineFailureRate: calculateAverageFailureRate(summaries, summary.date),
  };
}

export function getProcessHistory(
  history: ProcessHistoryRun[],
  processName: string,
): ProcessHistoryRun[] {
  return history.filter((run) => run.processName === processName);
}
