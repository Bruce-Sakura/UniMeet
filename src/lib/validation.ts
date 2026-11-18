import type { Household, ValidationResult } from '../types/splitnest';
import { parseGbpToPence } from './money';

export interface ValidatedHouseholdInput {
  householdName: string;
  memberNames: string[];
}

export interface RawExpenseInput {
  description: string;
  amountInput: string;
  payerId: string;
  participantIds: string[];
}

export interface ValidatedExpenseInput {
  description: string;
  amountPence: number;
  payerId: string;
  participantIds: string[];
}

/**
 * Validates household setup: requires a non-empty household name and
 * at least two non-empty, case-insensitively distinct housemate names.
 */
export function validateHouseholdInput(
  rawHouseholdName: string,
  rawMemberNames: string[],
): ValidationResult<ValidatedHouseholdInput> {
  const householdName = rawHouseholdName.trim();
  if (!householdName) {
    return { valid: false, error: 'Enter a household name.' };
  }

  const trimmedMembers = rawMemberNames.map((name) => name.trim());
  if (trimmedMembers.some((name) => name.length === 0)) {
    return {
      valid: false,
      error: 'Every housemate row must have a non-empty name (or remove blank rows).',
    };
  }

  if (trimmedMembers.length < 2) {
    return {
      valid: false,
      error: 'Add at least two housemates to split expenses.',
    };
  }

  const seen = new Set<string>();
  for (const name of trimmedMembers) {
    const key = name.toLowerCase();
    if (seen.has(key)) {
      return {
        valid: false,
        error: `Housemate names must be distinct ("${name}" is listed more than once).`,
      };
    }
    seen.add(key);
  }

  return {
    valid: true,
    value: { householdName, memberNames: trimmedMembers },
  };
}

/**
 * Validates new expense input against household members.
 */
export function validateExpenseInput(
  input: RawExpenseInput,
  household: Household,
): ValidationResult<ValidatedExpenseInput> {
  const description = input.description.trim();
  if (!description) {
    return { valid: false, error: 'Enter an expense description.' };
  }

  const amountPence = parseGbpToPence(input.amountInput);
  if (amountPence === null) {
    return {
      valid: false,
      error: 'Enter a positive GBP amount with up to 2 decimal places (e.g. 60 or 14.50).',
    };
  }

  const memberIds = new Set(household.members.map((member) => member.id));
  if (!input.payerId || !memberIds.has(input.payerId)) {
    return { valid: false, error: 'Select a valid housemate who paid.' };
  }

  const rosterOrder = household.members.map((member) => member.id);
  const selectedSet = new Set(
    input.participantIds.filter((id) => memberIds.has(id)),
  );
  const participantIds = rosterOrder.filter((id) => selectedSet.has(id));

  if (participantIds.length === 0) {
    return {
      valid: false,
      error: 'Select at least one housemate participating in this expense.',
    };
  }

  return {
    valid: true,
    value: {
      description,
      amountPence,
      payerId: input.payerId,
      participantIds,
    },
  };
}
