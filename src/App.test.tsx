import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { clearState } from './lib/storage';

describe('SplitNest UI integration', () => {
  beforeEach(() => {
    clearState();
  });

  it('shows inline household setup error without clearing entered values', async () => {
    const user = userEvent.setup();
    render(<App />);

    const householdInput = screen.getByLabelText(/household name/i);
    const member1Input = screen.getByLabelText(/housemate 1 name/i);
    const member2Input = screen.getByLabelText(/housemate 2 name/i);

    await user.type(householdInput, '42 Oakfield Road');
    await user.type(member1Input, 'Alice');
    await user.type(member2Input, 'alice');
    await user.click(screen.getByRole('button', { name: /create household/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/distinct/i);
    expect(householdInput).toHaveValue('42 Oakfield Road');
    expect(member1Input).toHaveValue('Alice');
    expect(member2Input).toHaveValue('alice');
  });

  it('handles setup, invalid expense input retention, £60 3-way split, refresh persistence, and deletion', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    // 1. Setup household with Alice, Bob, Charlie
    await user.type(screen.getByLabelText(/household name/i), 'Oakfield House');
    await user.click(screen.getByRole('button', { name: /\+ add housemate/i }));
    await user.type(screen.getByLabelText(/housemate 1 name/i), 'Alice');
    await user.type(screen.getByLabelText(/housemate 2 name/i), 'Bob');
    await user.type(screen.getByLabelText(/housemate 3 name/i), 'Charlie');
    await user.click(screen.getByRole('button', { name: /create household/i }));

    expect(screen.getByRole('heading', { name: 'Oakfield House' })).toBeInTheDocument();

    // 2. Submit invalid expense (missing payer) -> shows inline error without clearing inputs
    const descInput = screen.getByLabelText(/description/i);
    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(descInput, 'House groceries');
    await user.type(amountInput, '60');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/select a valid housemate/i);
    expect(descInput).toHaveValue('House groceries');
    expect(amountInput).toHaveValue('60');

    // 3. Select Alice as payer and submit £60 split across Alice, Bob, Charlie
    await user.selectOptions(screen.getByLabelText(/paid by/i), 'Alice');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    const balancesSection = screen.getByRole('region', { name: /net balances/i });
    expect(within(balancesSection).getByText(/is owed £40\.00/i)).toBeInTheDocument();
    expect(within(balancesSection).getAllByText(/owes £20\.00/i)).toHaveLength(2);

    // 4. Unmount and re-render to simulate browser refresh -> restored from localStorage
    unmount();
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Oakfield House' })).toBeInTheDocument();
    expect(screen.getByText('House groceries')).toBeInTheDocument();
    const restoredBalances = screen.getByRole('region', { name: /net balances/i });
    expect(within(restoredBalances).getByText(/is owed £40\.00/i)).toBeInTheDocument();

    // 5. Delete expense -> balances immediately recalculate to settled (£0.00)
    await user.click(screen.getByRole('button', { name: /delete house groceries/i }));
    expect(screen.queryByText('House groceries')).not.toBeInTheDocument();
    expect(within(restoredBalances).getAllByText(/settled \(£0\.00\)/i)).toHaveLength(3);
  });

  it('surfaces storage read failure alert without wiping storage when loadState fails', async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage access denied');
    });
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    render(<App />);

    expect(screen.getByRole('alert')).toHaveTextContent(/unable to access browser storage/i);
    expect(removeItemSpy).not.toHaveBeenCalled();

    getItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });
});
