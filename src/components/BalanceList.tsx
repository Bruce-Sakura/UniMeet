import type { HousemateBalance } from '../types/splitnest';
import { formatPenceToGbp } from '../lib/money';

interface BalanceListProps {
  balances: HousemateBalance[];
}

export function BalanceList({ balances }: BalanceListProps) {
  return (
    <section
      aria-labelledby="net-balances-heading"
      className="rounded-2xl border border-[#dcdccf] bg-[#fdfcf7] p-6 shadow-[0_2px_12px_rgba(43,54,44,0.04)]"
    >
      <div className="border-b border-[#ece9dc] pb-4">
        <div className="text-[10px] font-medium tracking-[0.2em] text-[#717b6a] uppercase">
          Accounts
        </div>
        <h2
          id="net-balances-heading"
          className="mt-1 font-serif text-xl font-normal text-[#2b362c]"
        >
          Net balances
        </h2>
        <p className="mt-1 text-xs text-[#717b6a]">
          Calculated in integer pence. Positive balances are owed back to the housemate.
        </p>
      </div>

      <ul className="mt-4 divide-y divide-[#ece9dc]">
        {balances.map((item) => {
          const isOwed = item.netPence > 0;
          const owes = item.netPence < 0;

          return (
            <li
              key={item.memberId}
              className="flex items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
            >
              <div>
                <p className="text-sm font-medium text-[#2b362c]">
                  {item.memberName}
                </p>
                <p className="font-mono text-[11px] text-[#717b6a] tabular-nums">
                  Paid {formatPenceToGbp(item.paidPence)} · Share{' '}
                  {formatPenceToGbp(item.sharePence)}
                </p>
              </div>

              <div className="text-right">
                {isOwed && (
                  <span className="inline-flex items-center rounded-full border border-[#cad5c3] bg-[#edf2e8] px-3 py-1 font-mono text-xs font-semibold text-[#3b5435] tabular-nums">
                    is owed {formatPenceToGbp(item.netPence)}
                  </span>
                )}
                {owes && (
                  <span className="inline-flex items-center rounded-full border border-[#e8c6bc] bg-[#faf0ed] px-3 py-1 font-mono text-xs font-semibold text-[#9e4a34] tabular-nums">
                    owes {formatPenceToGbp(Math.abs(item.netPence))}
                  </span>
                )}
                {!isOwed && !owes && (
                  <span className="inline-flex items-center rounded-full border border-[#dadcca] bg-[#f5f3ea] px-3 py-1 font-mono text-xs text-[#717b6a] tabular-nums">
                    settled ({formatPenceToGbp(0)})
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
