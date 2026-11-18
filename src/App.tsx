import { useEffect, useState } from 'react';
import type { Expense, Household, SplitNestState } from './types/splitnest';
import { calculateNetBalances } from './lib/balances';
import { clearState, loadState, saveState } from './lib/storage';
import type { ValidatedExpenseInput } from './lib/validation';
import { BalanceList } from './components/BalanceList';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseHistory } from './components/ExpenseHistory';
import { HouseholdHeader } from './components/HouseholdHeader';
import { HouseholdSetup } from './components/HouseholdSetup';

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function App() {
  const [state, setState] = useState<SplitNestState>(() => loadState());

  useEffect(() => {
    if (state.household === null && state.expenses.length === 0) {
      clearState();
      return;
    }
    saveState(state);
  }, [state]);

  const handleCreateHousehold = (
    householdName: string,
    memberNames: string[],
  ) => {
    const household: Household = {
      name: householdName,
      members: memberNames.map((name) => ({
        id: createId(),
        name,
      })),
    };
    setState({ household, expenses: [] });
  };

  const handleAddExpense = (validated: ValidatedExpenseInput) => {
    const newExpense: Expense = {
      id: createId(),
      description: validated.description,
      amountPence: validated.amountPence,
      payerId: validated.payerId,
      participantIds: validated.participantIds,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
    }));
  };

  const handleDeleteExpense = (expenseId: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((expense) => expense.id !== expenseId),
    }));
  };

  const handleResetHousehold = () => {
    clearState();
    setState({ household: null, expenses: [] });
  };

  if (!state.household) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#f7f5ed] px-4 py-12">
        <HouseholdSetup onCreateHousehold={handleCreateHousehold} />
      </main>
    );
  }

  const balances = calculateNetBalances(state.household, state.expenses);

  return (
    <div className="min-h-dvh bg-[#f7f5ed] text-[#2b362c]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <HouseholdHeader
          household={state.household}
          onResetHousehold={handleResetHousehold}
        />

        <main className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-12">
          <div className="space-y-7 lg:col-span-5">
            <ExpenseForm
              household={state.household}
              onAddExpense={handleAddExpense}
            />
            <BalanceList balances={balances} />
          </div>

          <div className="lg:col-span-7">
            <ExpenseHistory
              household={state.household}
              expenses={state.expenses}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
