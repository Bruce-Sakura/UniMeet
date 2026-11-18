import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { clearState, saveState } from '../lib/storage';

describe('SplitNest Premium Dashboard Features', () => {
  beforeEach(() => {
    clearState();
    saveState({
      household: {
        name: '42 Elm Street',
        members: [
          { id: 'm1', name: 'Alice' },
          { id: 'm2', name: 'Bob' },
          { id: 'm3', name: 'Charlie' },
        ],
      },
      expenses: [
        {
          id: 'e1',
          description: 'Weekly groceries',
          amountPence: 6000,
          payerId: 'm1',
          participantIds: ['m1', 'm2', 'm3'],
          createdAt: new Date().toISOString(),
        },
      ],
    });
  });

  it('renders KPI metrics cards on dashboard correctly', () => {
    render(<App />);

    expect(screen.getByText(/total spend/i)).toBeInTheDocument();
    expect(screen.getAllByText('£60.00').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/settlement status/i)).toBeInTheDocument();
    expect(screen.getAllByText('£40.00').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/avg share \/ person/i)).toBeInTheDocument();
    expect(screen.getAllByText('£20.00').length).toBeGreaterThanOrEqual(1);
  });

  it('switches between sidebar navigation tabs', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click Housemates tab
    await user.click(screen.getByRole('button', { name: /housemates/i }));
    expect(screen.getByRole('heading', { name: /housemates directory/i })).toBeInTheDocument();

    // Click Settings tab
    await user.click(screen.getByRole('button', { name: /settings/i }));
    expect(screen.getByRole('heading', { name: /household settings/i })).toBeInTheDocument();

    // Click Dashboard tab
    await user.click(screen.getByRole('button', { name: /dashboard/i }));
    expect(screen.getByRole('region', { name: /net balances/i })).toBeInTheDocument();
  });

  it('provides safe two-step household ledger reset with cancellation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /settings/i }));
    const resetBtn = screen.getByRole('button', { name: /reset household ledger/i });
    await user.click(resetBtn);

    expect(screen.getByText(/are you absolutely certain/i)).toBeInTheDocument();

    // Cancel reset
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByText(/are you absolutely certain/i)).not.toBeInTheDocument();

    // Re-open and confirm reset
    await user.click(screen.getByRole('button', { name: /reset household ledger/i }));
    await user.click(screen.getByRole('button', { name: /confirm & reset everything/i }));

    // Should return to setup onboarding screen
    expect(screen.getByRole('button', { name: /create household/i })).toBeInTheDocument();
  });

  it('loads 3-person sample data when requested from setup onboarding', async () => {
    const user = userEvent.setup();
    clearState();
    render(<App />);

    const loadSampleBtn = screen.getByRole('button', { name: /load 3-person sample data/i });
    await user.click(loadSampleBtn);

    expect(screen.getByRole('heading', { name: '42 Oakfield Road' })).toBeInTheDocument();
    expect(screen.getByText("Weekly Sainsbury's groceries")).toBeInTheDocument();
    expect(screen.getByText('Virgin Media Fibre Broadband')).toBeInTheDocument();
    expect(screen.getByText('Household essentials & cleaning')).toBeInTheDocument();
  });
});
