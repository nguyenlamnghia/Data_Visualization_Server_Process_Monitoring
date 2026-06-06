import type { DailyFailureSummary } from '../types';

interface FailureOverviewProps {
  summaries: DailyFailureSummary[];
  selectedDate: string;
  averageFailureRate: number;
  onSelectDate: (date: string) => void;
}

const dateButtonFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'short',
});

function formatDateLabel(summary: DailyFailureSummary) {
  return dateButtonFormatter.format(new Date(`${summary.date}T00:00:00Z`));
}

const chartHeight = 120;
const topPadding = 22;

export function FailureOverview({
  summaries,
  selectedDate,
  averageFailureRate,
  onSelectDate,
}: FailureOverviewProps) {
  const maxFailureRate = Math.max(8, ...summaries.map((summary) => summary.failureRate));
  const usableHeight = chartHeight - topPadding;
  const heightFor = (rate: number) => Math.max(4, (rate / maxFailureRate) * usableHeight);
  const averageY = topPadding + (usableHeight - (averageFailureRate / maxFailureRate) * usableHeight);

  return (
    <section className="overview-section" aria-label="14-day failure overview">
      <div className="section-heading">
        <div>
          <h2>Recent Failure Overview</h2>
          <p>Click a day to inspect process runs for that date.</p>
        </div>
        <span className="baseline-label">Avg {averageFailureRate.toFixed(1)}%</span>
      </div>
      <div className="overview-strip" aria-label="Select overview date">
        {summaries.map((summary) => {
          const selected = summary.date === selectedDate;
          const barHeight = heightFor(summary.failureRate);
          return (
            <button
              type="button"
              key={summary.date}
              className={selected ? 'overview-day selected' : 'overview-day'}
              aria-pressed={selected}
              aria-label={`${formatDateLabel(summary)}, ${summary.failureRate.toFixed(1)}% failed`}
              onClick={() => onSelectDate(summary.date)}
            >
              <span className="overview-day-chart" style={{ height: `${chartHeight}px` }}>
                <span className="overview-pct">{summary.failureRate.toFixed(1)}%</span>
                <span
                  className="overview-bar"
                  style={{ height: `${barHeight}px` }}
                  aria-hidden="true"
                />
                <span
                  className="overview-average-line"
                  style={{ top: `${averageY}px` }}
                  aria-hidden="true"
                />
              </span>
              <span className="overview-day-label">{formatDateLabel(summary)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
