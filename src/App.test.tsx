import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('renders the dashboard header, KPIs, and March 20 overview state', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /server process monitoring/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Failure Rate').parentElement).toHaveTextContent('6.7%');
    expect(screen.getByText(/Failed Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Last 14 days/i)).toBeInTheDocument();
  });

  it('filters the selected date timeline when search text has no matches', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText(/Epic Radiant Orders/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/search/i), 'missing process');

    expect(screen.getByText(/No processes match the current filters/i)).toBeInTheDocument();
  });

  it('can switch the type filter to Workbook and update visible process labels', async () => {
    const user = userEvent.setup();

    render(<App />);

    const typeFilter = screen.getByLabelText(/select type/i);
    await user.selectOptions(typeFilter, 'All');
    expect(screen.getByText(/Epic Radiant Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/Epic Medication Charges/i)).toBeInTheDocument();

    await user.selectOptions(typeFilter, 'Workbook');

    expect(screen.queryByText(/Epic Radiant Orders/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Epic Medication Charges/i)).toBeInTheDocument();
  });

  it('can select a date with accessible controls and keeps failure averages consistent', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '7 Mar, 1.2% failed' }));

    expect(screen.getByRole('button', { name: '7 Mar, 1.2% failed' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('Failure Rate').parentElement).toHaveTextContent('1.2%');
    expect(screen.getByText('14-Day Avg').parentElement).toHaveTextContent('3.2%');
    expect(
      within(screen.getByRole('region', { name: /14-day failure overview/i })).getByText(
        'Avg 3.2%',
      ),
    ).toBeInTheDocument();
  });

  it('filters processes by search text', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText(/process name/i), 'radiant');
    expect(screen.getByText(/Epic Radiant Orders/i)).toBeInTheDocument();
    expect(screen.queryByText(/Epic Medication Charges/i)).not.toBeInTheDocument();
  });

  it('opens simulated task modal from a failed process', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Epic Radiant Orders/i }));
    await user.click(screen.getByRole('button', { name: /View Refresh Task/i }));
    expect(screen.getByRole('dialog')).toHaveTextContent(/Simulated server task/i);
  });
});
