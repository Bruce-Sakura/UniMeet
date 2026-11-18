import { ArrowUpRight, ArrowDownLeft, CheckCircle2, User } from 'lucide-react';
import type { Household, HousemateBalance } from '../types/splitnest';
import { formatPenceToGbp } from '../lib/money';

interface HousematesViewProps {
  household: Household;
  balances: HousemateBalance[];
}

export function HousematesView({ household, balances }: HousematesViewProps) {
  const totalPaidPence = balances.reduce((sum, b) => sum + b.paidPence, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#171717]">
          Housemates Directory & Accounts
        </h2>
        <p className="mt-0.5 text-xs text-[#737373]">
          Detailed breakdown of each member&apos;s financial standing in {household.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {balances.map((item) => {
          const isOwed = item.netPence > 0;
          const owes = item.netPence < 0;
          const contributionPercent =
            totalPaidPence > 0
              ? Math.round((item.paidPence / totalPaidPence) * 100)
              : 0;

          return (
            <div
              key={item.memberId}
              className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xs transition-colors hover:border-[#171717]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F7F7F8] text-xs font-semibold text-[#171717]">
                    {item.memberName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#171717]">
                      {item.memberName}
                    </h3>
                    <p className="text-[11px] text-[#737373]">
                      {contributionPercent}% of total expenditure
                    </p>
                  </div>
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E5E5E5] bg-[#F7F7F8] text-[#737373]">
                  <User className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#E5E5E5] pt-4">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#737373]">
                    Paid Out
                  </span>
                  <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-[#171717]">
                    {formatPenceToGbp(item.paidPence)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#737373]">
                    Equal Share
                  </span>
                  <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-[#171717]">
                    {formatPenceToGbp(item.sharePence)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F1F2] flex items-center justify-between">
                <span className="text-xs text-[#737373]">Net Position:</span>
                <div>
                  {isOwed && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#171717] bg-[#171717] px-2.5 py-1 font-mono text-xs font-medium text-white tabular-nums">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      <span>is owed {formatPenceToGbp(item.netPence)}</span>
                    </span>
                  )}
                  {owes && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#E5E5E5] bg-[#F7F7F8] px-2.5 py-1 font-mono text-xs font-medium text-[#171717] tabular-nums">
                      <ArrowDownLeft className="h-3.5 w-3.5 text-[#737373]" />
                      <span>owes {formatPenceToGbp(Math.abs(item.netPence))}</span>
                    </span>
                  )}
                  {!isOwed && !owes && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#E5E5E5] bg-white px-2.5 py-1 font-mono text-xs text-[#737373] tabular-nums">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#A3A3A3]" />
                      <span>settled ({formatPenceToGbp(0)})</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
