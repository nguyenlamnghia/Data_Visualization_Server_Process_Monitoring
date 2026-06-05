import type { DailyKpis } from '../lib/dashboardMetrics';

interface KpiStripProps {
  kpis: DailyKpis;
}

export function KpiStrip({ kpis }: KpiStripProps) {
  const cards = [
    { label: 'Failure Rate', value: `${kpis.failureRate.toFixed(1)}%`, tone: 'danger' },
    { label: 'Failed Tasks', value: String(kpis.failedTasks), tone: 'danger' },
    { label: 'Delayed Tasks', value: String(kpis.delayedTasks), tone: 'warning' },
    { label: '14-Day Avg', value: `${kpis.baselineFailureRate.toFixed(1)}%`, tone: 'neutral' },
  ];

  return (
    <section className="kpi-strip" aria-label="Selected day key metrics">
      {cards.map((card) => (
        <article className={`kpi-card ${card.tone}`} key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}
