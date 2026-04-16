import { TrendingDown, TrendingUp, Wallet, Receipt } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIncomeModal from '@/components/AddIncomeModal';
import AddExpenseModal from '@/components/AddExpenseModal';
import { useBalance } from '@/hooks/useBalance';
import { CurrencySymbol } from '@/utils/currencySimbol';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { symbol } from 'framer-motion/client';

const BalancePage = () => {
  const Symbol = CurrencySymbol();
  const navigate = useNavigate();
  const [IncomemodalOpen, setIncomeModalOpen] = useState(false);
  const [ExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const { incomes, expenses, groupExpenses, objectivesExpenses, balance: transactions, isLoading } = useBalance();

  const Today = new Date();
  const currentMonth = Today.getMonth();
  const currentYear = Today.getFullYear();

  const balance = {
    totalIncome: 
      incomes.reduce((sum, income) => new Date(income.created_at).getMonth() === currentMonth && new Date(income.created_at).getFullYear() === currentYear ? sum + income.income : sum, 0),
    totalExpenses: 
      expenses.reduce((sum, expense) => new Date(expense.created_at).getMonth() === currentMonth && new Date(expense.created_at).getFullYear() === currentYear ? sum + expense.expense : sum, 0) 
      + groupExpenses.reduce((sum, contribution) => new Date(contribution.created_at).getMonth() === currentMonth && new Date(contribution.created_at).getFullYear() === currentYear ? sum + contribution.income : sum, 0)
      + objectivesExpenses.reduce((sum, contribution) => new Date(contribution.created_at).getMonth() === currentMonth && new Date(contribution.created_at).getFullYear() === currentYear ? sum + contribution.income : sum, 0),
    netBalance: 
      incomes.reduce((sum, income) => new Date(income.created_at).getMonth() === currentMonth && new Date(income.created_at).getFullYear() === currentYear ? sum + income.income : sum, 0) 
      - expenses.reduce((sum, expense) => new Date(expense.created_at).getMonth() === currentMonth && new Date(expense.created_at).getFullYear() === currentYear ? sum + expense.expense : sum, 0) 
      - groupExpenses.reduce((sum, contribution) => new Date(contribution.created_at).getMonth() === currentMonth && new Date(contribution.created_at).getFullYear() === currentYear ? sum + contribution.income : sum, 0)
      - objectivesExpenses.reduce((sum, contribution) => new Date(contribution.created_at).getMonth() === currentMonth && new Date(contribution.created_at).getFullYear() === currentYear ? sum + contribution.income : sum, 0)
  };

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
          <p className="text-gray-500 dark:text-gray-400 text-lg animate-pulse">Cargando balance...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm mt-8">
            <div className="bg-slate-100 p-5 rounded-full mb-5 shadow-inner">
                <Receipt className="h-12 w-12 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Aún no hay transacciones</h3>
            <p className="text-slate-500 max-w-sm text-sm mb-6">
                Tu balance se mostrará aquí una vez que comiences a registrar tus ingresos y gastos.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => setIncomeModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <TrendingUp className="mr-2 h-4 w-4" /> Agregar Ingreso
                </Button>
                <Button onClick={() => setExpenseModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white">
                    <TrendingDown className="mr-2 h-4 w-4" /> Agregar Gasto
                </Button>
            </div>
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
                  {Symbol}{balance.totalIncome.toFixed(2)}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Este mes
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-8" 
                    onClick={() => setIncomeModalOpen(true)}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" /> Añadir Ingreso
                  </Button>
                </div>
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
                    onClick={() => setExpenseModalOpen(true)}
                  >
                    <div className="bg-red-500 p-3 rounded-full">
                      <TrendingDown className="h-5 w-5 text-white" />
                    </div>
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {Symbol}{balance.totalExpenses.toFixed(2)}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Este mes
                  </p>
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700 text-white shadow-sm h-8" 
                    onClick={() => setExpenseModalOpen(true)}
                  >
                    <TrendingDown className="mr-2 h-4 w-4" /> Añadir Gasto
                  </Button>
                </div>
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
                  {Symbol}{balance.netBalance.toFixed(2)}
                </p>
                <div className="flex items-center mt-4 h-8"> 
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Disponible
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">
                Transacciones Recientes
              </h2>
              <Button variant="outline" className="mt-8" onClick={() => navigate('/transactions')}>
                Ver todas
              </Button>
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
                              {transaction.type === 'income' ? '+' : '-'}{Symbol}{transaction.amount.toFixed(2)}
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