import { useEffect, useState } from 'react';
import type { Expense, Household, SplitNestState } from './types/splitnest';
import { calculateNetBalances } from './lib/balances';
import { clearState, loadState, saveState } from './lib/storage';
import type { ValidatedExpenseInput } from './lib/validation';
import { BalanceList } from './components/BalanceList';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseHistory } from './components/ExpenseHistory';
import { HouseholdSetup } from './components/HouseholdSetup';
import { Sidebar, type TabId } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { KpiMetrics } from './components/KpiMetrics';
import { HousematesView } from './components/HousematesView';
import { SettingsView } from './components/SettingsView';

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function App() {
  const [state, setState] = useState<SplitNestState>(() => loadState());
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (state.household === null && state.expenses.length === 0) {
      clearState();
      return;
    }
    saveState(state);
  }, [state]);

  const handleCreateHousehold = (householdName: string, memberNames: string[]) => {
    const household: Household = {
      name: householdName,
      members: memberNames.map((name) => ({ id: createId(), name })),
    };
    setState({ household, expenses: [] });
    setActiveTab('dashboard');
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
    setState((prev) => ({ ...prev, expenses: [newExpense, ...prev.expenses] }));
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
    setActiveTab('dashboard');
  };

  const handleScrollToAddExpense = () => {
    setActiveTab('dashboard');
    setTimeout(() => {
      const el = document.getElementById('expense-description');
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  if (!state.household) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#F7F7F8] p-4 sm:p-8">
        <HouseholdSetup onCreateHousehold={handleCreateHousehold} />
      </main>
    );
  }

  const balances = calculateNetBalances(state.household, state.expenses);

  return (
    <div className="flex min-h-dvh bg-[#F7F7F8] text-[#171717]">
      <Sidebar
        household={state.household}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <TopHeader
          household={state.household}
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onAddExpenseClick={handleScrollToAddExpense}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <>
              <KpiMetrics household={state.household} expenses={state.expenses} balances={balances} />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
                <div className="space-y-6 lg:col-span-5">
                  <ExpenseForm household={state.household} onAddExpense={handleAddExpense} />
                  <BalanceList balances={balances} />
                </div>
                <div className="lg:col-span-7">
                  <ExpenseHistory
                    household={state.household}
                    expenses={state.expenses}
                    onDeleteExpense={handleDeleteExpense}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'expenses' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              <div className="space-y-6 lg:col-span-5">
                <ExpenseForm household={state.household} onAddExpense={handleAddExpense} />
                <BalanceList balances={balances} />
              </div>
              <div className="lg:col-span-7">
                <ExpenseHistory
                  household={state.household}
                  expenses={state.expenses}
                  onDeleteExpense={handleDeleteExpense}
                />
              </div>
            </div>
          )}

          {activeTab === 'housemates' && (
            <HousematesView household={state.household} balances={balances} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              household={state.household}
              onResetHousehold={handleResetHousehold}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
