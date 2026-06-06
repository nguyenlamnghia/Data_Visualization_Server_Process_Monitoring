import { useMemo, useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { DemoTaskModal } from './components/DemoTaskModal';
import { FailureOverview } from './components/FailureOverview';
import { KpiStrip } from './components/KpiStrip';
import { ProcessHistory } from './components/ProcessHistory';
import { ProcessTimeline } from './components/ProcessTimeline';
import { DEFAULT_DATE, dailySummaries, processHistory, processRuns } from './data/mockServerData';
import {
  calculateAverageFailureRate,
  filterProcessRuns,
  getDailyKpis,
  getProcessHistory,
  getRunsForDate,
} from './lib/dashboardMetrics';
import type { ProcessFilter, ProcessRun } from './types';

const selectedDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

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
    () => calculateAverageFailureRate(dailySummaries),
    [],
  );
  const selectedHistory = useMemo(
    () => (selectedProcess ? getProcessHistory(processHistory, selectedProcess.processName) : []),
    [selectedProcess],
  );
  const selectedSummary = dailySummaries.find((summary) => summary.date === selectedDate);
  const selectedDateLabel = selectedSummary
    ? selectedDateFormatter.format(new Date(`${selectedSummary.date}T00:00:00Z`))
    : selectedDateFormatter.format(new Date(`${selectedDate}T00:00:00Z`));

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
        dateLabel={selectedDateLabel}
        selectedProcessId={selectedProcess?.id}
        onSelectProcess={setSelectedProcess}
        onViewTask={setTaskModalRun}
      />
      {selectedProcess ? (
        <ProcessHistory processName={selectedProcess.processName} runs={selectedHistory} />
      ) : null}
      <DemoTaskModal run={taskModalRun} onClose={() => setTaskModalRun(null)} />
    </main>
  );
}
