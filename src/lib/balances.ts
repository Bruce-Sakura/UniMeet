import type {
  Expense,
  ExpenseShare,
  Household,
  HousemateBalance,
} from '../types/splitnest';
import { splitEvenlyPence } from './money';

/**
 * Computes deterministic shares for a single expense using household roster ordering.
 */
export function getExpenseShares(
  expense: Expense,
  household: Household,
): ExpenseShare[] {
  const rosterOrder = household.members.map((member) => member.id);
  const validIds = new Set(rosterOrder);
  const participants = expense.participantIds.filter((id) => validIds.has(id));

  if (participants.length === 0 || expense.amountPence <= 0) {
    return [];
  }

  return splitEvenlyPence(expense.amountPence, participants, rosterOrder);
}

/**
 * Calculates per-housemate paid, share, and net balances in integer pence.
 * netPence > 0 means the housemate is owed money; netPence < 0 means they owe money.
 */
export function calculateNetBalances(
  household: Household,
  expenses: Expense[],
): HousemateBalance[] {
  const paidByMember = new Map<string, number>();
  const shareByMember = new Map<string, number>();

  for (const member of household.members) {
    paidByMember.set(member.id, 0);
    shareByMember.set(member.id, 0);
  }

  for (const expense of expenses) {
    if (!paidByMember.has(expense.payerId)) {
      continue;
    }
    const shares = getExpenseShares(expense, household);
    if (shares.length === 0) {
      continue;
    }

    paidByMember.set(
      expense.payerId,
      (paidByMember.get(expense.payerId) ?? 0) + expense.amountPence,
    );

    for (const share of shares) {
      shareByMember.set(
        share.memberId,
        (shareByMember.get(share.memberId) ?? 0) + share.amountPence,
      );
    }
  }

  return household.members.map((member) => {
    const paidPence = paidByMember.get(member.id) ?? 0;
    const sharePence = shareByMember.get(member.id) ?? 0;
    return {
      memberId: member.id,
      memberName: member.name,
      paidPence,
      sharePence,
      netPence: paidPence - sharePence,
    };
  });
}
