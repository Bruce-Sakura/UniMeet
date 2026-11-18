import { useState, type FormEvent } from 'react';
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
    <div className="mx-auto max-w-lg rounded-2xl border border-[#dcdccf] bg-[#fdfcf7] p-7 shadow-[0_4px_20px_rgba(43,54,44,0.05)] sm:p-9">
      <div className="mb-7 border-b border-[#ece9dc] pb-6">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#b8baa6] bg-[#ece9dc] text-[10px] font-serif font-semibold text-[#4a573e]">
            SN
          </span>
          <span className="text-[10px] font-medium tracking-[0.22em] text-[#717b6a] uppercase">
            SplitNest · Shared Living
          </span>
        </div>
        <h1 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#2b362c]">
          Open a household ledger
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6e7568]">
          Establish your residence and register at least two housemates to split shared costs equally in GBP.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label
            htmlFor="household-name"
            className="block text-xs font-medium tracking-wide text-[#424c3f] uppercase"
          >
            Residence or household name
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
            className="mt-2 block w-full rounded-lg border border-[#dadcca] bg-white px-3.5 py-2.5 text-sm text-[#2b362c] placeholder:text-[#9ea397] focus:border-[#4a573e] focus:ring-1 focus:ring-[#4a573e] focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="block text-xs font-medium tracking-wide text-[#424c3f] uppercase">
              Registered housemates
            </span>
            <button
              type="button"
              onClick={handleAddRow}
              className="text-xs font-medium text-[#4a573e] underline decoration-[#b8baa6] underline-offset-4 hover:text-[#3a4531]"
            >
              + Add housemate
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
                  placeholder={`Housemate ${index + 1} (e.g. ${
                    ['Alice', 'Bob', 'Charlie', 'Priya'][index] ?? 'Sam'
                  })`}
                  className="block w-full rounded-lg border border-[#dadcca] bg-white px-3.5 py-2.5 text-sm text-[#2b362c] placeholder:text-[#9ea397] focus:border-[#4a573e] focus:ring-1 focus:ring-[#4a573e] focus:outline-none"
                />
                {memberRows.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    aria-label={`Remove housemate ${index + 1}`}
                    className="rounded-lg border border-[#dadcca] px-2.5 py-2.5 text-xs text-[#717b6a] hover:bg-[#f5f3ea] hover:text-[#2b362c]"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-[#e2b8ad] bg-[#faf0ed] px-4 py-3 text-sm text-[#9e4a34]"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-[#4a573e] px-4 py-3 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-[#3a4531] focus:ring-2 focus:ring-[#4a573e] focus:ring-offset-2 focus:outline-none"
        >
          Create household
        </button>
      </form>
    </div>
  );
}
