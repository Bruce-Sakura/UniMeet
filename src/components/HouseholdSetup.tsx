import { useState, type FormEvent } from 'react';
import { Plus, Trash2, Home, AlertCircle } from 'lucide-react';
import { validateHouseholdInput } from '../lib/validation';

interface HouseholdSetupProps {
  onCreateHousehold: (householdName: string, memberNames: string[]) => void;
}

export function HouseholdSetup({ onCreateHousehold }: HouseholdSetupProps) {
  const [householdName, setHouseholdName] = useState('');
  const [memberRows, setMemberRows] = useState<string[]>(['', '']);
  const [error, setError] = useState<string | null>(null);

  const handleMemberChange = (index: number, value: string) => {
    setMemberRows((prev) =>
      prev.map((item, idx) => (idx === index ? value : item)),
    );
    if (error) setError(null);
  };

  const handleAddRow = () => {
    setMemberRows((prev) => [...prev, '']);
  };

  const handleRemoveRow = (index: number) => {
    setMemberRows((prev) => prev.filter((_, idx) => idx !== index));
    if (error) setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateHouseholdInput(householdName, memberRows);
    if (!result.valid) {
      setError(result.error);
      return;
    }
    setError(null);
    onCreateHousehold(result.value.householdName, result.value.memberNames);
  };

  return (
    <div className="w-full max-w-lg rounded-xl border border-[#E5E5E5] bg-white p-8 shadow-xs">
      <div className="mb-8">
        <div className="flex items-center gap-2.5 text-xs font-medium tracking-tight text-[#171717]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#171717] text-white">
            <Home className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm">SplitNest</span>
          <span className="text-[#A3A3A3]">/</span>
          <span className="text-[#737373]">Setup</span>
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#171717]">
          Create your household
        </h1>
        <p className="mt-1.5 text-sm text-[#737373] leading-relaxed">
          Set up your residence and register at least two housemates to start tracking and splitting shared expenses.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label
            htmlFor="household-name"
            className="block text-xs font-medium uppercase tracking-wider text-[#737373]"
          >
            Household name
          </label>
          <input
            id="household-name"
            type="text"
            value={householdName}
            onChange={(e) => {
              setHouseholdName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. 42 Oakfield Road"
            className="mt-2 block w-full rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#171717] focus:ring-1 focus:ring-[#171717] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="block text-xs font-medium uppercase tracking-wider text-[#737373]">
              Housemates (minimum 2)
            </span>
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#171717] hover:text-[#737373] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add housemate</span>
            </button>
          </div>

          <div className="mt-2.5 space-y-2.5">
            {memberRows.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  aria-label={`Housemate ${index + 1} name`}
                  value={name}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  placeholder={`Housemate ${index + 1} name`}
                  className="block w-full rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#171717] focus:ring-1 focus:ring-[#171717] focus:outline-none transition-colors"
                />
                {memberRows.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    aria-label={`Remove housemate ${index + 1}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] text-[#737373] hover:bg-[#F3F4F6] hover:text-[#171717] transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-lg border border-[#171717] bg-[#F7F7F8] p-3 text-xs font-medium text-[#171717]"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-[#171717]" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#262626] focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 focus:outline-none"
        >
          Create household
        </button>
      </form>
    </div>
  );
}
