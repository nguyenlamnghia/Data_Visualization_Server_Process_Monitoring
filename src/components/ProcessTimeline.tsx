import { useState } from 'react';
import { formatDuration, widthForDuration, xForTime } from '../lib/time';
import type { ProcessRun, TimelineScale } from '../types';
import { EmptyState } from './EmptyState';
import { ProcessTooltip } from './ProcessTooltip';

interface ProcessTimelineProps {
  runs: ProcessRun[];
  dateLabel: string;
  selectedProcessId?: string;
  onSelectProcess: (run: ProcessRun) => void;
  onViewTask: (run: ProcessRun) => void;
}

const scale: TimelineScale = { startHour: 5, endHour: 32, width: 1120 };
const chartLeft = 220;
const rowHeight = 34;
const chartTop = 36;
const chartRightPadding = 180;

function hourLabel(hour: number): string {
  const normalized = hour % 24;
  const suffix = normalized >= 12 ? 'PM' : 'AM';
  const twelveHour = normalized % 12 || 12;
  return `${twelveHour} ${suffix}`;
}

export function ProcessTimeline({
  runs,
  dateLabel,
  selectedProcessId,
  onSelectProcess,
  onViewTask,
}: ProcessTimelineProps) {
  const [hoveredProcessId, setHoveredProcessId] = useState<string | null>(null);
  const selectedRun = runs.find((run) => run.id === selectedProcessId) ?? null;
  const hoveredRun = runs.find((run) => run.id === hoveredProcessId) ?? null;
  const activeTooltipRun = hoveredRun ?? selectedRun;
  const height = chartTop + runs.length * rowHeight + 44;
  const width = chartLeft + scale.width + chartRightPadding;
  const axisHours = Array.from(
    { length: scale.endHour - scale.startHour + 1 },
    (_, index) => scale.startHour + index,
  );

  if (runs.length === 0) {
    return (
      <section className="timeline-section" aria-label="Daily process timeline">
        <div className="section-heading">
          <div>
            <h2>Daily process timeline</h2>
          </div>
        </div>
        <EmptyState
          title="No processes match the current filters"
          message="Adjust search or select another process type."
        />
      </section>
    );
  }

  return (
    <section className="timeline-section" aria-label="Daily process timeline">
      <div className="section-heading">
        <div>
          <h2>Daily process timeline</h2>
          <p>Scheduled refreshes compared with actual start time and average duration.</p>
        </div>
        <span className="showing-banner">Showing: {dateLabel}</span>
      </div>
      <div className="timeline-frame">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Daily process timeline for ${dateLabel}`}
        >
          <rect
            x={chartLeft}
            y={0}
            width={scale.width}
            height={height}
            fill="#fbfcfd"
            stroke="#d9e0e6"
          />
          {axisHours.map((hour) => {
            const x = chartLeft + Math.round(((hour - scale.startHour) / 27) * scale.width);
            const majorHour = hour % 3 === 0 || hour === scale.startHour || hour === scale.endHour;
            return (
              <g key={hour}>
                <line
                  x1={x}
                  x2={x}
                  y1={chartTop - 18}
                  y2={height - 20}
                  stroke={majorHour ? '#c8d1d9' : '#edf1f4'}
                  strokeWidth={1}
                />
                {majorHour ? (
                  <text x={x} y={18} className="axis-label" textAnchor="middle">
                    {hourLabel(hour)}
                  </text>
                ) : null}
              </g>
            );
          })}
          {runs.map((run, index) => {
            const y = chartTop + index * rowHeight;
            const actualX = chartLeft + xForTime(run.actualStart, scale);
            const scheduledX = chartLeft + xForTime(run.scheduledStart, scale);
            const durationWidth = widthForDuration(run.durationMinutes, scale);
            const averageWidth = widthForDuration(run.averageDurationMinutes, scale);
            const selected = run.id === selectedProcessId;
            const failed = run.status === 'Failed';

            return (
              <g
                key={run.id}
                className={selected ? 'timeline-row selected' : 'timeline-row'}
                onMouseEnter={() => setHoveredProcessId(run.id)}
                onMouseLeave={() => setHoveredProcessId(null)}
              >
                <foreignObject
                  x="0"
                  y={y - 11}
                  width={Math.max(120, actualX - 10)}
                  height="28"
                >
                  <button
                    type="button"
                    className={failed ? 'timeline-label failed' : 'timeline-label'}
                    aria-pressed={selected}
                    onClick={() => onSelectProcess(run)}
                  >
                    {run.processName}
                  </button>
                </foreignObject>
                <line
                  x1={scheduledX}
                  x2={scheduledX}
                  y1={y - 9}
                  y2={y + 18}
                  stroke="#7f8d99"
                  strokeDasharray="2 4"
                  strokeWidth={2}
                />
                <line
                  x1={actualX}
                  x2={actualX + averageWidth}
                  y1={y + 16}
                  y2={y + 16}
                  stroke="#596774"
                  strokeWidth={2}
                />
                <rect
                  x={actualX}
                  y={y - 4}
                  width={durationWidth}
                  height={14}
                  rx={3}
                  className={failed ? 'timeline-bar failed' : 'timeline-bar succeeded'}
                  tabIndex={0}
                  role="button"
                  aria-label={`Timeline bar ${run.status}`}
                  onClick={() => onSelectProcess(run)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectProcess(run);
                    }
                  }}
                />
                <text
                  x={Math.min(actualX + durationWidth + 8, chartLeft + scale.width + 116)}
                  y={y + 7}
                  className="duration-label"
                >
                  {formatDuration(run.durationMinutes)}
                </text>
              </g>
            );
          })}
        </svg>
        {activeTooltipRun ? (
          <div className="tooltip-layer">
            <ProcessTooltip run={activeTooltipRun} onViewTask={onViewTask} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
