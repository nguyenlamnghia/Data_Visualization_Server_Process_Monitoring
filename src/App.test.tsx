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

  it('updates the placeholder count when search filters the selected date', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText('6 processes match the active filters.')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/search/i), 'radiant');

    expect(screen.getByText('1 processes match the active filters.')).toBeInTheDocument();
  });

  it('can switch the type filter to Workbook and update the placeholder count', async () => {
    const user = userEvent.setup();

    render(<App />);

    const typeFilter = screen.getByLabelText(/select type/i);
    await user.selectOptions(typeFilter, 'All');
    expect(screen.getByText('12 processes match the active filters.')).toBeInTheDocument();

    await user.selectOptions(typeFilter, 'Workbook');

    expect(screen.getByText('6 processes match the active filters.')).toBeInTheDocument();
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
});
