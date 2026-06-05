import { formatDuration, formatTimeLabel } from '../lib/time';
import type { ProcessRun } from '../types';

interface ProcessTooltipProps {
  run: ProcessRun;
  onViewTask: (run: ProcessRun) => void;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'short',
  day: 'numeric',
});

export function ProcessTooltip({ run, onViewTask }: ProcessTooltipProps) {
  return (
    <article className="process-tooltip">
      <header>
        <strong>{run.processName}</strong>
        <span>
          {dateFormatter.format(new Date(`${run.date}T00:00:00Z`))} / {run.status}
        </span>
      </header>
      <dl>
        <div>
          <dt>Start Time</dt>
          <dd>{formatTimeLabel(run.actualStart)}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>
            {formatDuration(run.durationMinutes)} avg {formatDuration(run.averageDurationMinutes)}
          </dd>
        </div>
      </dl>
      {run.errorMessage ? <p className="error-message">{run.errorMessage}</p> : null}
      <button type="button" className="link-button" onClick={() => onViewTask(run)}>
        View Refresh Task
      </button>
    </article>
  );
}
