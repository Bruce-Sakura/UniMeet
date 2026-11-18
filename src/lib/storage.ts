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

export function loadState(): SplitNestState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return EMPTY_STATE;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return EMPTY_STATE;
    }
    const household = isValidHousehold(parsed.household) ? parsed.household : null;
    if (!household) {
      return EMPTY_STATE;
    }
    const expenses = Array.isArray(parsed.expenses)
      ? parsed.expenses.filter(isValidExpense)
      : [];
    return { household, expenses };
  } catch {
    return EMPTY_STATE;
  }
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
