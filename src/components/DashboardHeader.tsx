import type { ProcessFilter } from '../types';

interface DashboardHeaderProps {
  search: string;
  typeFilter: ProcessFilter;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: ProcessFilter) => void;
}

export function DashboardHeader({
  search,
  typeFilter,
  onSearchChange,
  onTypeFilterChange,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>Server Process Monitoring</h1>
        <p>Overnight Tableau Server refresh status for healthcare analytics processes.</p>
      </div>
      <div className="dashboard-controls" aria-label="Dashboard controls">
        <label>
          Search
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Process name"
          />
        </label>
        <label>
          Select Type
          <select
            value={typeFilter}
            onChange={(event) => onTypeFilterChange(event.target.value as ProcessFilter)}
          >
            <option value="Datasource">Datasource</option>
            <option value="Workbook">Workbook</option>
            <option value="All">All</option>
          </select>
        </label>
        <label>
          started_at (EST)
          <select value="Last 14 days" disabled>
            <option>Last 14 days</option>
          </select>
        </label>
      </div>
    </header>
  );
}
