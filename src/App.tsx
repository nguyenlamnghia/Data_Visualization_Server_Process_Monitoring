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

  const selectedRuns = useMemo(() => getRunsForDate(processRuns, selectedDate), [selectedDate]);
  const visibleRuns = useMemo(
    () =>
      filterProcessRuns(processRuns, {
        date: selectedDate,
        type: typeFilter,
        search,
      }),
    [search, selectedDate, typeFilter],
  );
  const kpis = useMemo(
    () => getDailyKpis(selectedRuns, dailySummaries, selectedDate),
    [selectedDate, selectedRuns],
  );
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
