import type { ExpenseShare } from '../types/splitnest';

const MAX_AMOUNT_PENCE = 100_000_000; // £1,000,000.00 upper bound

/**
 * Parses a user-entered GBP string (e.g. "60", "£60.00", "12.5") into integer pence.
 * Returns null if invalid, non-positive, or has more than 2 decimal places.
 */
export function parseGbpToPence(rawInput: string): number | null {
  const cleaned = rawInput.trim().replace(/^£\s*/, '').trim();
  if (!/^(?:\d+(?:\.\d{1,2})?|\.\d{1,2})$/.test(cleaned)) {
    return null;
  }

  const [wholeStr = '0', fracStr = ''] = cleaned.split('.');
  const wholePounds = Number.parseInt(wholeStr || '0', 10);
  const pennies = Number.parseInt(fracStr.padEnd(2, '0'), 10);

  if (!Number.isSafeInteger(wholePounds) || !Number.isSafeInteger(pennies)) {
    return null;
  }

  const totalPence = wholePounds * 100 + pennies;
  if (!Number.isSafeInteger(totalPence) || totalPence <= 0 || totalPence > MAX_AMOUNT_PENCE) {
    return null;
  }

  return totalPence;
}

/**
 * Formats integer pence into a GBP display string (e.g. 4000 -> "£40.00", -2000 -> "-£20.00").
 */
export function formatPenceToGbp(pence: number): string {
  const truncated = Math.trunc(pence);
  const sign = truncated < 0 ? '-' : '';
  const absPence = Math.abs(truncated);
  const pounds = Math.floor(absPence / 100);
  const pennies = String(absPence % 100).padStart(2, '0');
  return `${sign}£${pounds.toLocaleString('en-GB')}.${pennies}`;
}

/**
 * Deterministically splits an integer pence total equally across participants.
 * Any leftover pennies (amountPence % count) go 1p each to the earliest participants in rosterOrder.
 */
export function splitEvenlyPence(
  amountPence: number,
  participantIds: string[],
  rosterOrder: string[],
): ExpenseShare[] {
  if (!Number.isInteger(amountPence) || amountPence <= 0) {
    throw new Error('Expense amountPence must be a positive integer.');
  }

  const uniqueIds = Array.from(new Set(participantIds));
  if (uniqueIds.length === 0) {
    throw new Error('At least one participant is required to split an expense.');
  }

  const orderIndex = new Map(rosterOrder.map((id, index) => [id, index]));
  const orderedIds = [...uniqueIds].sort((a, b) => {
    const idxA = orderIndex.get(a) ?? Number.MAX_SAFE_INTEGER;
    const idxB = orderIndex.get(b) ?? Number.MAX_SAFE_INTEGER;
    return idxA !== idxB ? idxA - idxB : a.localeCompare(b);
  });

  const count = orderedIds.length;
  const baseShare = Math.floor(amountPence / count);
  const remainder = amountPence % count;

  return orderedIds.map((memberId, index) => ({
    memberId,
    amountPence: baseShare + (index < remainder ? 1 : 0),
  }));
}
