import { Group, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';
import AddIncomeModal from '@/components/AddIncomeModal';
import AddExpenseModal from '@/components/AddExpenseModal';
import { useBalance } from '@/hooks/useBalance';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BalancePage = () => {
  const [IncomemodalOpen, setIncomeModalOpen] = useState(false);
  const [ExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const { incomes, expenses, groupExpenses, isLoading } = useBalance();

  let GroupsContributions = [];

  groupExpenses.forEach(group => {
    group.group_objectives_income.forEach(income => {
      GroupsContributions.push({
        id: income.id,
        income: income.income,
        verified: income.verified,
        message: income.message,
        created_at: income.created_at,
        updated_at: income.updated_at,
        objective_name: group.group_objectives.objective_name
      })
    });
  });

  const balance = {
    totalIncome: incomes.reduce((sum, income) => sum + income.income, 0),
    totalExpenses: expenses.reduce((sum, expense) => sum + expense.expense, 0) + GroupsContributions.reduce((sum, contribution) => sum + contribution.income, 0),
    netBalance: incomes.reduce((sum, income) => sum + income.income, 0) - expenses.reduce((sum, expense) => sum + expense.expense, 0) - GroupsContributions.reduce((sum, contribution) => sum + contribution.income, 0)
  };

  let transactions = [];

  incomes.forEach(income => {
    transactions.push({
      id: `income${income.id}`,
      description: income.type,
      amount: income.income,
      type: 'income',
      date: income.created_at
    })
  });

  expenses.forEach(expense => {
    transactions.push({
      id: `expense${expense.id}`,
      description: expense.type,
      amount: expense.expense,
      type: 'expense',
      date: expense.created_at
    })
  });

  GroupsContributions.forEach(contribution => {
    transactions.push({
      id: `group-contribution${contribution.id}`,
      description: contribution.objective_name,
      amount: contribution.income,
      type: 'expense',
      date: contribution.created_at
    })
  });

  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Balance Financiero
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Controla tus ingresos y gastos
        </p>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Cargando balance...</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 border-emerald-200 dark:border-emerald-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-emerald-900 dark:text-emerald-100">
                    Ingresos
                  </CardTitle>
                  <button 
                    className="hover:shadow-[0_0_25px_rgba(50,255,100,0.9)] hover:border-blue-500 transition-all duration-300 rounded-full" 
                    onClick={() => setIncomeModalOpen(true)}
                  >
                    <div className="bg-emerald-500 p-3 rounded-full">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                  ${balance.totalIncome.toFixed(2)}
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
                  Este mes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-red-200 dark:border-red-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-red-900 dark:text-red-100">
                    Gastos
                  </CardTitle>
                  <button 
                    className="hover:shadow-[0_0_25px_rgba(255,50,100,0.9)] hover:border-blue-500 transition-all duration-300 rounded-full"
                    onClick={ () => setExpenseModalOpen(true)}
                  >
                    <div className="bg-red-500 p-3 rounded-full">
                      <TrendingDown className="h-5 w-5 text-white" />
                    </div>
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  ${balance.totalExpenses.toFixed(2)}
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                  Este mes
                </p>
              </CardContent>
            </Card>
          
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-900 dark:text-blue-100">
                    Balance
                  </CardTitle>
                  <div className="bg-blue-500 p-3 rounded-full">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  ${balance.netBalance.toFixed(2)}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  Disponible
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Transacciones Recientes
              </h2>
              <Button variant="outline">Ver todas</Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Descripción
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Tipo
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Monto
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                transaction.type === 'income'
                                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100'
                                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                              }`}
                            >
                              {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            <span className={transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}>
                              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date( transaction.date ).toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      <AddIncomeModal isOpen={IncomemodalOpen} onOpenChange={setIncomeModalOpen} />
      <AddExpenseModal isOpen={ExpenseModalOpen} onOpenChange={setExpenseModalOpen} />
    </div>
  );
};

export default BalancePage;