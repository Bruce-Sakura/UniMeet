import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Expense, Household } from '../types/splitnest';
import { calculateNetBalances, getExpenseShares } from './balances';
import { formatPenceToGbp, parseGbpToPence, splitEvenlyPence } from './money';
import { clearState, loadState, loadStateResult, saveState } from './storage';
import { validateExpenseInput, validateHouseholdInput } from './validation';

const threePersonHousehold: Household = {
  name: '42 Oakfield Road',
  members: [
    { id: 'alice', name: 'Alice' },
    { id: 'bob', name: 'Bob' },
    { id: 'charlie', name: 'Charlie' },
  ],
};

describe('money helpers (integer pence)', () => {
  it('parses valid GBP strings into integer pence and rejects invalid values', () => {
    expect(parseGbpToPence('60')).toBe(6000);
    expect(parseGbpToPence('£60.00')).toBe(6000);
    expect(parseGbpToPence(' 19.99 ')).toBe(1999);
    expect(parseGbpToPence('0.01')).toBe(1);
    expect(parseGbpToPence('.50')).toBe(50);

    expect(parseGbpToPence('')).toBeNull();
    expect(parseGbpToPence('0')).toBeNull();
    expect(parseGbpToPence('-10')).toBeNull();
    expect(parseGbpToPence('12.345')).toBeNull();
    expect(parseGbpToPence('abc')).toBeNull();
  });

  it('formats integer pence as GBP currency strings', () => {
    expect(formatPenceToGbp(4000)).toBe('£40.00');
    expect(formatPenceToGbp(-2000)).toBe('-£20.00');
    expect(formatPenceToGbp(5)).toBe('£0.05');
    expect(formatPenceToGbp(0)).toBe('£0.00');
  });

  it('rounds split remainders deterministically in household roster order', () => {
    const roster = ['alice', 'bob', 'charlie'];
    const shares = splitEvenlyPence(1000, ['charlie', 'alice', 'bob'], roster);

    expect(shares).toEqual([
      { memberId: 'alice', amountPence: 334 },
      { memberId: 'bob', amountPence: 333 },
      { memberId: 'charlie', amountPence: 333 },
    ]);
    const sum = shares.reduce((acc, item) => acc + item.amountPence, 0);
    expect(sum).toBe(1000);
  });
});

describe('net balances and £60 three-person case', () => {
  it('computes £60 paid by Alice across 3 housemates: Alice owed £40, Bob & Charlie owe £20 each', () => {
    const expense: Expense = {
      id: 'exp-1',
      description: 'Weekly shop',
      amountPence: 6000,
      payerId: 'alice',
      participantIds: ['alice', 'bob', 'charlie'],
      createdAt: '2026-11-18T12:00:00.000Z',
    };

    const shares = getExpenseShares(expense, threePersonHousehold);
    expect(shares).toEqual([
      { memberId: 'alice', amountPence: 2000 },
      { memberId: 'bob', amountPence: 2000 },
      { memberId: 'charlie', amountPence: 2000 },
    ]);

    const balances = calculateNetBalances(threePersonHousehold, [expense]);
    expect(balances).toEqual([
      {
        memberId: 'alice',
        memberName: 'Alice',
        paidPence: 6000,
        sharePence: 2000,
        netPence: 4000,
      },
      {
        memberId: 'bob',
        memberName: 'Bob',
        paidPence: 0,
        sharePence: 2000,
        netPence: -2000,
      },
      {
        memberId: 'charlie',
        memberName: 'Charlie',
        paidPence: 0,
        sharePence: 2000,
        netPence: -2000,
      },
    ]);
  });

  it('recalculates balances accurately after an expense is deleted', () => {
    const exp1: Expense = {
      id: 'e1',
      description: 'Internet',
      amountPence: 3000,
      payerId: 'alice',
      participantIds: ['alice', 'bob', 'charlie'],
      createdAt: '2026-11-18T12:00:00.000Z',
    };
    const exp2: Expense = {
      id: 'e2',
      description: 'Milk & bread',
      amountPence: 1000,
      payerId: 'bob',
      participantIds: ['alice', 'bob'],
      createdAt: '2026-11-18T13:00:00.000Z',
    };

    const combined = calculateNetBalances(threePersonHousehold, [exp1, exp2]);
    expect(combined.map((b) => b.netPence)).toEqual([1500, -500, -1000]);

    const afterDelete = calculateNetBalances(threePersonHousehold, [exp1]);
    expect(afterDelete.map((b) => b.netPence)).toEqual([2000, -1000, -1000]);
  });
});

describe('validation and localStorage persistence', () => {
  beforeEach(() => {
    clearState();
  });

  it('enforces household name and >= 2 distinct non-empty housemate names', () => {
    expect(validateHouseholdInput('', ['Alice', 'Bob']).valid).toBe(false);
    expect(validateHouseholdInput('Oak House', ['Alice']).valid).toBe(false);
    expect(validateHouseholdInput('Oak House', ['Alice', '  ']).valid).toBe(false);
    expect(validateHouseholdInput('Oak House', ['Alice', 'alice']).valid).toBe(false);
    expect(validateHouseholdInput('Oak House', ['Alice', 'Bob']).valid).toBe(true);
  });

  it('enforces expense description, positive GBP, valid payer, and >= 1 participant', () => {
    expect(
      validateExpenseInput(
        { description: '', amountInput: '20', payerId: 'alice', participantIds: ['alice'] },
        threePersonHousehold,
      ).valid,
    ).toBe(false);
    expect(
      validateExpenseInput(
        { description: 'Gas', amountInput: '-5', payerId: 'alice', participantIds: ['alice'] },
        threePersonHousehold,
      ).valid,
    ).toBe(false);
    expect(
      validateExpenseInput(
        { description: 'Gas', amountInput: '20', payerId: 'nobody', participantIds: ['alice'] },
        threePersonHousehold,
      ).valid,
    ).toBe(false);
    expect(
      validateExpenseInput(
        { description: 'Gas', amountInput: '20', payerId: 'alice', participantIds: [] },
        threePersonHousehold,
      ).valid,
    ).toBe(false);
  });

  it('saves and restores household and expenses from localStorage', () => {
    const state = {
      household: threePersonHousehold,
      expenses: [
        {
          id: 'exp-1',
          description: 'Broadband',
          amountPence: 3600,
          payerId: 'alice',
          participantIds: ['alice', 'bob', 'charlie'],
          createdAt: '2026-11-18T12:00:00.000Z',
        },
      ],
    };
    saveState(state);
    expect(loadState()).toEqual(state);
  });

  it('returns diagnostic errors and logs on invalid or unreadable stored state', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.setItem('splitnest_state_v1', JSON.stringify({ household: { name: 'Empty' } }));
    const result = loadStateResult();
    expect(result.error).toBe('Saved household data is invalid.');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('invalid household schema'));
    errorSpy.mockRestore();
  });
});
