import { PoundSterling, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { Expense, Household, HousemateBalance } from '../types/splitnest';
import { formatPenceToGbp } from '../lib/money';

interface KpiMetricsProps {
  household: Household;
  expenses: Expense[];
  balances: HousemateBalance[];
}

export function KpiMetrics({ household, expenses, balances }: KpiMetricsProps) {
  const totalSpendPence = expenses.reduce((sum, e) => sum + e.amountPence, 0);
  const unsettledPence = balances
    .filter((b) => b.netPence > 0)
    .reduce((sum, b) => sum + b.netPence, 0);

  const isAllSettled = unsettledPence === 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-[#737373]">
            Total Spend
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E5E5E5] bg-[#F7F7F8] text-[#171717]">
            <PoundSterling className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl font-semibold tracking-tight text-[#171717] tabular-nums">
            {formatPenceToGbp(totalSpendPence)}
          </div>
          <p className="mt-1 text-xs text-[#737373]">
            {expenses.length} logged {expenses.length === 1 ? 'expense' : 'expenses'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-[#737373]">
            Settlement Status
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E5E5E5] bg-[#F7F7F8] text-[#171717]">
            {isAllSettled ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-[#171717]" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 text-[#171717]" />
            )}
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl font-semibold tracking-tight text-[#171717] tabular-nums">
            {isAllSettled ? 'Settled' : formatPenceToGbp(unsettledPence)}
          </div>
          <p className="mt-1 text-xs text-[#737373]">
            {isAllSettled ? 'All accounts balanced' : 'Outstanding net transfer'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-[#737373]">
            Housemates
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E5E5E5] bg-[#F7F7F8] text-[#171717]">
            <Users className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl font-semibold tracking-tight text-[#171717] tabular-nums">
            {household.members.length}
          </div>
          <p className="mt-1 text-xs text-[#737373]">
            Equal cost sharing participants
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-[#737373]">
            Avg Share / Person
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E5E5E5] bg-[#F7F7F8] text-[#171717]">
            <span className="font-mono text-xs font-semibold">÷</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="font-mono text-2xl font-semibold tracking-tight text-[#171717] tabular-nums">
            {household.members.length > 0
              ? formatPenceToGbp(Math.round(totalSpendPence / household.members.length))
              : '£0.00'}
          </div>
          <p className="mt-1 text-xs text-[#737373]">
            Per registered resident
          </p>
        </div>
      </div>
    </div>
  );
}
