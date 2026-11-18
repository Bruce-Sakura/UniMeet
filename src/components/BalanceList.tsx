import { Scale, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import type { HousemateBalance } from '../types/splitnest';
import { formatPenceToGbp } from '../lib/money';

interface BalanceListProps {
  balances: HousemateBalance[];
}

export function BalanceList({ balances }: BalanceListProps) {
  return (
    <section
      role="region"
      aria-label="Net balances"
      className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
        <div>
          <h2 id="net-balances-heading" className="text-base font-semibold tracking-tight text-[#171717]">
            Net balances
          </h2>
          <p className="mt-0.5 text-xs text-[#737373]">
            Calculated in integer pence. Positive balances are owed back to the housemate.
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F7F7F8] text-[#171717]">
          <Scale className="h-4 w-4" />
        </div>
      </div>

      <ul className="mt-4 divide-y divide-[#E5E5E5]">
        {balances.map((item) => {
          const isOwed = item.netPence > 0;
          const owes = item.netPence < 0;

          return (
            <li
              key={item.memberId}
              className="flex items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#171717] truncate">
                  {item.memberName}
                </p>
                <p className="font-mono text-xs text-[#737373] tabular-nums mt-0.5">
                  Paid {formatPenceToGbp(item.paidPence)} · Share {formatPenceToGbp(item.sharePence)}
                </p>
              </div>

              <div className="shrink-0 text-right">
                {isOwed && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[#171717] bg-[#171717] px-2.5 py-1 font-mono text-xs font-medium text-white tabular-nums">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>is owed {formatPenceToGbp(item.netPence)}</span>
                  </span>
                )}
                {owes && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E5E5] bg-[#F7F7F8] px-2.5 py-1 font-mono text-xs font-medium text-[#171717] tabular-nums">
                    <ArrowDownLeft className="h-3.5 w-3.5 text-[#737373]" />
                    <span>owes {formatPenceToGbp(Math.abs(item.netPence))}</span>
                  </span>
                )}
                {!isOwed && !owes && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E5E5] bg-white px-2.5 py-1 font-mono text-xs text-[#737373] tabular-nums">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#A3A3A3]" />
                    <span>settled ({formatPenceToGbp(0)})</span>
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
