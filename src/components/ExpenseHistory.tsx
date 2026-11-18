import type { Expense, Household } from '../types/splitnest';
import { getExpenseShares } from '../lib/balances';
import { formatPenceToGbp } from '../lib/money';

interface ExpenseHistoryProps {
  household: Household;
  expenses: Expense[];
  onDeleteExpense: (expenseId: string) => void;
}

export function ExpenseHistory({
  household,
  expenses,
  onDeleteExpense,
}: ExpenseHistoryProps) {
  const memberNameById = new Map(
    household.members.map((member) => [member.id, member.name]),
  );

  return (
    <section
      aria-labelledby="expense-history-heading"
      className="rounded-2xl border border-[#dcdccf] bg-[#fdfcf7] p-6 shadow-[0_2px_12px_rgba(43,54,44,0.04)]"
    >
      <div className="flex items-center justify-between border-b border-[#ece9dc] pb-4">
        <div>
          <div className="text-[10px] font-medium tracking-[0.2em] text-[#717b6a] uppercase">
            Ledger Journal
          </div>
          <h2
            id="expense-history-heading"
            className="mt-1 font-serif text-xl font-normal text-[#2b362c]"
          >
            Expense history
          </h2>
        </div>
        <span className="rounded-full border border-[#dadcca] bg-[#f5f3ea] px-3 py-0.5 font-mono text-xs text-[#717b6a]">
          {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {expenses.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-[#dadcca] bg-[#faf8f2] px-6 py-12 text-center">
          <p className="font-serif text-lg text-[#6e7568]">
            No expenses recorded in the ledger yet
          </p>
          <p className="mt-1 text-xs text-[#8e9587]">
            Log shared bills or groceries to see exact equal splits and real-time balances.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {expenses.map((expense) => {
            const payerName =
              memberNameById.get(expense.payerId) ?? 'Housemate';
            const shares = getExpenseShares(expense, household);

            return (
              <li
                key={expense.id}
                className="rounded-xl border border-[#ece9dc] bg-white p-4.5 transition hover:border-[#dadcca] hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-[#2b362c]">
                      {expense.description}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#717b6a]">
                      Paid by <span className="font-medium text-[#2b362c]">{payerName}</span> ·{' '}
                      <span className="font-mono tabular-nums">{formatPenceToGbp(expense.amountPence)}</span> total
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-semibold text-[#2b362c] tabular-nums">
                      {formatPenceToGbp(expense.amountPence)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(expense.id)}
                      aria-label={`Delete ${expense.description}`}
                      className="rounded border border-[#e8c6bc] px-2.5 py-1 text-xs font-medium text-[#9e4a34] transition hover:bg-[#faf0ed]"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-[#f5f3ea] pt-3">
                  {shares.map((share) => (
                    <span
                      key={share.memberId}
                      className="inline-flex items-center rounded-md border border-[#dadcca] bg-[#f7f5ed] px-2 py-0.5 font-mono text-[11px] text-[#6e7568] tabular-nums"
                    >
                      {memberNameById.get(share.memberId) ?? 'Member'}:{' '}
                      <strong className="ml-1 font-semibold text-[#2b362c]">
                        {formatPenceToGbp(share.amountPence)}
                      </strong>
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
