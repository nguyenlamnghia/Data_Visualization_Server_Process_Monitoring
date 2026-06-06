import { formatDuration, widthForDuration, xForTime } from '../lib/time';
import type { ProcessHistoryRun, TimelineScale } from '../types';
import { EmptyState } from './EmptyState';

interface ProcessHistoryProps {
  processName: string;
  runs: ProcessHistoryRun[];
}

const scale: TimelineScale = { startHour: 5, endHour: 32, width: 1040 };
const chartLeft = 150;
const rowHeight = 24;
const chartTop = 32;

export function ProcessHistory({ processName, runs }: ProcessHistoryProps) {
  if (runs.length === 0) {
    return (
      <section className="history-section">
        <EmptyState title="No history available" message="This simulated process has no previous runs." />
      </section>
    );
  }

  const failureCount = runs.filter((run) => run.status === 'Failed').length;
  const height = chartTop + runs.length * rowHeight + 18;
  const ticks = [5, 8, 11, 14, 17, 20, 23, 26].map((hour) => ({
    hour,
    x: chartLeft + ((hour - scale.startHour) / (scale.endHour - scale.startHour)) * scale.width,
    label: new Date(2016, 2, hour >= 24 ? 21 : 20, hour % 24)
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase(),
  }));

  return (
    <section className="history-section" aria-label={`${processName} history`}>
      <div className="section-heading">
        <div>
          <h2>{processName}: summary</h2>
          <p>{failureCount} failures in the previous month</p>
        </div>
      </div>
      <div className="history-frame">
        <svg viewBox={`0 0 1230 ${height}`} role="img" aria-label={`${processName} one-month history`}>
          <rect
            x={chartLeft + Math.round(((8 - scale.startHour) / (scale.endHour - scale.startHour)) * scale.width)}
            y={chartTop - 14}
            width={Math.round(((17 - 8) / (scale.endHour - scale.startHour)) * scale.width)}
            height={height - chartTop}
            fill="var(--work-window)"
          />
          {ticks.map((tick) => (
            <g key={tick.hour}>
              <line x1={tick.x} y1={chartTop - 16} x2={tick.x} y2={height - 12} stroke="#dce3e8" strokeDasharray="2 4" />
              <text x={tick.x} y={18} textAnchor="middle" className="axis-label">
                {tick.label}
              </text>
            </g>
          ))}
          {runs.map((run, index) => {
            const y = chartTop + index * rowHeight;
            const x = chartLeft + xForTime(run.actualStart, scale);
            const width = widthForDuration(run.durationMinutes, scale);
            const failed = run.status === 'Failed';
            const averageX = x + widthForDuration(run.averageDurationMinutes, scale);
            return (
              <g key={run.id}>
                <text x={0} y={y + 14} className="history-date">
                  {new Date(`${run.date}T00:00:00`).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </text>
                <line x1={chartLeft} x2={chartLeft + scale.width} y1={y + 10} y2={y + 10} stroke="#f0f3f6" />
                <line x1={averageX} x2={averageX} y1={y + 2} y2={y + 18} stroke="#17212b" strokeWidth={failed ? 2 : 1} />
                <rect
                  x={x}
                  y={y + 4}
                  width={width}
                  height={10}
                  rx={2}
                  fill={failed ? 'var(--danger)' : 'var(--success)'}
                />
                {failed ? (
                  <text x={x + width + 8} y={y + 14} className="duration-label failed">
                    {formatDuration(run.durationMinutes)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
