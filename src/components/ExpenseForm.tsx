import { useState, type FormEvent } from 'react';
import type { Household } from '../types/splitnest';
import { validateExpenseInput, type ValidatedExpenseInput } from '../lib/validation';

interface ExpenseFormProps {
  household: Household;
  onAddExpense: (expense: ValidatedExpenseInput) => void;
}

export function ExpenseForm({ household, onAddExpense }: ExpenseFormProps) {
  const allMemberIds = household.members.map((m) => m.id);
  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [payerId, setPayerId] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>(allMemberIds);
  const [error, setError] = useState<string | null>(null);

  const toggleParticipant = (id: string) => {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
    if (error) setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateExpenseInput(
      { description, amountInput, payerId, participantIds },
      household,
    );
    if (!result.valid) {
      setError(result.error);
      return;
    }
    setError(null);
    onAddExpense(result.value);
    setDescription('');
    setAmountInput('');
    setPayerId('');
    setParticipantIds(allMemberIds);
  };

  return (
    <section
      aria-labelledby="add-expense-heading"
      className="rounded-2xl border border-[#dcdccf] bg-[#fdfcf7] p-6 shadow-[0_2px_12px_rgba(43,54,44,0.04)]"
    >
      <div className="border-b border-[#ece9dc] pb-4">
        <div className="text-[10px] font-medium tracking-[0.2em] text-[#717b6a] uppercase">New Entry</div>
        <h2 id="add-expense-heading" className="mt-1 font-serif text-xl font-normal text-[#2b362c]">
          Add shared expense
        </h2>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="expense-description" className="block text-xs font-medium tracking-wide text-[#424c3f] uppercase">
            Description
          </label>
          <input
            id="expense-description"
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Weekly groceries, Wi-Fi bill"
            className="mt-1.5 block w-full rounded-lg border border-[#dadcca] bg-white px-3.5 py-2.5 text-sm text-[#2b362c] placeholder:text-[#9ea397] focus:border-[#4a573e] focus:ring-1 focus:ring-[#4a573e] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="expense-amount" className="block text-xs font-medium tracking-wide text-[#424c3f] uppercase">
              Amount (£ GBP)
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 font-mono text-sm text-[#717b6a]">£</span>
              <input
                id="expense-amount"
                type="text"
                inputMode="decimal"
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="0.00"
                className="block w-full rounded-lg border border-[#dadcca] bg-white py-2.5 pr-3 pl-8 font-mono text-sm text-[#2b362c] placeholder:text-[#9ea397] focus:border-[#4a573e] focus:ring-1 focus:ring-[#4a573e] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="expense-payer" className="block text-xs font-medium tracking-wide text-[#424c3f] uppercase">
              Paid by
            </label>
            <select
              id="expense-payer"
              value={payerId}
              onChange={(e) => {
                setPayerId(e.target.value);
                if (error) setError(null);
              }}
              className="mt-1.5 block w-full rounded-lg border border-[#dadcca] bg-white px-3 py-2.5 text-sm text-[#2b362c] focus:border-[#4a573e] focus:ring-1 focus:ring-[#4a573e] focus:outline-none"
            >
              <option value="">Select housemate...</option>
              {household.members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <fieldset>
          <div className="flex items-center justify-between">
            <legend className="text-xs font-medium tracking-wide text-[#424c3f] uppercase">Split equally between</legend>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setParticipantIds(allMemberIds);
                  if (error) setError(null);
                }}
                className="text-[#4a573e] underline decoration-[#b8baa6] underline-offset-2 hover:text-[#3a4531]"
              >
                All
              </button>
              <span className="text-[#dadcca]">·</span>
              <button
                type="button"
                onClick={() => setParticipantIds([])}
                className="text-[#717b6a] hover:text-[#2b362c]"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {household.members.map((member) => {
              const checked = participantIds.includes(member.id);
              return (
                <label
                  key={member.id}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-xs transition ${
                    checked
                      ? 'border-[#4a573e] bg-[#f0f4ec] font-medium text-[#243021]'
                      : 'border-[#dadcca] bg-white text-[#6e7568] hover:bg-[#f5f3ea]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleParticipant(member.id)}
                    className="h-3.5 w-3.5 rounded border-[#dadcca] text-[#4a573e] focus:ring-[#4a573e]"
                  />
                  <span className="truncate">{member.name}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {error && (
          <div role="alert" className="rounded-lg border border-[#e2b8ad] bg-[#faf0ed] px-3.5 py-2.5 text-xs text-[#9e4a34]">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-[#4a573e] px-4 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-[#3a4531] focus:ring-2 focus:ring-[#4a573e] focus:ring-offset-2 focus:outline-none"
        >
          Add expense
        </button>
      </form>
    </section>
  );
}
