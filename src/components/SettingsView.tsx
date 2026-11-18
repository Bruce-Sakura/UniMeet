import { useState } from 'react';
import { Home, Users, AlertTriangle } from 'lucide-react';
import type { Household } from '../types/splitnest';

interface SettingsViewProps {
  household: Household;
  onResetHousehold: () => void;
  onLoadSampleData?: () => void;
}

export function SettingsView({ household, onResetHousehold, onLoadSampleData }: SettingsViewProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[#171717]">
          Household Settings
        </h2>
        <p className="mt-0.5 text-xs text-[#737373]">
          Manage household configuration and data persistence
        </p>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F7F7F8] text-[#171717]">
            <Home className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#171717]">Household Information</h3>
            <p className="text-xs text-[#737373]">Current active ledger details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#737373]">
              Residence Name
            </label>
            <div className="mt-1.5 rounded-lg border border-[#E5E5E5] bg-[#F7F7F8] px-3.5 py-2.5 text-sm font-medium text-[#171717]">
              {household.name}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#737373]">
              Registered Members ({household.members.length})
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {household.members.map((member) => (
                <span
                  key={member.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-[#F7F7F8] px-3 py-1.5 text-xs font-medium text-[#171717]"
                >
                  <Users className="h-3.5 w-3.5 text-[#737373]" />
                  {member.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#171717] bg-[#171717] text-white">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#171717]">Danger Zone</h3>
            <p className="mt-0.5 text-xs text-[#737373] leading-relaxed">
              Resetting will permanently clear all recorded expenses, member accounts, and household settings from browser storage.
            </p>

            {!showConfirmReset ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(true)}
                  className="rounded-lg border border-[#171717] px-3.5 py-2 text-xs font-medium text-[#171717] hover:bg-[#171717] hover:text-white transition-colors"
                >
                  Reset household ledger
                </button>
                {onLoadSampleData && (
                  <button
                    type="button"
                    onClick={onLoadSampleData}
                    className="rounded-lg border border-[#E5E5E5] bg-[#F7F7F8] px-3.5 py-2 text-xs font-medium text-[#171717] hover:bg-[#E5E5E5] transition-colors"
                  >
                    Reset to 3-housemate sample data
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-[#171717] bg-[#F7F7F8] p-4">
                <p className="text-xs font-semibold text-[#171717]">
                  Are you absolutely certain? This cannot be undone.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowConfirmReset(false);
                      onResetHousehold();
                    }}
                    className="rounded-lg bg-[#171717] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#262626] transition-colors"
                  >
                    Confirm & Reset Everything
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-medium text-[#737373] hover:text-[#171717] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
