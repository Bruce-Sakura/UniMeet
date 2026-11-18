export interface Housemate {
  id: string;
  name: string;
}

export interface Household {
  name: string;
  members: Housemate[];
}

export interface ExpenseShare {
  memberId: string;
  amountPence: number;
}

export interface Expense {
  id: string;
  description: string;
  amountPence: number;
  payerId: string;
  participantIds: string[];
  createdAt: string;
}

export interface HousemateBalance {
  memberId: string;
  memberName: string;
  paidPence: number;
  sharePence: number;
  netPence: number;
}

export interface SplitNestState {
  household: Household | null;
  expenses: Expense[];
}

export type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: string };
