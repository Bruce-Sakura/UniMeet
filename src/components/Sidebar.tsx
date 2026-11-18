import { LayoutDashboard, ReceiptText, Users, Settings, Home, X } from 'lucide-react';
import type { Household } from '../types/splitnest';

export type TabId = 'dashboard' | 'expenses' | 'housemates' | 'settings';

interface SidebarProps {
  household: Household;
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  household,
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const navItems: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: ReceiptText },
    { id: 'housemates', label: 'Housemates', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: TabId) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#E5E5E5] bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between border-b border-[#E5E5E5] px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#171717] text-white">
              <Home className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-semibold tracking-tight text-[#171717]">SplitNest</span>
              <span className="ml-1.5 rounded bg-[#F7F7F8] px-1.5 py-0.5 text-[10px] font-mono text-[#737373] border border-[#E5E5E5]">
                v1.0
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] text-[#737373] hover:text-[#171717] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Household quick identifier */}
        <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F8]">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#737373]">
            Active Household
          </span>
          <p className="mt-0.5 text-xs font-semibold text-[#171717] truncate">
            {household.name}
          </p>
          <p className="text-[11px] text-[#737373]">
            {household.members.length} registered housemates
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#171717] text-white'
                    : 'text-[#737373] hover:bg-[#F3F4F6] hover:text-[#171717]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#737373]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-[#E5E5E5] p-4 text-[11px] text-[#737373]">
          <div className="flex items-center justify-between">
            <span>Ledger status</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#171717]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#171717]" />
              Synced local
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
