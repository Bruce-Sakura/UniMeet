import { useState, type FormEvent } from 'react';
import { PlusCircle, RotateCcw, AlertCircle, Check } from 'lucide-react';
import type { Household } from '../types/splitnest';
import { validateExpenseInput, type ValidatedExpenseInput } from '../lib/validation';
import { parseGbpToPence, formatPenceToGbp } from '../lib/money';

interface ExpenseFormProps {
  household: Household;
  onAddExpense: (expense: ValidatedExpenseInput) => void;
}

export function ExpenseForm({ household, onAddExpense }: ExpenseFormProps) {
  const allIds = household.members.map((m) => m.id);
  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [payerId, setPayerId] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>(allIds);
  const [error, setError] = useState<string | null>(null);

  const toggleParticipant = (id: string) => {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
    if (error) setError(null);
  };

  const handleReset = () => {
    setDescription('');
    setAmountInput('');
    setPayerId('');
    setParticipantIds(allIds);
    setError(null);
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
    handleReset();
  };

  const pence = parseGbpToPence(amountInput);
  const count = participantIds.length;
  const splitPreview = pence && count > 0
    ? `${formatPenceToGbp(Math.floor(pence / count))} each (${count} ${count === 1 ? 'person' : 'people'})`
    : null;

  return (
    <section id="expense-form-section" aria-labelledby="add-expense-heading" className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
        <div>
          <h2 id="add-expense-heading" className="text-base font-semibold tracking-tight text-[#171717]">Add shared expense</h2>
          <p className="mt-0.5 text-xs text-[#737373]">Split a bill or grocery shop equally across housemates</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F7F7F8] text-[#171717]">
          <PlusCircle className="h-4 w-4" />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="expense-description" className="block text-xs font-medium uppercase tracking-wider text-[#737373]">Description</label>
          <input
            id="expense-description"
            type="text"
            value={description}
            onChange={(e) => { setDescription(e.target.value); if (error) setError(null); }}
            placeholder="e.g. Weekly groceries, Wi-Fi bill"
            className="mt-1.5 block w-full rounded-lg border border-[#E5E5E5] bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#171717] focus:ring-1 focus:ring-[#171717] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="expense-amount" className="block text-xs font-medium uppercase tracking-wider text-[#737373]">Amount (£ GBP)</label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 font-mono text-sm text-[#737373]">£</span>
              <input
                id="expense-amount"
                type="text"
                inputMode="decimal"
                value={amountInput}
                onChange={(e) => { setAmountInput(e.target.value); if (error) setError(null); }}
                placeholder="0.00"
                className="block w-full rounded-lg border border-[#E5E5E5] bg-white py-2.5 pr-3 pl-8 font-mono text-sm tabular-nums text-[#171717] placeholder:text-[#A3A3A3] focus:border-[#171717] focus:ring-1 focus:ring-[#171717] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="expense-payer" className="block text-xs font-medium uppercase tracking-wider text-[#737373]">Paid by</label>
            <select
              id="expense-payer"
              value={payerId}
              onChange={(e) => { setPayerId(e.target.value); if (error) setError(null); }}
              className="mt-1.5 block w-full rounded-lg border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm text-[#171717] focus:border-[#171717] focus:ring-1 focus:ring-[#171717] focus:outline-none"
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
            <legend className="text-xs font-medium uppercase tracking-wider text-[#737373]">Split equally between</legend>
            <div className="flex gap-2 text-xs">
              <button type="button" onClick={() => { setParticipantIds(allIds); if (error) setError(null); }} className="font-medium text-[#171717] hover:text-[#737373]">All</button>
              <span className="text-[#E5E5E5]">|</span>
              <button type="button" onClick={() => setParticipantIds([])} className="text-[#737373] hover:text-[#171717]">Clear</button>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {household.members.map((member) => {
              const checked = participantIds.includes(member.id);
              return (
                <label
                  key={member.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors select-none ${
                    checked ? 'border-[#171717] bg-[#F7F7F8] font-medium text-[#171717]' : 'border-[#E5E5E5] bg-white text-[#737373] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleParticipant(member.id)} className="sr-only" />
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    checked ? 'border-[#171717] bg-[#171717] text-white' : 'border-[#E5E5E5] bg-white'
                  }`}>
                    {checked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span className="truncate">{member.name}</span>
                </label>
              );
            })}
          </div>

          {splitPreview && (
            <div className="mt-2.5 flex items-center justify-between rounded-lg border border-[#E5E5E5] bg-[#F7F7F8] px-3 py-2 text-xs">
              <span className="text-[#737373]">Live equal-split preview:</span>
              <span className="font-mono font-medium text-[#171717] tabular-nums">{splitPreview}</span>
            </div>
          )}
        </fieldset>

        {error && (
          <div role="alert" className="flex items-center gap-2 rounded-lg border border-[#171717] bg-[#F7F7F8] p-3 text-xs font-medium text-[#171717]">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#171717]" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#262626] focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 focus:outline-none"
          >
            Add expense
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] text-[#737373] hover:bg-[#F3F4F6] hover:text-[#171717]"
            title="Reset"
            aria-label="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}
