import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { economyService } from '@/features/economyService/economyService';
import { useObjectives } from '@/hooks/useObjectives';
import { useGroupObjectives } from '@/hooks/useGroupObjectives';
import { useBalance } from '@/hooks/useBalance';

import IncomeExpenseChart from '@/features/dashboardPage/IncomeExpenseChart';
import ObjectivesSummary from '@/features/dashboardPage/ObjectivesSummary';
import BalanceBarChart from '@/features/dashboardPage/BalanceBarChart';
import GroupObjectiveWidget from '@/features/dashboardPage/GroupObjectiveWidget';
import TransactionsByTypeWidget from '@/features/dashboardPage/TransactionsByTypeWidget';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  
  const {incomes, expenses, groupExpenses, objectivesExpenses, isLoading} = useBalance();

  const { objectives: personalObjs } = useObjectives();
  const { myObjectives: groupObjs } = useGroupObjectives();

  const globalBalance = useMemo(() => {

    const Today = new Date();
    const currentMonth = Today.getMonth();
    const currentYear = Today.getFullYear();

    const totalIncome = 
      incomes.reduce((sum, income) => new Date(income.created_at).getUTCMonth() === currentMonth && new Date(income.created_at).getUTCFullYear() === currentYear ? sum + income.income : sum, 0);
    const totalExpense = 
      expenses.reduce((sum, expense) => new Date(expense.created_at).getUTCMonth() === currentMonth && new Date(expense.created_at).getUTCFullYear() === currentYear ? sum + expense.expense : sum, 0) 
      + groupExpenses.reduce((sum, contribution) => new Date(contribution.created_at).getUTCMonth() === currentMonth && new Date(contribution.created_at).getUTCFullYear() === currentYear ? sum + contribution.income : sum, 0)
      + objectivesExpenses.reduce((sum, contribution) => new Date(contribution.created_at).getUTCMonth() === currentMonth && new Date(contribution.created_at).getUTCFullYear() === currentYear ? sum + contribution.income : sum, 0);
    return totalIncome - totalExpense;
  }, [incomes, expenses, groupExpenses, objectivesExpenses, isLoading]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-black bg-gray-50">Cargando tu tablero...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black p-4 sm:p-6 lg:p-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Análitica Financiera</h1>
          <p className="text-sm text-slate-400">Resumen general de tus cuentas y objetivos.</p>
        </div>
        
        <div className="bg-white border border-black px-6 py-3 rounded-2xl flex items-center gap-4 shadow-lg">
          <div>
            <p className="text-xs text-black uppercase tracking-wider font-semibold">Balance Total</p>
            <p className={`text-2xl font-bold font-mono ${globalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {globalBalance >= 0 ? '+' : '-'}${Math.abs(globalBalance).toLocaleString()}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-md text-xs font-bold ${globalBalance >= 0 ? 'bg-emerald-400 text-white' : 'bg-red-400 text-red-white'}`}>
            {globalBalance >= 0 ? 'Positivo' : 'Negativo'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
        
        <div className="col-span-12 lg:col-span-6 h-[320px]">
          <IncomeExpenseChart incomes={incomes} expenses={expenses} />
        </div>
        
        <div className="col-span-12 lg:col-span-3 h-[320px]">
          <ObjectivesSummary personalObjs={personalObjs} groupObjs={groupObjs} />
        </div>
        
        <div className="col-span-12 lg:col-span-3 h-[320px]">
          <BalanceBarChart incomes={incomes} expenses={expenses} />
        </div>

        <div className="col-span-12 lg:col-span-6 min-h-[300px]">
          <GroupObjectiveWidget groupObjs={groupObjs} />
        </div>
        
        <div className="col-span-12 lg:col-span-6 min-h-[300px]">
          <TransactionsByTypeWidget incomes={incomes} expenses={expenses} />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;