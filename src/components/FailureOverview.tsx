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

export function FailureOverview({
  summaries,
  selectedDate,
  averageFailureRate,
  onSelectDate,
}: FailureOverviewProps) {
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
            <YAxis hide domain={[0, 8]} />
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
    </section>
  );
}
