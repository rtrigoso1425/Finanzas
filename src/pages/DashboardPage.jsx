import { useMemo } from 'react';
import { useObjectives } from '@/hooks/useObjectives';
import { useGroupObjectives } from '@/hooks/useGroupObjectives';
import { useBalance } from '@/hooks/useBalance';
import { CurrencySymbol } from '@/utils/currencySimbol';
import { BlurFade } from '@/components/ui/blur-fade';
import { 
  SkeletonDashboardHeader, 
  SkeletonIncomeExpenseChart, 
  SkeletonObjectivesSummary,
  SkeletonGroupObjectiveWidget,
  SkeletonChartContainer
} from '@/components/ui/skeleton';

import IncomeExpenseChart from '@/features/dashboardPage/IncomeExpenseChart';
import ObjectivesSummary from '@/features/dashboardPage/ObjectivesSummary';
import BalanceBarChart from '@/features/dashboardPage/BalanceBarChart';
import GroupObjectiveWidget from '@/features/dashboardPage/GroupObjectiveWidget';
import TransactionsByTypeWidget from '@/features/dashboardPage/TransactionsByTypeWidget';

const DashboardPage = () => {
  
  const {incomes, expenses, groupExpenses, objectivesExpenses, isLoading} = useBalance();

  const { objectives: personalObjs } = useObjectives();
  const { myObjectives: groupObjs } = useGroupObjectives();
  const Symbol = CurrencySymbol();

  const activeGroupObjetives = useMemo(() => {
    let active = []
    groupObjs.forEach(g => {
      if (g.group_objectives.end_date && new Date(g.group_objectives.end_date) > new Date()) {
        active.push(g);
      }
    });
    return active;
  }, [groupObjs]);

  const activeObjetives = useMemo(() => {
    let active = []
    personalObjs.forEach(g => {
      if (g.end_date && new Date(g.end_date) > new Date()) {
        active.push(g);
      }
    });
    return active;
  }, [personalObjs]);

  const globalBalance = useMemo(() => {

    const Today = new Date();
    const currentMonth = Today.getMonth();
    const currentYear = Today.getFullYear();

    const totalIncome = 
      incomes.reduce((sum, income) => new Date(income.created_at).getMonth() === currentMonth && new Date(income.created_at).getFullYear() === currentYear ? sum + income.income : sum, 0);
    const totalExpense = 
      expenses.reduce((sum, expense) => new Date(expense.created_at).getMonth() === currentMonth && new Date(expense.created_at).getFullYear() === currentYear ? sum + expense.expense : sum, 0) 
      + groupExpenses.reduce((sum, contribution) => new Date(contribution.created_at).getMonth() === currentMonth && new Date(contribution.created_at).getFullYear() === currentYear ? sum + contribution.income : sum, 0)
      + objectivesExpenses.reduce((sum, contribution) => new Date(contribution.created_at).getMonth() === currentMonth && new Date(contribution.created_at).getFullYear() === currentYear ? sum + contribution.income : sum, 0);
    return totalIncome - totalExpense;
  }, [incomes, expenses, groupExpenses, objectivesExpenses, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 text-black p-4 sm:p-6 lg:p-8 space-y-6">
        <SkeletonDashboardHeader />
        <div className="w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <SkeletonIncomeExpenseChart />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <SkeletonObjectivesSummary />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <SkeletonChartContainer />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <SkeletonGroupObjectiveWidget />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <SkeletonChartContainer />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 text-black p-4 sm:p-6 lg:p-8 space-y-6">
      <BlurFade delay={0.1} inView>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Análitica Financiera</h1>
            <p className="text-sm text-slate-400 mt-1">Resumen general de tus cuentas y objetivos.</p>
          </div>
          
          <div className="w-full sm:w-auto bg-white border border-black px-4 sm:px-6 py-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-lg">
            <div>
              <p className="text-xs text-black uppercase tracking-wider font-semibold">Balance Total</p>
              <p className={`text-xl sm:text-2xl font-bold font-mono ${globalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {globalBalance >= 0 ? '+' : '-'}{Symbol}{Math.abs(globalBalance).toLocaleString()}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap ${globalBalance >= 0 ? 'bg-emerald-400 text-white' : 'bg-red-400 text-white'}`}>
              {globalBalance >= 0 ? 'Positivo' : 'Negativo'}
            </div>
          </div>
        </div>
      </BlurFade>

      <div className="w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
        <BlurFade delay={0.2} inView className="col-span-12 lg:col-span-6">
          <div className="h-[320px]">
            <IncomeExpenseChart incomes={incomes} expenses={expenses} />
          </div>
        </BlurFade>
        
        <BlurFade delay={0.3} inView className="col-span-12 lg:col-span-3">
          <div className="h-[320px]">
            <ObjectivesSummary personalObjs={activeObjetives} groupObjs={activeGroupObjetives} />
          </div>
        </BlurFade>
        
        <BlurFade delay={0.4} inView className="col-span-12 lg:col-span-3">
          <div className="h-[320px]">
            <BalanceBarChart incomes={incomes} expenses={expenses} />
          </div>
        </BlurFade>

        <BlurFade delay={0.5} inView className="col-span-12 lg:col-span-6">
          <div className="min-h-[300px]">
            <GroupObjectiveWidget groupObjs={activeGroupObjetives} />
          </div>
        </BlurFade>
        
        <BlurFade delay={0.6} inView className="col-span-12 lg:col-span-6">
          <div className="min-h-[300px]">
            <TransactionsByTypeWidget incomes={incomes} expenses={expenses} />
          </div>
        </BlurFade>
      </div>
    </div>
  );
};

export default DashboardPage;