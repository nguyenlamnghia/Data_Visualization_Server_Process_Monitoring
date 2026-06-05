import { useMemo, useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { FailureOverview } from './components/FailureOverview';
import { KpiStrip } from './components/KpiStrip';
import { DEFAULT_DATE, dailySummaries, processRuns } from './data/mockServerData';
import {
  calculateAverageFailureRate,
  filterProcessRuns,
  getDailyKpis,
  getRunsForDate,
} from './lib/dashboardMetrics';
import type { ProcessFilter } from './types';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

export default function App() {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ProcessFilter>('Datasource');

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
  const averageFailureRate = useMemo(() => calculateAverageFailureRate(dailySummaries), []);
  const selectedDateLabel = dateFormatter.format(new Date(`${selectedDate}T00:00:00Z`));

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
        onSelectDate={setSelectedDate}
      />
      <section className="timeline-placeholder">
        <h2>Showing: {selectedDateLabel}</h2>
        <p>{visibleRuns.length} processes match the active filters.</p>
      </section>
    </main>
  );
}
