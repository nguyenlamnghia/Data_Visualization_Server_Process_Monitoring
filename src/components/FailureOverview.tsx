import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyFailureSummary } from '../types';

interface FailureOverviewProps {
  summaries: DailyFailureSummary[];
  selectedDate: string;
  averageFailureRate: number;
  onSelectDate: (date: string) => void;
}

type FailureBarClickData = {
  date?: string;
  payload?: DailyFailureSummary;
};

const dateButtonFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'short',
});

function formatDateButtonLabel(summary: DailyFailureSummary) {
  const dateLabel = dateButtonFormatter.format(new Date(`${summary.date}T00:00:00Z`));
  return `${dateLabel}, ${summary.failureRate.toFixed(1)}% failed`;
}

export function FailureOverview({
  summaries,
  selectedDate,
  averageFailureRate,
  onSelectDate,
}: FailureOverviewProps) {
  const maxFailureRate = Math.max(0, ...summaries.map((summary) => summary.failureRate));
  const yAxisMax = Math.max(8, Math.ceil(maxFailureRate + 1));

  const handleBarClick = (data: unknown) => {
    const clickedData = data as FailureBarClickData;
    const date = clickedData.date ?? clickedData.payload?.date;
    if (date) {
      onSelectDate(date);
    }
  };

  return (
    <section className="overview-section" aria-label="14-day failure overview">
      <div className="section-heading">
        <div>
          <h2>Recent Failure Overview</h2>
          <p>Click a day to inspect process runs for that date.</p>
        </div>
        <span className="baseline-label">Avg {averageFailureRate.toFixed(1)}%</span>
      </div>
      <div className="overview-chart">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={summaries} margin={{ top: 18, right: 18, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e9ee" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis hide domain={[0, yAxisMax]} />
            <Tooltip formatter={(value) => [`${value}%`, 'Failure rate']} />
            <ReferenceLine y={averageFailureRate} stroke="#d71920" strokeDasharray="2 4" />
            <Bar dataKey="failureRate" radius={[4, 4, 0, 0]} onClick={handleBarClick}>
              {summaries.map((entry) => (
                <Cell
                  key={entry.date}
                  fill={entry.date === selectedDate ? '#d71920' : '#f4b4ce'}
                  stroke={entry.date === selectedDate ? '#17212b' : 'transparent'}
                  strokeWidth={entry.date === selectedDate ? 2 : 0}
                  cursor="pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overview-date-strip" aria-label="Select overview date">
        {summaries.map((entry) => {
          const label = formatDateButtonLabel(entry);
          return (
            <button
              type="button"
              className="overview-date-button"
              key={entry.date}
              aria-pressed={entry.date === selectedDate}
              onClick={() => onSelectDate(entry.date)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
