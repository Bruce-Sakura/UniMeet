import { useState } from 'react';
import type { Household } from '../types/splitnest';

interface HouseholdHeaderProps {
  household: Household;
  onResetHousehold: () => void;
}

export function HouseholdHeader({
  household,
  onResetHousehold,
}: HouseholdHeaderProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <header className="rounded-2xl border border-[#dcdccf] bg-[#fdfcf7] p-6 shadow-[0_2px_12px_rgba(43,54,44,0.04)] sm:flex sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b8baa6] bg-[#ece9dc] text-xs font-serif font-semibold text-[#4a573e]">
            SN
          </div>
          <div>
            <div className="text-[10px] font-medium tracking-[0.2em] text-[#717b6a] uppercase">
              Household Ledger
            </div>
            <h1 className="font-serif text-2xl font-medium tracking-tight text-[#2b362c]">
              {household.name}
            </h1>
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-2 pl-0.5">
          <span className="text-xs text-[#717b6a]">Housemates:</span>
          {household.members.map((member) => (
            <span
              key={member.id}
              className="inline-flex items-center rounded-full border border-[#dadcca] bg-[#f5f3ea] px-3 py-0.5 text-xs font-medium text-[#2b362c]"
            >
              {member.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-[#ece9dc] pt-4 sm:mt-0 sm:border-0 sm:pt-0">
        {!confirmingReset ? (
          <button
            type="button"
            onClick={() => setConfirmingReset(true)}
            className="rounded-lg border border-[#dadcca] bg-[#fdfcf7] px-3 py-1.5 text-xs font-medium text-[#717b6a] transition hover:border-[#b8baa6] hover:bg-[#f5f3ea] hover:text-[#2b362c]"
          >
            Reset ledger
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#9e4a34]">
              Reset all records?
            </span>
            <button
              type="button"
              onClick={() => {
                setConfirmingReset(false);
                onResetHousehold();
              }}
              className="rounded-lg bg-[#9e4a34] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#853d29]"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmingReset(false)}
              className="rounded-lg border border-[#dadcca] px-2.5 py-1.5 text-xs font-medium text-[#717b6a] hover:bg-[#f5f3ea]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
