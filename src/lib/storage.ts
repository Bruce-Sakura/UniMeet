import type { Expense, Household, SplitNestState } from '../types/splitnest';

export const STORAGE_KEY = 'splitnest_state_v1';

const EMPTY_STATE: SplitNestState = {
  household: null,
  expenses: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidHousehold(value: unknown): value is Household {
  if (!isRecord(value) || typeof value.name !== 'string' || !value.name.trim()) {
    return false;
  }
  if (!Array.isArray(value.members) || value.members.length < 2) {
    return false;
  }
  return value.members.every(
    (m) =>
      isRecord(m) &&
      typeof m.id === 'string' &&
      m.id.length > 0 &&
      typeof m.name === 'string' &&
      m.name.trim().length > 0,
  );
}

function isValidExpense(value: unknown): value is Expense {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.id === 'string' &&
    typeof value.description === 'string' &&
    value.description.trim().length > 0 &&
    typeof value.amountPence === 'number' &&
    Number.isInteger(value.amountPence) &&
    value.amountPence > 0 &&
    typeof value.payerId === 'string' &&
    Array.isArray(value.participantIds) &&
    value.participantIds.length > 0 &&
    value.participantIds.every((id) => typeof id === 'string') &&
    typeof value.createdAt === 'string'
  );
}

export interface LoadStateResult {
  state: SplitNestState;
  error: string | null;
}

export function loadStateResult(): LoadStateResult {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { state: EMPTY_STATE, error: null };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      console.error('Failed to parse SplitNest state from localStorage: root is not an object');
      return { state: EMPTY_STATE, error: 'Saved ledger data is corrupted.' };
    }
    const household = isValidHousehold(parsed.household) ? parsed.household : null;
    if (!household) {
      console.error('Failed to parse SplitNest state from localStorage: invalid household schema');
      return { state: EMPTY_STATE, error: 'Saved household data is invalid.' };
    }
    const expenses = Array.isArray(parsed.expenses)
      ? parsed.expenses.filter(isValidExpense)
      : [];
    return { state: { household, expenses }, error: null };
  } catch (error) {
    console.error('Failed to read SplitNest state from localStorage:', error);
    return {
      state: EMPTY_STATE,
      error: 'Unable to access browser storage; saved ledger data could not be loaded.',
    };
  }
}

export function loadState(): SplitNestState {
  return loadStateResult().state;
}

export function saveState(state: SplitNestState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Failed to persist SplitNest state to localStorage:', error);
    return false;
  }
}

export function clearState(): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear SplitNest state from localStorage:', error);
    return false;
  }
}
