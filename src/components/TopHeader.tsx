import { Menu, Plus } from 'lucide-react';
import type { Household } from '../types/splitnest';
import type { TabId } from './Sidebar';

interface TopHeaderProps {
  household: Household;
  activeTab: TabId;
  onOpenMobileSidebar: () => void;
  onAddExpenseClick: () => void;
}

export function TopHeader({
  household,
  activeTab,
  onOpenMobileSidebar,
  onAddExpenseClick,
}: TopHeaderProps) {
  const tabDescriptions: Record<TabId, string> = {
    dashboard: 'Household overview, equal-split ledger, and current net balances.',
    expenses: 'Complete log of shared bills, grocery expenses, and equal division.',
    housemates: 'Resident roster, individual contributions, and balances.',
    settings: 'Household profile, membership, and storage configuration.',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E5E5] bg-white/95 px-4 sm:px-8 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E5E5] text-[#171717] hover:bg-[#F3F4F6] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div>
          <h1 className="text-base font-semibold tracking-tight text-[#171717]">
            {household.name}
          </h1>
          <p className="hidden text-xs text-[#737373] sm:block">
            {tabDescriptions[activeTab]}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAddExpenseClick}
          aria-label="Record new expense"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#171717] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#262626] focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 focus:outline-none"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Expense</span>
        </button>
      </div>
    </header>
  );
}
