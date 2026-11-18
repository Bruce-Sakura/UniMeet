import { useState, useMemo } from 'react';
import { Receipt, Trash2, Search, ArrowUpDown } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const memberNameById = useMemo(
    () => new Map(household.members.map((member) => [member.id, member.name])),
    [household.members],
  );

  const filteredExpenses = useMemo(() => {
    if (!searchTerm.trim()) return expenses;
    const term = searchTerm.toLowerCase();
    return expenses.filter((expense) => {
      const descMatch = expense.description.toLowerCase().includes(term);
      const payerName = memberNameById.get(expense.payerId)?.toLowerCase() ?? '';
      return descMatch || payerName.includes(term);
    });
  }, [expenses, searchTerm, memberNameById]);

  return (
    <section
      aria-labelledby="expense-history-heading"
      className="rounded-xl border border-[#E5E5E5] bg-white shadow-xs overflow-hidden"
    >
      <div className="p-6 border-b border-[#E5E5E5] sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="expense-history-heading" className="text-base font-semibold tracking-tight text-[#171717]">
              Expense history
            </h2>
            <span className="inline-flex items-center rounded-full border border-[#E5E5E5] bg-[#F7F7F8] px-2 py-0.5 text-xs font-mono text-[#737373]">
              {expenses.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[#737373]">
            Complete ledger of shared household expenditures and splits
          </p>
        </div>

        {expenses.length > 0 && (
          <div className="relative mt-3 sm:mt-0 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#737373]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses or payer..."
              className="w-full rounded-lg border border-[#E5E5E5] bg-white py-1.5 pl-8 pr-3 text-xs text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#171717] focus:ring-1 focus:ring-[#171717] focus:outline-none"
            />
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F7F7F8] text-[#737373]">
            <Receipt className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-medium text-[#171717]">No expenses recorded yet</p>
          <p className="mt-1 text-xs text-[#737373] max-w-xs mx-auto">
            Log your first shared expense above to compute equal splits and live balances.
          </p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="p-8 text-center text-xs text-[#737373]">
          No expenses match &ldquo;{searchTerm}&rdquo;. Try another search term.
        </div>
      ) : (
        <div className="divide-y divide-[#E5E5E5]">
          {filteredExpenses.map((expense) => {
            const payerName = memberNameById.get(expense.payerId) ?? 'Housemate';
            const shares = getExpenseShares(expense, household);

            return (
              <div
                key={expense.id}
                className="p-5 transition-colors hover:bg-[#F3F4F6]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-[#171717] truncate">
                      {expense.description}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#737373]">
                      Paid by <span className="font-medium text-[#171717]">{payerName}</span> ·{' '}
                      <span className="font-mono tabular-nums">{formatPenceToGbp(expense.amountPence)}</span> total
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm font-semibold tabular-nums text-[#171717]">
                      {formatPenceToGbp(expense.amountPence)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(expense.id)}
                      aria-label={`Delete ${expense.description}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] text-[#737373] hover:border-[#171717] hover:bg-white hover:text-[#171717] transition-colors"
                      title={`Delete ${expense.description}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F1F1F2]">
                  <span className="text-[11px] text-[#737373] mr-1 flex items-center gap-1">
                    <ArrowUpDown className="h-3 w-3" /> Split:
                  </span>
                  {shares.map((share) => (
                    <span
                      key={share.memberId}
                      className="inline-flex items-center rounded border border-[#E5E5E5] bg-[#F7F7F8] px-2 py-0.5 text-[11px] text-[#171717]"
                    >
                      <span className="text-[#737373] mr-1">{memberNameById.get(share.memberId) ?? 'Member'}:</span>
                      <span className="font-mono font-medium tabular-nums">{formatPenceToGbp(share.amountPence)}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
