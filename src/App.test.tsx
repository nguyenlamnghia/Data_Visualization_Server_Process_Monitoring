import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the dashboard header, KPIs, and March 20 overview state', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /server process monitoring/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/6.7%/)).toBeInTheDocument();
    expect(screen.getByText(/Failed Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Last 14 days/i)).toBeInTheDocument();
  });
});
